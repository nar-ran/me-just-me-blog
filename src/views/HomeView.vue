<template>
  <div class="home-view">
    <button class="sidebar-toggle" @click="toggleSidebar">
      <span class="material-symbols-outlined">menu</span>
    </button>

    <div v-if="isSidebarVisible" class="overlay" @click="toggleSidebar"></div>

    <div class="sections">
      <div :class="{ 'is-visible': isSidebarVisible }">
        <sidebar-nav-component
          class="navbar"
          @openCreateCategory="showCreateCategory = true" />
      </div>

      <main-content-component />
    </div>
  </div>

  <CreateCategoryModal
    v-if="showCreateCategory"
    @close="showCreateCategory = false" />
</template>

<script>
  import SidebarNavComponent from '@/components/SidebarNav/SidebarNavComponent.vue';
  import MainContentComponent from '@/components/MainContentArea/MainContentComponent.vue';
  import CreateCategoryModal from '@/components/Categories/CreateCategoryModal.vue';

  export default {
    components: {
      SidebarNavComponent,
      MainContentComponent,
      CreateCategoryModal,
    },
    data() {
      return {
        isSidebarVisible: false,
        showCreateCategory: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
      },
    },
  };
</script>

<style>
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

  .sidebar-toggle {
    display: none;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Un poco más oscuro para mejor visibilidad */
    z-index: 900;
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

    .sections {
      display: block;
      padding: 20px;
      width: 100%;
    }
  }
</style>
