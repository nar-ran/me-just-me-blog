<template>
  <AppHeaderComponent />
  <ModifyPostComponent />
</template>

<script>
  import ModifyPostComponent from '../components/Posts/ModifyPostComponent.vue';
  import AppHeaderComponent from '@/components/AppHeaderComponent/AppHeaderComponent.vue';

  export default {
    components: {
      ModifyPostComponent,
      AppHeaderComponent,
    },
  };
</script>
