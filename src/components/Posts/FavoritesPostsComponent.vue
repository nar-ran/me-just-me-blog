<template>
  <div class="container">
    <div class="title-section"><p>Favoritos</p></div>

    <div v-for="post in posts" :key="post.entrada_id" class="post-card">
      <div class="post-header">
        <span>{{ post.titulo }}</span>
        <span class="post-date">{{ formatDate(post.fecha) }}</span>
      </div>
      <p class="post-content multiline-ellipsis">
        {{ getPlainText(post.contenido) }}
      </p>
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
        const { data, error } = await supabase
          .from('entradas')
          .select('entrada_id, titulo, contenido, fecha')
          .eq('favorito', true)
          .order('fecha', { ascending: false });

        if (error) {
          this.error = 'No se pudieron cargar los favoritos';
          return;
        }

        this.posts = data;
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
    cursor: pointer;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    font-size: 1.4em;
    margin-bottom: 10px;
    color: var(--text-color);
  }

  .post-date {
    font-size: 0.90em;
    white-space: nowrap;
    padding-left: 10px;
    color: var(--text-color);
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

  @media (max-width: 768px) {
    .container {
      padding: 0px;
    }
  }
</style>
