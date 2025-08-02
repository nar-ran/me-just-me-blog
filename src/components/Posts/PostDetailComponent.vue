<template>
  <div v-if="loading" class="loading-container">
    <p>Cargando entrada...</p>
  </div>

  <div v-else-if="error" class="error-container">
    <p>{{ error }}</p>
  </div>

  <div v-else-if="post" class="post-detail-container">
    <header class="post-header">
      <h1 class="post-title">{{ post.titulo }}</h1>

      <div class="post-info">
        <span v-if="post.usuarios" class="author-name">{{
          post.usuarios.usuario
        }}</span>

        <div v-if="categories.length" class="categories-list">
          <span v-for="cat in categories" :key="cat.slug" class="category-tag">
            #{{ cat.nombre }}
          </span>
        </div>

        <span class="post-date">{{ formatDate(post.fecha) }}</span>
      </div>
    </header>

    <hr />

    <section class="post-content" v-html="post.contenido"></section>
  </div>

  <ErrorMessagePopup v-if="error" :message="error" @close="error = ''" />
</template>

<script>
  import { supabase } from '@/stores/supabase';

  export default {
    name: 'PostDetailComponent',
    data() {
      return {
        post: null,
        loading: true,
        error: null,
      };
    },
    computed: {
      categories() {
        return (
          this.post?.post_categorias
            ?.map((pc) => pc.categorias)
            .filter((c) => c) || []
        );
      },
    },
    created() {
      this.fetchPost();
    },

    methods: {
      async fetchPost() {
        this.loading = true;

        const slug = this.$route.params.slug;
        if (!slug) {
          this.error = 'No se ha especificado una entrada para cargar.';
          this.loading = false;
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (!userId) {
          this.error = 'No has iniciado sesión.';
          this.loading = false;
          return;
        }

        try {
          const { data, error } = await supabase
            .from('entradas')
            .select(
              `
                titulo,
                contenido,
                fecha,
                usuarios ( usuario ),
                post_categorias ( categorias ( nombre, slug ) )
              `
            )
            .eq('slug', slug)
            .eq('usuario_id', userId)
            .single();

          if (error) throw error;

          this.post = data;
          document.title = `${data.titulo} | Me Just Me`;
        } catch (err) {
          if (err?.code === 'PGRST116') {
            this.$router.replace('/not-found');
          } else {
            this.error = 'Ocurrió un error al cargar la entrada.';
          }
        } finally {
          this.loading = false;
        }
      },

      formatDate(dateStr) {
        if (!dateStr) return '';
        return new Intl.DateTimeFormat('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(dateStr));
      },
    },
    watch: {
      '$route.params.slug': 'fetchPost',
    },
  };
</script>

<style scoped>
  .post-detail-container {
    padding: 2em;
    color: var(--text-color);
  }

  h1 {
    margin: 0;
    margin-bottom: 0.7em;
  }

  .post-title {
    font-size: 2.7em;
    font-weight: normal;
    margin-bottom: 0.5em;
    text-align: center;

    color: var(--primary-color);
    -webkit-text-stroke: 0.7px var(--text-color);
    text-stroke: 0.7px var(--text-color);
  }

  .post-info {
    font-size: 1.1em;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3em;
    flex-wrap: wrap;
    color: var(--text-color);
  }

  .categories-list {
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
  }

  .category-tag {
    padding: 0.3em 0.8em;
    border-radius: 15px;
    font-size: 0.9em;
    opacity: 0.9;

    background-color: var(--primary-color);
  }

  hr {
    margin: 2em 0;
    margin-top: 1.5em;
    width: 100%;
    height: 2px;
    border: none;
    border-radius: 50px;
    background: linear-gradient(
      45deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  .post-content {
    font-size: 1.2em;
    line-height: 1.6;
    text-align: left;
  }

  .post-content :deep(p) {
    margin: 0;
  }

  .post-content :deep(.ql-align-center),
  .post-content :deep(.text-center) {
    text-align: center;
  }

  .loading-container,
  .error-container,
  .not-found-container {
    text-align: center;
    padding: 3em;
    font-size: 1.2em;
  }

  @media (max-width: 420px) {
    .post-info {
      gap: 2em;
    }
  }
</style>
