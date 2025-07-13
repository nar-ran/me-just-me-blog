<template>
  <div class="main-grid-container">
    <div class="top-grid">
      <p class="title">Entradas</p>
      <div v-if="posts.length > 0" class="main-posts-container">
        <router-link
          v-for="post in posts"
          :key="post.entrada_id"
          :to="{ name: 'post-detail', params: { slug: post.slug } }"
          class="posts-container post-link">
          <p class="post-date">D: {{ post.dateFormatted }}</p>
          <p class="post-title">{{ post.titulo }}</p>
        </router-link>
      </div>
      <div v-else class="no-posts-message">
        <p>Aún no hay entradas para mostrar. ¡Anímate a crear la primera!</p>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="main-categories-container">
        <component
          :is="categories.length > 0 ? 'router-link' : 'div'"
          :to="categories.length > 0 ? '/categories' : null"
          class="categories-link">
          <p class="title">Categorías</p>
          <div v-if="categories.length > 0">
            <div
              v-for="category in categories"
              :key="category.id"
              class="categories-container">
              <p class="category-name">{{ category.nombre }}</p>
              <p class="category-post-count">{{ category.postCount }}</p>
            </div>
          </div>
          <div v-else class="no-categories-message">
            <p>Aún no has creado categorías.</p>
          </div>
        </component>
      </div>

      <div class="main-categories-container">
        <div class="music-container">
          <div class="spotify-track-display">
            <img
              :src="
                latestTrack?.album?.images?.[0]?.url ||
                require('@/assets/img/music_default1.jpg')
              "
              alt="Carátula del álbum"
              class="spotify-album-cover"
              :class="{ 'default-aspect-ratio': !latestTrack }" />

            <!-- Info si hay canción -->
            <div class="spotify-track-info" v-if="latestTrack">
              <div class="spotify-title-duration-row">
                <p class="spotify-track-name">{{ latestTrack.name }}</p>
                <p class="spotify-track-duration">
                  {{ formatDuration(latestTrack.duration_ms) }}
                </p>
              </div>
              <p class="spotify-artist-name">
                {{ latestTrack.artists[0].name }}
              </p>
            </div>

            <!-- Mensajes si NO hay canción -->
            <a
              v-if="!accessToken"
              @click="loginWithSpotify"
              class="btn-spotify-login">
              <span class="material-symbols-outlined">account_circle</span>
              Conectar Spotify
            </a>

            <div class="spotify-track-info" v-else>
              <p
                v-if="!accessToken"
                class="spotify-message"
                style="text-align: center; padding: 0 30px">
                Inicia sesión en Spotify para ver tu última canción.
              </p>
              <p
                v-else-if="accessToken && !latestTrack && !error"
                class="spotify-message"
                style="text-align: center">
                No hay canciones en reproducción ni recientes.
              </p>
              <p v-else-if="error" class="spotify-error-message">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { supabase } from '@/stores/supabase';

  const CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VUE_APP_SPOTIFY_REDIRECT_URI;
  const SCOPES = 'user-read-recently-played user-read-currently-playing';

  export default {
    name: 'MainContentComponent',
    data() {
      return {
        posts: [],
        categories: [],
        accessToken: null,
        latestTrack: null,
        error: null,
        pollingInterval: null,
        POLLING_RATE_MS: 30000,
      };
    },
    async mounted() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: postsData, error: postsError } = await supabase
            .from('entradas')
            .select('entrada_id, titulo, fecha, publicado, slug')
            .eq('publicado', true)
            .eq('usuario_id', user.id)
            .order('fecha', { ascending: false });

          if (postsError) throw postsError;

          const validPosts = postsData.filter((post) => post && post.slug);

          this.posts = validPosts.map((post) => ({
            ...post,
            dateFormatted: this.dateFormatted(post.fecha),
          }));

          // categorias
          const { data: conteos, error } = await supabase
            .from('categoria_conteos')
            .select('*');

          if (error) throw error;

          const { data: categoriasData, error: catError } = await supabase
            .from('categorias')
            .select('*')
            .eq('usuario_id', user.id)
            .limit(3);

          if (catError) throw catError;

          this.categories = categoriasData.map((cat) => {
            const match = conteos.find(
              (c) => c.categoria_id === cat.categoria_id
            );
            return {
              ...cat,
              postCount: match?.post_count || 0,
            };
          });
        }
      } catch (err) {
        return;
      }

      const storedToken = localStorage.getItem('spotify_access_token');

      if (storedToken) {
        this.accessToken = storedToken;
        this.startPollingLatestTrack();
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
          const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: REDIRECT_URI,
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${authString}`,
              },
            }
          );

          this.accessToken = response.data.access_token;
          localStorage.setItem('spotify_access_token', this.accessToken);

          this.startPollingLatestTrack();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (err) {
          this.error = 'No se pudo obtener el token de acceso';
        }
      }
    },
    beforeUnmount() {
      this.stopPollingLatestTrack(); // Detener el polling al destruir el componente
    },
    methods: {
      dateFormatted(originDate) {
        const date = new Date(originDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        return `${day}${month}${year}`;
      },
      loginWithSpotify() {
        const state = Math.random().toString(36).substring(2, 15);
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
        window.location.href = authUrl;
      },
      async getLatestTrack() {
        if (!this.accessToken) {
          return;
        }

        this.error = null;

        try {
          // 1. Canción sonando
          const currentPlayingResponse = await axios.get(
            'https://api.spotify.com/v1/me/player/currently-playing',
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            }
          );

          if (
            currentPlayingResponse.status === 200 &&
            currentPlayingResponse.data &&
            currentPlayingResponse.data.item
          ) {
            this.latestTrack = currentPlayingResponse.data.item;
            return;
          }

          // 2. Si no hay una canción sonando
          const recentlyPlayedResponse = await axios.get(
            'https://api.spotify.com/v1/me/player/recently-played?limit=1',
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            }
          );

          if (
            recentlyPlayedResponse.status === 200 &&
            recentlyPlayedResponse.dataResponse &&
            recentlyPlayedResponse.data.items &&
            recentlyPlayedResponse.data.items.length > 0
          ) {
            this.latestTrack = recentlyPlayedResponse.data.items[0].track;
          } else {
            this.latestTrack = null;
            this.error = 'No hay actividad en Spotify.';
          }
        } catch (err) {
          this.latestTrack = null;
          this.error = 'Error al obtener la información de Spotify.';

          if (err.response && err.response.status === 401) {
            localStorage.removeItem('spotify_access_token');
            this.stopPollingLatestTrack();

            this.error =
              'Tu sesión de Spotify ha caducado. Conéctate de nuevo.';
          } else if (err.response && err.response.status === 403) {
            this.error =
              'Permisos insuficientes para acceder a Spotify. Asegúrate de aceptar los permisos necesarios.';
          } else {
            this.error = 'Ocurrió un error inesperado con Spotify.';
          }
        }
      },
      startPollingLatestTrack() {
        this.getLatestTrack();
        this.stopPollingLatestTrack(); // Por si acaso
        this.pollingInterval = setInterval(
          this.getLatestTrack,
          this.POLLING_RATE_MS
        );
      },
      stopPollingLatestTrack() {
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
      },
      formatDuration(ms) {
        if (typeof ms !== 'number' || ms < 0) {
          return '0:00';
        }

        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${minutes}:${formattedSeconds}`;
      },
    },
  };
