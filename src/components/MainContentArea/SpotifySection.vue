<template>
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
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import axios from 'axios';

  const CLIENT_ID = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VUE_APP_SPOTIFY_REDIRECT_URI;
  const SCOPES = 'user-read-recently-played user-read-currently-playing';

  const accessToken = ref(null);
  const latestTrack = ref(null);
  const error = ref(null);
  let pollingInterval = null;
  const POLLING_RATE_MS = 30000;

  function formatDuration(ms) {
    if (typeof ms !== 'number' || ms < 0) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function loginWithSpotify() {
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
    window.location.href = authUrl;
  }

  async function getLatestTrack() {
    if (!accessToken.value) return;
    error.value = null;

    try {
      const currentPlaying = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: { Authorization: `Bearer ${accessToken.value}` } }
      );

      if (currentPlaying.status === 200 && currentPlaying.data?.item) {
        latestTrack.value = currentPlaying.data.item;
        return;
      }

      const recent = await axios.get(
        'https://api.spotify.com/v1/me/player/recently-played?limit=1',
        { headers: { Authorization: `Bearer ${accessToken.value}` } }
      );

      if (recent.status === 200 && recent.data?.items?.length > 0) {
        latestTrack.value = recent.data.items[0].track;
      } else {
        latestTrack.value = null;
        error.value = 'No hay actividad en Spotify.';
      }
    } catch (err) {
      latestTrack.value = null;
      error.value = 'Error al obtener la información de Spotify.';

      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem('spotify_access_token');
        stopPolling();
        error.value = 'Tu sesión de Spotify ha caducado. Conéctate de nuevo.';
      } else if (status === 403) {
        error.value =
          'Permisos insuficientes para acceder a Spotify. Acepta los permisos.';
      } else {
        error.value = 'Ocurrió un error inesperado con Spotify.';
      }
    }
  }

  function startPolling() {
    getLatestTrack();
    stopPolling();
    pollingInterval = setInterval(getLatestTrack, POLLING_RATE_MS);
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  onMounted(() => {
    const stored = localStorage.getItem('spotify_access_token');
    if (stored) {
      accessToken.value = stored;
      startPolling();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      axios
        .post(
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
        )
        .then((res) => {
          accessToken.value = res.data.access_token;
          localStorage.setItem('spotify_access_token', accessToken.value);
          startPolling();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        })
        .catch(() => {
          error.value = 'No se pudo obtener el token de acceso.';
        });
    }
  });

  onBeforeUnmount(() => {
    stopPolling();
  });
</script>

<style scoped>
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

  .music-container {
    display: grid;
    place-items: center;
    border-radius: 10px;
    font-size: 1.4em;
    text-align: left;
    height: 100%;
  }

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

  .spotify-track-info {
    margin: 0;
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
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .spotify-track-duration {
    color: var(--text-color);
    white-space: nowrap;
    flex-shrink: 0;
    margin: 0;
  }

  .spotify-artist-name {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8em;
    color: var(--text-color);
    width: 100%;
    word-break: break-word;
    overflow-wrap: break-word;
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

  .spotify-error-message {
    margin-bottom: 0;
  }

  .spotify-message {
    font-style: italic;
    opacity: 0.8;
  }

  @media (max-width: 980px) {
    .spotify-track-display {
      flex-direction: row;
      align-items: center;
      max-width: none;
      padding: 10px;
      gap: 1em;
    }

    .spotify-album-cover {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .spotify-track-info {
      flex-grow: 1;
      margin-top: 0;
    }

    .spotify-track-name,
    .spotify-artist-name {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }
  }
</style>
