<template>
  <div class="home-view">
    <!-- <app-header-component /> -->

    <div class="sections">
      <sidebar-nav-component />
      <main-content-component />
    </div>
  </div>
</template>

<script>
import SidebarNavComponent from "@/components/SidebarNav/SidebarNavComponent.vue";
// import AppHeaderComponent from "../components/AppHeaderComponent/AppHeaderComponent.vue";
import MainContentComponent from "@/components/MainContentArea/MainContentComponent.vue";

export default {
  components: {
    // AppHeaderComponent,
    SidebarNavComponent,
    MainContentComponent,
  },
};
</script>

<style scoped>
.home-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.sections {
  padding: 2em;

  display: grid;
  grid-template-columns: auto 2fr;
  grid-template-rows: 1fr;

  gap: 2em;

  height: 100%;
}
</style>
