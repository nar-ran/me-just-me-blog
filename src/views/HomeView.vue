<template>
  <div class="home-view">
    <button class="sidebar-toggle" @click="toggleSidebar">
      <span class="material-symbols-outlined">menu</span>
    </button>

    <div v-if="isSidebarVisible" class="overlay" @click="toggleSidebar"></div>

    <div class="sections">
      <sidebar-nav-component
        v-show="isSidebarVisible"
        class="navbar"
        :class="{ 'is-visible': isSidebarVisible }" />
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

  .sidebar-toggle,
  .overlay {
    display: none;
  }

  @media (max-width: 700px) {
    .sidebar-toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: var(--primary-color);
      color: var(--text-color);
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .navbar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      z-index: 1000;
      box-shadow: 5px 0px 15px rgba(0, 0, 0, 0.2);
      display: none;
    }

    .navbar.is-visible {
      transform: translateX(0);
      display: flex;
    }

    .sections {
      display: block;
      padding: 20px;
      width: 100%; 
    }
  }
</style>
