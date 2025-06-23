<template>
  <div class="container">
    <div class="title-section"><p>Favoritos</p></div>

    <div v-for="post in posts" :key="post.entrada_id" class="post-card">
      <div class="post-header">
        <strong>{{ post.titulo }}</strong>
        <span class="post-date">{{ formatDate(post.fecha) }}</span>
      </div>
      <p class="post-content" v-html="post.contenido"></p>
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
    },
    mounted() {
      this.fetchFavorites();
    },
  };
</script>

<style scoped>
.container {
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.title-section {
  font-size: 2em;
  text-align: center;
  font-family: var(--font-primary);
  color: var(--text-color);
  margin-bottom: 30px;
}

.post-card {
  background: linear-gradient(to right, #c61d6b, #30052e);
  border-radius: 16px;
  padding: 22px 26px;
  margin-bottom: 28px;
  color: #fff;
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
  font-size: 1.1em;
  margin-bottom: 10px;
  font-weight: bold;
  color: #fff;
}

.post-date {
  font-size: 0.95em;
  white-space: nowrap;
  font-weight: bold;
  color: #fff;
}

.post-content {
  font-size: 0.95em;
  color: #e2d2e9;
  white-space: pre-wrap;
  margin-top: 4px;
}

</style>
