<template>
  <p class="title">Entradas</p>
  <div v-if="paginatedPosts.length > 0" class="main-posts-container">
    <router-link
      v-for="post in paginatedPosts"
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

  <!-- Controles de paginación -->
  <div v-if="totalPages > 1" class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
    <span>Página {{ currentPage }} de {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">
      Siguiente
    </button>
  </div>
</template>

<script>
  import { supabase } from '@/stores/supabase';

  export default {
    name: 'PostsSectionComponent',
    data() {
      return {
        posts: [],
        currentPage: 1,
        perPage: 7,
        error: null,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.posts.length / this.perPage);
      },
      paginatedPosts() {
        const start = (this.currentPage - 1) * this.perPage;
        return this.posts.slice(start, start + this.perPage);
      },
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
        }
      } catch (err) {
        return;
      }
    },
    methods: {
      dateFormatted(originDate) {
        const date = new Date(originDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        return `${day}${month}${year}`;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
    },
  };
</script>

<style scoped>
  /* top container sections (posts) */
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

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin-top: 1em;
  }

  .pagination button {
    font-family: var(--primary-font);
    background: var(--primary-color);
    color: var(--text-color);
    border: none;
    padding: 0.5em 1em;
    border-radius: 8px;
    cursor: pointer;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
