<template>
  <app-header-component />
  <div class="container">
    <CreatePostComponent />
  </div>
</template>

<script>
  import AppHeaderComponent from '@/components/AppHeaderComponent/AppHeaderComponent.vue';
  import CreatePostComponent from '@/components/Posts/CreatePostComponent.vue';

  export default {
    name: 'create-post',
    components: {
      AppHeaderComponent,
      CreatePostComponent,
    },
  };
</script>
