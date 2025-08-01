<template>
  <div class="title-section">
    <p>Categorias</p>
  </div>

  <div v-if="categories.length > 0" class="accordion">
    <div
      v-for="(cat, i) in categories"
      :key="cat.categoria_id"
      class="accordion-item">
      <button class="accordion-header" @click="toggle(i)">
        <span>{{ cat.nombre }} ({{ cat.total }})</span>

        <div class="header-icons">
          <span class="arrow">{{ openIndex === i ? '▲' : '▼' }}</span>

          <span
            v-if="cat.nombre !== 'Sin Categoría'"
            class="material-symbols-outlined delete-category-icon"
            title="Eliminar categoría"
            @click.stop="promptDeleteCategory(cat, i)">
            delete_forever
          </span>
        </div>
      </button>

      <Transition name="height-transition">
        <div v-if="openIndex === i" class="accordion-content">
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
                      ? post.favorito
                        ? `'FILL' 0`
                        : `'FILL' 1`
                      : post.favorito
                        ? `'FILL' 1`
                        : `'FILL' 0`,
                  }"
                  @mouseenter="post.hover = true"
                  @mouseleave="post.hover = false"
                  @click.stop.prevent="toogleFavorite(post)">
                  favorite
                </span>

                <span>|– {{ post.titulo }}</span>
              </span>

              <span class="right-info">
                <span class="post-date">{{ formatDate(post.fecha) }}</span>

                <span
                  class="material-symbols-outlined delete-icon"
                  title="Eliminar post"
                  @click.stop.prevent="promptDeletePost(post, i)">
                  delete
                </span>

                <span
                  class="material-symbols-outlined edit-icon"
                  title="Editar post"
                  @click.stop.prevent="goToEditPost(post)">
                  edit_note
                </span>
              </span>
            </div>
          </router-link>
        </div>
      </Transition>
    </div>
  </div>

  <div v-else class="no-categories-message">
    <p>Aún no has creado ninguna categoría.</p>
  </div>

  <ErrorMessagePopup
    v-if="errorCategory"
    :message="errorCategory"
    @close="errorCategory = ''" />

  <ConfirmActionModal
    v-if="showConfirmModal"
    :message="confirmMessage"
    @close="cancelDelete"
    @confirm="confirmDelete" />
</template>

<script>
  import { supabase } from '@/stores/supabase';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';
  import ConfirmActionModal from '../Utils/ConfirmActionModal.vue';

  export default {
    name: 'CategoryAccordion',
    components: {
      ErrorMessagePopup,
      ConfirmActionModal,
    },
    data() {
      return {
        categories: [],
        openIndex: 0,
        errorCategory: '',
        showConfirmModal: false,
        itemToDelete: null,
        deleteType: null,
      };
    },
    computed: {
      confirmMessage() {
        if (!this.itemToDelete) return '';

        if (this.deleteType === 'post') {
          return `¿Estás seguro de que quieres eliminar el post "${this.itemToDelete.post.titulo}"?`;
        } else if (this.deleteType === 'category') {
          return `¿Estás seguro de que quieres eliminar la categoría "${this.itemToDelete.category.nombre}"? Todos los posts asociados a esta categoría se reasignarán a "Sin Categoría".`;
        }

        return '';
      },
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
                        slug,
                        entrada_id
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

      goToEditPost(post) {
        this.$router.push({
          name: 'edit-post',
          params: { slug: post.slug },
        });
      },

      promptDeletePost(post, catIndex) {
        this.itemToDelete = { post, catIndex };
        this.deleteType = 'post';
        this.showConfirmModal = true;
      },
      promptDeleteCategory(category, catIndex) {
        this.itemToDelete = { category, catIndex };
        this.deleteType = 'category';
        this.showConfirmModal = true;
      },
      cancelDelete() {
        this.showConfirmModal = false;
        this.itemToDelete = null;
        this.deleteType = null;
      },

      async confirmDelete() {
        if (!this.itemToDelete) return;

        try {
          if (this.deleteType === 'post') {
            await this.performDeletePost();
          } else if (this.deleteType === 'category') {
            await this.performDeleteCategory();
          }
        } catch (err) {
          this.errorCategory =
            err.message || 'Un error inesperado impidió la eliminación.';
        } finally {
          this.cancelDelete();
        }
      },

      async performDeletePost() {
        const { post, catIndex } = this.itemToDelete;
        const { error, count } = await supabase
          .from('entradas')
          .delete({ count: 'exact' })
          .eq('slug', post.slug);
        if (error) throw error;
        if (count === 0) {
          throw new Error(
            'No se pudo eliminar el post. Es posible que ya no exista o no tengas permisos.'
          );
        }

        const category = this.categories[catIndex];
        category.posts = category.posts.filter((p) => p.slug !== post.slug);
        category.total = category.posts.length;
      },

      async performDeleteCategory() {
        const { category, catIndex } = this.itemToDelete;
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
        }

        const { error } = await supabase.rpc('delete_category_with_reassign', {
          category_to_delete_id: category.categoria_id,
          user_id_param: user.id,
        });

        if (error) {
          throw new Error(error.message);
        }

        this.categories.splice(catIndex, 1);

        if (this.openIndex === catIndex) {
          this.openIndex = null;
        }

        if (this.openIndex !== null && catIndex < this.openIndex) {
          this.openIndex--;
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
    margin: 0 2em;
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

  /* Transiciones para el acordeón */
  .height-transition-enter-active,
  .height-transition-leave-active {
    transition:
      max-height 0.3s ease-in-out,
      padding 0.3s ease-in-out;
    overflow: hidden;
  }

  .height-transition-enter-from,
  .height-transition-leave-to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
  }

  .height-transition-enter-to,
  .height-transition-leave-from {
    max-height: 500px;
    padding-top: 12px;
    padding-bottom: 12px;
    opacity: 1;
  }

  .header-icons {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .arrow {
    font-size: 0.8em;
  }

  .delete-category-icon {
    font-size: 1.1em;

    transition: all 0.2s ease;
  }

  .delete-category-icon:hover {
    opacity: 1;
    text-shadow: 0 0 10px var(--text-color);
    transform: scale(1.2);
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

  .right-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .post-date {
    color: var(--text-color);
    font-family: var(--font-primary);
  }

  .delete-icon {
    font-size: 0.9em;
    cursor: pointer;
    vertical-align: middle;
  }

  .delete-icon:hover {
    transform: scale(1.2);

    transition:
      opacity 0.2s,
      transform 0.2s;
  }

  .edit-icon {
    font-size: 0.9em;
    cursor: pointer;
    vertical-align: middle;
  }

  .edit-icon:hover {
    transform: scale(1.2);

    transition:
      opacity 0.2s,
      transform 0.2s;
  }
</style>
