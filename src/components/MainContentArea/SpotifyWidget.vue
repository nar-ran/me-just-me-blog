<template>
  <div class="spotify-section">
    <p class="title">Lo que escucho últimamente</p>
    <div v-if="currentlyPlaying">
      <a
        :href="currentlyPlaying.songUrl"
        class="spotify-card"
        target="_blank"
        rel="noopener noreferrer">
        <img
          class="album-cover"
          :src="currentlyPlaying.albumImageUrl"
          alt="Carátula del álbum" />
        <div class="song-info">
          <p class="song-title">{{ currentlyPlaying.title }}</p>
          <p class="song-artist">{{ currentlyPlaying.artist }}</p>
        </div>
        <span class="playing-indicator">▶</span>
      </a>
    </div>
    <div v-else class="no-song">
      <p>No se está reproduciendo música en este momento.</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SpotifySection',
    props: {
      currentlyPlaying: {
        type: Object,
        required: false,
        default: null,
      },
    },
  };
</script>

<style scoped>
  .spotify-section {
    display: flex;
    flex-direction: column;
    gap: 1em;
    background-color: rgba(255, 255, 255, 0.03);
    padding: 1em;
    border-radius: 12px;
    height: 100%;
  }

  .title {
    font-size: 1.5em;
    text-align: center;
  }

  .spotify-card {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    background-color: rgba(255, 255, 255, 0.06);
    padding: 0.7em;
    border-radius: 10px;
    gap: 1em;
    transition: background 0.2s ease;
  }

  .spotify-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .album-cover {
    width: 64px;
    height: 64px;
    border-radius: 6px;
  }

  .song-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .song-title {
    font-weight: bold;
    font-size: 1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .song-artist {
    font-size: 0.9em;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .playing-indicator {
    font-size: 1.5em;
    color: var(--primary-color);
  }

  .no-song {
    text-align: center;
    opacity: 0.6;
    font-style: italic;
    margin-top: auto;
  }
</style>
