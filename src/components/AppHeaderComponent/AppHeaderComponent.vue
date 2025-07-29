<template>
  <header>
    <a href="/">
      <p class="name-blog">Me, Just Me</p>
    </a>
    <SearchbarComponent />

    <div class="icons">
      <a href="/"><span class="material-symbols-outlined">home</span></a>
      <a href="#" @click="handleLogout"
        ><span class="material-symbols-outlined">chip_extraction</span></a
      >
    </div>
  </header>
</template>

<script>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import SearchbarComponent from './SearchbarComponent.vue';

  export default {
    name: 'AppHeaderComponent',
    components: { SearchbarComponent },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const userId = authStore.user?.id;

      const handleLogout = async () => {
        if (userId) {
          localStorage.removeItem(`categoryInput-${userId}`);
        }

        await authStore.logout();
        router.push('/login');
      };

      return {
        authStore,
        handleLogout,
      };
    },
  };
</script>

<style scoped>
  header {
    position: sticky;
    top: 0;
    z-index: 9999;

    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 10px 30px;
    gap: 20px;

    background-color: var(--background-color);
  }

  a {
    text-decoration: none;
  }

  .name-blog {
    font-size: 25px;
    margin: 0;

    background: linear-gradient(
      0deg,
      var(--secondary-color) 0%,
      var(--primary-color) 60%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    width: fit-content;
    background-size: 100% 100%;
  }

  .icons {
    display: flex;
    gap: 30px;
    align-items: center;
    font-size: 25px;

    background: linear-gradient(
      120deg,
      var(--secondary-color) 0%,
      var(--primary-color) 40%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    width: fit-content;

    background-size: 100% 100%;
  }

  @media screen and (max-width: 768px) {
    header {
      grid-template-columns: auto auto;
      justify-content: space-between;
      padding: 25px 20px;
    }
  }
</style>
