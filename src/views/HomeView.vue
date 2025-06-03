<template>
<div class="home-view">
    <div class="sections">
        <sidebar-nav-component class="navbar" />
        <main-content-component />
    </div>
</div>
</template>

<script>
import SidebarNavComponent from "@/components/SidebarNav/SidebarNavComponent.vue";
import MainContentComponent from "@/components/MainContentArea/MainContentComponent.vue";

export default {
    components: {
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

    box-sizing: border-box;

    gap: 2em;

    height: 100%;
}

@media (max-width: 980px) {
  .navbar{
    display: none;
  }

  .sections{
    grid-template-columns: 1fr;
  }
}
</style>
