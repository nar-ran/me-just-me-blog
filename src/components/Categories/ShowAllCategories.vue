<template>
  <div class="title-section"><p>Categorias</p></div>
  <div v-if="categories.length > 0" class="accordion">
    <div
      v-for="(cat, i) in categories"
      :key="cat.categoria_id"
      class="accordion-item">
      <button class="accordion-header" @click="toggle(i)">
        {{ cat.nombre }} ({{ cat.total }})
        <span class="arrow">{{ openIndex === i ? '▲' : '▼' }}</span>
      </button>

      <div v-show="openIndex === i" class="accordion-content">
        <router-link
          v-for="post in cat.posts"
          :key="post.slug"
          :to="{ name: 'post-detail', params: { slug: post.slug } }"
          class="post-link">
          <div class="post-row">
            <span class="left-info">
              <span
                class="material-symbols-outlined favorite-icon"
                :style="{
                  fontVariationSettings: post.hover
                    ? (post.favorito ? `'FILL' 0` : `'FILL' 1`)
                    : (post.favorito ? `'FILL' 1` : `'FILL' 0`),
                }"
                @mouseenter="post.hover = true"
                @mouseleave="post.hover = false"
                @click.stop.prevent="toogleFavorite(post)">
                favorite
              </span>
              <span>|– {{ post.titulo }}</span>
            </span>
            <span class="post-date">{{ formatDate(post.fecha) }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <div v-else class="no-categories-message">
    <p>Aún no has creado ninguna categoría.</p>
  </div>

  <ErrorMessagePopup
    v-if="errorCategory"
    :message="errorCategory"
    @close="errorCategory = ''" />
</template>

<script>
  import { supabase } from '@/stores/supabase';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';

  export default {
    name: 'CategoryAccordion',
    components: {
      ErrorMessagePopup,
    },
    data() {
      return {
        categories: [],
        openIndex: null,
        errorCategory: '',
      };
    },
    methods: {
      toggle(i) {
        this.openIndex = this.openIndex === i ? null : i;
      },
      formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-CO', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });
      },
      async fetchCategories() {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          const { data, error } = await supabase
            .from('categorias')
            .select(
              `
            categoria_id,
            nombre,
            post_categorias (
              entradas:post_id (
                  titulo,
                  fecha,
                  favorito,
                  slug
              )
            )
          `
            )
            .eq('usuario_id', user.id);

          if (error) {
            this.errorCategory = 'Error al cargar las categorías.';
            return;
          }

          this.categories = data.map((cat) => {
            const postsValidosYOrdenados = cat.post_categorias
              .map((p) => ({
                ...p.entradas,
                favorito: p.entradas.favorito,
                hover: false,
              }))
              .filter((post) => post && post.slug)
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            return {
              categoria_id: cat.categoria_id,
              nombre: cat.nombre,
              posts: postsValidosYOrdenados,
              total: postsValidosYOrdenados.length,
            };
          });
        } catch (err) {
          this.errorCategory = 'Ocurrió un error al obtener las categorías.';
        }
      },
      async toogleFavorite(post) {
        try {
          const { error } = await supabase
            .from('entradas')
            .update({ favorito: !post.favorito })
            .eq('slug', post.slug);

          if (error) throw error;

          post.favorito = !post.favorito;
        } catch (err) {
          this.errorCategory = 'No se pudo actualizar el favorito.';
        }
      },
    },
    mounted() {
      this.fetchCategories();
    },
  };
</script>

<style scoped>
  .title-section {
    font-size: 2em;
    text-align: center;
  }

  .no-categories-message {
    text-align: center;
    font-size: 1.2em;
    margin-top: 2em;
    color: var(--text-color);
    opacity: 0.7;
  }

  .accordion {
    display: flex;
    flex-direction: column;
  }

  .accordion-item {
    overflow: hidden;
    background-color: transparent;

    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.562);
  }

  .accordion-item:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  .accordion-item:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .accordion-header {
    font-family: var(--font-primary);
    font-size: 1.3em;
    color: var(--text-color);

    background: linear-gradient(to right, #761c47, var(--primary-color));
    width: 100%;
    padding: 10px 16px;
    border: none;

    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .accordion-content {
    background-color: var(--secondary-color);
    padding: 12px 20px;
  }

  .arrow {
    margin-left: 10px;
    font-size: 0.8em;
  }

  .post-link {
    text-decoration: none;
    color: inherit;
  }

  .post-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.3em;
    padding: 4px 0;
    border-bottom: 1px solid var(--secondary-color);
  }

  .post-row:hover {
    text-shadow: 0 0 8px var(--text-color);
    cursor: pointer;
  }

  .left-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .favorite-icon {
    font-size: 0.9em;
    cursor: pointer;
    vertical-align: middle;
  }

  .favorite-icon:hover {
    text-shadow: 0 0 10px var(--text-color);

    transform: scale(1.2);
    transition:
      color 0.2s,
      transform 0.2s;
  }

  .post-date {
    color: var(--text-color);
    font-family: var(--font-primary);
  }
</style>
