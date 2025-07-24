<template>
  <div class="category-section">
    <p class="title">Categorías</p>
    <div v-if="categories.length > 0" class="categories-list">
      <router-link
        v-for="category in categories"
        :key="category.categoria_id"
        :to="{ name: 'category-detail', params: { slug: category.slug } }"
        class="category-item">
        <span class="dot"></span>
        <span class="name">{{ category.nombre }}</span>
        <span class="count">({{ category.postCount }})</span>
      </router-link>
    </div>
    <div v-else class="no-categories-message">
      <p>No hay categorías disponibles todavía.</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CategoriesSection',
    props: {
      categories: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style scoped>
  .category-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.03);
    padding: 1em;
    border-radius: 12px;
    height: 100%;
  }

  .title {
    font-size: 1.5em;
    margin-bottom: 1em;
    text-align: center;
  }

  .categories-list {
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    overflow-y: auto;
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 0.5em;
    text-decoration: none;
    color: inherit;
    font-size: 1.2em;
    transition: text-shadow 0.2s ease;
  }

  .category-item:hover {
    text-shadow: 0 0 15px var(--text-color);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--text-color);
  }

  .name {
    flex-grow: 1;
  }

  .count {
    opacity: 0.7;
    font-size: 0.9em;
  }

  .no-categories-message {
    text-align: center;
    opacity: 0.6;
    font-style: italic;
    margin-top: auto;
    margin-bottom: 1em;
  }
</style>
