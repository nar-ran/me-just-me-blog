<template>
  <div class="container">
    <div class="title-section"><p>Favoritos</p></div>

    <div v-if="posts.length > 0">
      <router-link
        v-for="post in posts"
        :key="post.entrada_id"
        :to="{ name: 'post-detail', params: { slug: post.slug } }"
        class="post-link">
        <div class="post-card">
          <div class="post-header">
            <span>{{ post.titulo }}</span>

            <span class="right-info">
              <span class="post-date">{{ formatDate(post.fecha) }}</span>

              <span
                class="material-symbols-outlined favorite-icon"
                @click.stop.prevent="removeFavorite(post.entrada_id)">
                favorite
              </span>
            </span>
          </div>

          <p class="post-content multiline-ellipsis">
            {{ getPlainText(post.contenido) }}
          </p>
        </div>
      </router-link>
    </div>
    <div v-else class="no-favorites-message">
      <p>Aún no has añadido ninguna entrada a favoritos.</p>
    </div>

    <ErrorMessagePopup v-if="error" :message="error" @close="error = ''" />
  </div>
</template>

<script>
  import { supabase } from '@/stores/supabase';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';

  export default {
    name: 'FavoritesPostsComponent',
    components: { ErrorMessagePopup },
    data() {
      return {
        posts: [],
        error: '',
      };
    },
    methods: {
      async fetchFavorites() {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const { data, error } = await supabase
              .from('entradas')
              .select('entrada_id, titulo, contenido, fecha, slug')
              .eq('favorito', true)
              .eq('usuario_id', user.id)
              .order('fecha', { ascending: false });

            if (error) throw error;

            const validPosts = data.filter((post) => post && post.slug);
            this.posts = validPosts;
          }
        } catch (err) {
          this.error = 'No se pudieron cargar los favoritos';
        }
      },
      formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
      getPlainText(html) {
        const tempElem = document.createElement('div');
        tempElem.innerHTML = html;
        return tempElem.textContent || tempElem.innerHTML || '';
      },
      async removeFavorite(idPost) {
        try {
          const { error } = await supabase
            .from('entradas')
            .update({ favorito: false })
            .eq('entrada_id', idPost);

          if (error) throw error;

          this.posts = this.posts.filter((post) => post.entrada_id !== idPost);
        } catch (err) {
          this.error = 'No se pudo quitar de favoritos.';
        }
      },
    },
    mounted() {
      this.fetchFavorites();
    },
  };
</script>

<style scoped>
  .container {
    padding: 40px 20px;
    margin: 0 auto;
    width: 100%;
  }

  .title-section {
    font-size: 2em;
    text-align: center;
    font-family: var(--font-primary);
    color: var(--text-color);
    margin-bottom: 20px;
  }

  .post-card {
    background: linear-gradient(
      to right,
      var(--primary-color),
      var(--secondary-color)
    );
    border-radius: 16px;
    padding: 22px 26px;
    margin-bottom: 28px;
    color: var(--text-color);
    font-family: var(--font-primary);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease;
  }

  .post-card:hover {
    transform: scale(1.01);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    font-size: 1.4em;
    margin-bottom: 10px;
    color: var(--text-color);
  }

  .right-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .post-date {
    font-size: 0.9em;
    white-space: nowrap;
    padding-left: 10px;
    color: var(--text-color);
  }

  .favorite-icon {
    font-size: 0.9em;
    font-variation-settings: 'FILL' 1;
    cursor: pointer;
    vertical-align: middle;
  }

  .favorite-icon:hover {
    font-variation-settings: 'FILL' 0;
    text-shadow: 0 0 10px var(--text-color);

    transform: scale(1.2);
    transition:
      color 0.2s,
      transform 0.2s;
  }

  .post-content {
    font-size: 0.95em;
    color: rgba(247, 247, 247, 0.58);
    white-space: pre-wrap;
    margin-top: 5px;
    padding-left: 15px;
  }

  .multiline-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-link {
    text-decoration: none;
    color: inherit;
  }

  .no-favorites-message {
    text-align: center;
    font-size: 1.2em;
    margin-top: 2em;
    color: var(--text-color);
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0px;
    }
  }
</style>
