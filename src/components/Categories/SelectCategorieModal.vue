<template>
  <div class="modal-overlay">
    <div class="modal">
      <span class="close-button" @click="$emit('close')"> &times; </span>

      <div class="section-title" @click="showCategories">
        <p>Categorias</p>
      </div>

      <div class="category-list">
        <div
          class="category-item"
          v-for="cat in categories"
          :key="cat.categoria_id"
          @click="selectCategory(cat)"
          :class="{
            selected: selectedCategory?.categoria_id === cat.categoria_id,
          }">
          <div class="left">
            <span class="dot"></span>
            <span class="name">{{ cat.nombre }}</span>
          </div>
          <div class="right">
            {{ cat.total }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <ErrorMessagePopup
    v-if="errorCategory"
    :message="errorCategory"
    @close="errorCategory = ''" />

  <AlertMessageModal
    v-if="infoCategory"
    :message="infoCategory"
    @close="infoCategory = ''" />
</template>

<script>
  import { supabase } from '@/stores/supabase';
  import { ref, onMounted } from 'vue';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';
  import AlertMessageModal from '../Utils/AlertMessageModal.vue';

  export default {
    name: 'SelectCategoryModal',
    components: { ErrorMessagePopup, AlertMessageModal },
    setup(_, { emit }) {
      const errorCategory = ref('');
      const infoCategory = ref('');

      const categories = ref([]);
      const selectedCategory = ref(null);

      const selectCategory = (cat) => {
        selectedCategory.value = cat;
        emit('select-category', cat);
        emit('close');
      };

      const showCategories = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          errorCategory.value = 'Usuario no autenticado.';
          return;
        }

        const { data: conteos, conteoError } = await supabase
          .from('categoria_conteos')
          .select('*');

        if (conteoError) {
          errorCategory.value = 'No se pudieron obtener los conteos.';
          return;
        }

        const { data: categoriesData, error: errorQuery } = await supabase
          .from('categorias')
          .select('categoria_id, nombre')
          .eq('usuario_id', user.id);

        if (errorQuery)
          return (errorCategory.value = 'No se pudo listar las categorias.');

        categories.value = categoriesData.map((cat) => {
          const conteo = conteos.find(
            (c) => c.categoria_id === cat.categoria_id
          );
          return {
            ...cat,
            total: conteo?.post_count ?? 0,
          };
        });
      };

      onMounted(() => {
        showCategories();
      });

      return {
        showCategories,
        categories,
        selectCategory,
        errorCategory,
        infoCategory,
      };
    },
  };
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-color-op50);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .modal {
    background: var(--background-color);
    padding: 4rem 3.5rem;
    border-radius: 1rem;
    width: 30%;

    z-index: 10001;
    max-height: 90vh;
    overflow: hidden;
  }

  .close-button {
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    cursor: pointer;
    font-size: 1.7rem;
    color: var(--text-color);
    transition: transform 0.2s ease;
    z-index: 10002;
  }

  .close-button:hover {
    transform: scale(1.2);
    text-shadow: 0 0 8px var(--text-color);
  }

  .section-title p {
    font-size: 1.4em;
    text-align: center;
    margin: 0 0 25px 0;
  }

  .category-list {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    max-height: 300px;
    overflow-y: auto;
    padding-right: 18px;
  }

  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-primary);
    font-size: 1.2em;
    color: var(--text-color);
  }

  .category-item:hover {
    text-shadow: 0 0 20px var(--text-color);
    cursor: pointer;
  }

  .category-list::-webkit-scrollbar {
    width: 0.2em;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 0.8em;
  }

  .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(
      145deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  @media (max-width: 768px) {
    .modal {
      width: 70%;
      font-size: 0.9em;
    }
  }
</style>
