<template>
  <div class="main-categories-container">
    <component
      :is="categories.length > 0 ? 'router-link' : 'div'"
      :to="categories.length > 0 ? '/categories' : null"
      class="categories-link">
      <p class="title">Categorías</p>
      <div v-if="categories.length > 0">
        <div
          v-for="category in categories"
          :key="category.id"
          class="categories-container">
          <p class="category-name">{{ category.nombre }}</p>
          <p class="category-post-count">{{ category.postCount }}</p>
        </div>
      </div>
      <div v-else class="no-categories-message">
        <p>Aún no has creado categorías.</p>
      </div>
    </component>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useCategories } from '@/composables/useCategories';

  const { categories, fetchCategories } = useCategories();

  onMounted(() => {
    fetchCategories();
  });
</script>

<script>
  export default {
    name: 'CategoriesSection',
  };
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

  .categories-link {
    text-decoration: none;
    color: var(--text-color);
    max-width: 100%;
    overflow-x: hidden;
  }

  .title {
    font-size: 2em;
    text-align: center;
  }

  .categories-container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    margin: 0;
    padding: 0em 2em;
    font-size: 1.4em;
    max-width: 100%;
    overflow-x: hidden;
  }

  .categories-container p {
    margin: 0 0 1em 0;
  }

  .category-name {
    text-align: left;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .category-post-count {
    text-align: right;
  }

  .no-categories-message {
    text-align: center;
    font-style: italic;
    opacity: 0.8;
  }
</style>
