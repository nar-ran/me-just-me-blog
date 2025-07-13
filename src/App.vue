<template>
  <router-view></router-view>
</template>

<script>
  import { onMounted } from 'vue';
  import { useAuthStore } from './stores/auth';

  export default {
    name: 'App',
    setup() {
      const authStore = useAuthStore();

      onMounted(async () => {
        await authStore.checkSession();
      });

      return {};
    },
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');

  :root {
    --primary-color: #dc3485;
    --secondary-color: #242325;
    --text-color: #f7f7f7;

    --background-color: #242325;
    --background-color-op50: #242325c3;

    --font-primary: 'Jersey 10', cursive;
  }

  #app {
    font-family: var(--font-primary);
    background-color: var(--background-color);
    color: var(--text-color);
  }

  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  html,
  body {
    overflow-x: hidden;
    max-width: 100vw;
  }

  body {
    background-color: var(--background-color);
  }

  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-color-op50);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      45deg,
      var(--primary-color) 0%,
      var(--secondary-color) 100%
    );

    border-radius: 100px;
  }
</style>
