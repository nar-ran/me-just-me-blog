<template>
  <div class="input-container">
    <input
      type="text"
      class="buscador"
      placeholder="Buscar entrada..."
      v-model="searchQuery"
      @keydown.enter="performSearch" />
    <span class="material-symbols-outlined icono-buscador"> search </span>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  export default {
    name: 'SearchbarComponent',
    setup() {
      const router = useRouter();
      const searchQuery = ref('');

      const performSearch = () => {
        if (searchQuery.value.trim()) {
          router.push({ path: '/search', query: { q: searchQuery.value } });
          searchQuery.value = ''; // Limpia el input después de buscar
        }
      };

      return {
        searchQuery,
        performSearch,
      };
    },
  };
</script>

<style scoped>
  .input-container {
    position: relative;
    width: 90%;
    max-width: 80%;
    margin: 0 auto;
  }

  .buscador {
    font-size: 20px;
    width: 100%;
    border-radius: 60px;
    border: none;
    background: linear-gradient(
      90deg,
      var(--secondary-color),
      var(--primary-color)
    );
    color: var(--text-color);
    font-family: var(--font-primary);
    box-sizing: border-box;
    padding: 10px;
    padding-left: 20px;
    box-shadow: 0 0 0 1px transparent;
    transition: box-shadow 0.2s ease;
  }

  .buscador:focus {
    outline: none;
    box-shadow: 0 0 0 0.5px var(--primary-color);
  }

  input {
    font-size: 20px;
    padding: 5px;
    padding-right: 40px;
    padding-left: 20px;
  }

  input::placeholder {
    color: var(--primary-color);
    opacity: 0.7;
  }

  .icono-buscador {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    background: radial-gradient(
      circle,
      var(--primary-color) 0%,
      var(--secondary-color) 60%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    width: fit-content;
    background-size: 100% 100%;
  }

  @media screen and (max-width: 768px) {
    .input-container {
      display: none;
    }
  }
</style>