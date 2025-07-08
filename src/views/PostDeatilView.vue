<template>
  <AppHeaderComponent />
  <PostDetailComponent />
</template>
<script>
  import AppHeaderComponent from '@/components/AppHeaderComponent/AppHeaderComponent.vue';
  import PostDetailComponent from '@/components/Posts/PostDetailComponent.vue';

  export default {
    components: {
      AppHeaderComponent,
      PostDetailComponent,
    },
  };
</script>
<style></style>
