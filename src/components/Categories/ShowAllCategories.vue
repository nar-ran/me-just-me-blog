<template>
  <div class="title-section"><p>Categorias</p></div>
  <div class="accordion">
    <div
      v-for="(cat, i) in categories"
      :key="cat.categoria_id"
      class="accordion-item">
      <button class="accordion-header" @click="toggle(i)">
        {{ cat.nombre }} ({{ cat.total }})
        <span class="arrow">{{ openIndex === i ? '▲' : '▼' }}</span>
      </button>

      <div v-show="openIndex === i" class="accordion-content">
        <div v-for="post in cat.posts" :key="post.titulo" class="post-row">
          <span>|– {{ post.titulo }}</span>
          <span class="post-date">{{ formatDate(post.fecha) }}</span>
        </div>
      </div>
    </div>
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
        const { data, error } = await supabase.from('categorias').select(`
          categoria_id,
          nombre,
          post_categorias (
          entradas:post_id (
              titulo,
              fecha
          )
          )
      `);

        if (error) {
          this.errorCategory = 'Error al cargar las categorías.';
          return;
        }

        this.categories = data.map((cat) => {
          const postsOrdenados = cat.post_categorias
            .map((p) => p.entradas)
            .filter(Boolean)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // orden descendente por fecha

          return {
            categoria_id: cat.categoria_id,
            nombre: cat.nombre,
            posts: postsOrdenados,
            total: cat.post_categorias.length,
          };
        });
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

  .post-date {
    color: var(--text-color);
    font-family: var(--font-primary);
  }

  .arrow {
    margin-left: 10px;
    font-size: 0.8em;
  }
</style>