</script>

<style scoped>
  .main-grid-container {
    display: grid;
    grid-template-rows: 2fr 1fr;
    box-sizing: border-box;
    gap: 2rem;
    height: 100%;
    min-height: 0;

    padding: 3.5em;
    border-radius: 15px;
    color: var(--text-color);

    background: linear-gradient(
      0deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  /* top container sections (posts) */
  .top-grid {
    min-height: 0;
    height: 100%;

    display: grid;
    grid-template-rows: auto 1fr;
  }

  .title {
    font-size: 2em;
    text-align: center;
  }

  .posts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0;
    padding: 0 1em;

    font-size: 1.4em;
  }

  .post-link {
    text-decoration: none;
    color: inherit;
  }

  .main-posts-container {
    overflow-y: auto;
    padding-top: 12px;
  }

  .posts-container p {
    margin: 0 0 1em 0;
    padding: 0;
    cursor: pointer;
  }

  .posts-container:hover {
    text-shadow: 0 0 20px var(--text-color);
  }

  .post-date {
    text-align: left;
  }

  .post-title {
    text-align: right;
  }

  .no-posts-message {
    text-align: center;
    font-size: 1.3em;
    margin-top: 2em;

    opacity: 50%;
  }

  .no-categories-message {
    text-align: center;
    font-size: 1.2em;
    margin-top: 1em;
    opacity: 0.7;
  }

  /* scrollbar styles */
  ::-webkit-scrollbar {
    width: 0.17em;
    height: 0.17em;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      0deg,
      var(--primary-color),
      var(--secondary-color)
    );

    border-radius: 100px;
  }

  /* bottom container sections */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
  }

  /* Categories container */
  .categories-link {
    text-decoration: none;
    color: var(--text-color);
  }

  .main-categories-container {
    --rosa-oscuro-diamente: #dc3485ac;
    --rosa-claro-diamante: #ff70b543;

    padding: 10px;
    border-radius: 10px;

    background-blend-mode: multiply;
    background-image:
      linear-gradient(
        to left,
        var(--background-color),
        var(--rosa-claro-diamante),
        var(--background-color)
      ),
      linear-gradient(
        to top,
        var(--background-color),
        var(--rosa-oscuro-diamente),
        var(--background-color)
      );

    background-position: center;
    background-repeat: no-repeat;
  }

  .categories-container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    margin: 0;

    padding: 0em 2em;
    font-size: 1.4em;
  }

  .categories-container p {
    margin: 0 0 1em 0;
  }

  .category-name {
    text-align: left;
  }

  .category-post-count {
    text-align: right;
  }

  /* Music container */
  .music-container {
    display: grid;
    place-items: center;
    border-radius: 10px;
    font-size: 1.4em;
    text-align: left;
    height: 100%;
  }

  .spotify-center-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .spotify-error-message {
    margin-bottom: 0;
  }

  .btn-spotify-login {
    border-radius: 50px;

    color: var(--text-color);
    text-align: center;
    font-size: 1.4em;

    padding: 1px 2px;

    cursor: pointer;
  }

  .btn-spotify-login:hover {
    text-shadow: 0 0 12px var(--text-color);
  }

  /* Cancion estilos */
  .spotify-track-display {
    border-radius: 10px;
    padding: 19px;
    max-width: 200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    color: var(--text-color);
  }

  .spotify-album-cover {
    width: 100%;
    border-radius: 5px;
    object-fit: cover;
    aspect-ratio: 1 / 1;
  }

  .spotify-album-cover.default-aspect-ratio {
    aspect-ratio: 16 / 9;
  }

  .spotify-track-details {
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .spotify-track-row {
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .spotify-artist-name {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8em;
    color: var(--text-color);
    width: 100%;
  }

  .spotify-track-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
    margin-top: 0;
  }

  .spotify-title-duration-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
    gap: 8px;
    margin-top: 0.3em;
  }

  .spotify-track-name {
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    margin: 0;
  }

  .spotify-track-duration {
    color: var(--text-color);
    white-space: nowrap;
    flex-shrink: 0;
    margin: 0;
  }

  /* Pantallas pequeñas */
  @media (max-width: 980px) {
    .main-grid-container {
      padding: 1.5em;
      grid-template-rows: auto auto;
    }

    .bottom-grid {
      grid-template-columns: auto;
      gap: 1rem;
    }

    .spotify-error-message {
      margin: 22px 0;
    }

    .spotify-track-display {
      flex-direction: row;
      align-items: center;
      max-width: none;
      width: 100%;
      padding: 10px;
      gap: 20px;
      border-radius: 10px;
    }

    .spotify-album-cover {
      width: 5em;
      height: 5em;
      margin-bottom: 0;
      flex-shrink: 0;
      object-fit: cover;
      aspect-ratio: 1 / 1;
    }

    .spotify-track-info {
      flex-grow: 1;
      width: auto;
      gap: 2px;
      padding: 0 5px;
    }

    .spotify-track-name {
      font-size: 1.1em;
    }

    .spotify-track-duration {
      font-size: 1.1em;
    }

    .spotify-artist-name {
      font-size: 0.9em;
    }
  }
</style>
