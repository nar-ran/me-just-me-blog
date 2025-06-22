<template>
  <div class="container">
    <AppHeaderComponent />
    <ShowAllCategories />
  </div>
</template>

<script>
  import AppHeaderComponent from '@/components/AppHeaderComponent/AppHeaderComponent.vue';
  import ShowAllCategories from '@/components/Categories/ShowAllCategories.vue';

  export default {
    components: {
      AppHeaderComponent,
      ShowAllCategories,
    },
  };
</script>
