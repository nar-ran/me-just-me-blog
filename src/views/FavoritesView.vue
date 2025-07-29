<template>
  <AppHeaderComponent />
  <div class="container">
    <FavoritesPostsComponent />
  </div>
</template>

<script>
  import AppHeaderComponent from '@/components/AppHeaderComponent/AppHeaderComponent.vue';
  import FavoritesPostsComponent from '@/components/Posts/FavoritesPostsComponent.vue';

  export default {
    components: {
      AppHeaderComponent,
      FavoritesPostsComponent,
    },
  };
</script>
