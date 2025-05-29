<template>
  <div class="container">
    <app-header-component />
    <main-content-component />
  </div>
</template>

<script>
import AppHeaderComponent from "@/components/AppHeaderComponent/AppHeaderComponent.vue";
import MainContentComponent from "@/components/MainContentArea/MainContentComponent.vue";

export default {
  name: "create-post",
  components: {
    AppHeaderComponent,
    MainContentComponent
  },
};
</script>
