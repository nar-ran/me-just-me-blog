<template>
  <div class="main-grid-container">
    <div class="top-grid">
      <PostsSectionComponent />
    </div>

    <div class="bottom-grid">
      <CategoriesSection :categories="categories" />
      <SpotifySection
        :latestTrack="latestTrack"
        :accessToken="accessToken"
        :error="error"
        @login-with-spotify="loginWithSpotify" />
    </div>
  </div>
</template>

<script>
  import PostsSectionComponent from '@/components/MainContentArea/PostsSection.vue';
  import CategoriesSection from './CategoriesSection.vue';
  import SpotifySection from './SpotifySection.vue';

  export default {
    name: 'MainContentComponent',
    components: {
      PostsSectionComponent,
      CategoriesSection,
      SpotifySection,
    },
    data() {
      return {
        categories: [],
        latestTrack: null,
        accessToken: null,
        error: null,
      };
    },
  };
</script>

<style scoped>
  .main-grid-container {
    display: grid;
    grid-template-rows: 2fr auto;
    box-sizing: border-box;
    gap: 2rem;
    height: auto;
    padding: 3.5em;
    border-radius: 15px;
    color: var(--text-color);
    background: linear-gradient(
      0deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  .top-grid {
    display: block;
  }

  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
  }

  ::-webkit-scrollbar {
    width: 0.17em;
    height: 0.17em;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      0deg,
      var(--primary-color),
      var(--secondary-color)
    );
    border-radius: 100px;
  }

  @media (max-width: 980px) {
    .main-grid-container {
      padding: 1.5em;
      overflow-x: hidden;
      grid-template-rows: auto auto;
    }

    .bottom-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
