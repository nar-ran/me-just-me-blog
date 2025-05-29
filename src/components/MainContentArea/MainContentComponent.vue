<template>
  <div class="main-grid-container">
    <div class="top-grid">
      <p class="title">Entradas</p>
      <div v-for="post in posts" :key="post.id" class="posts-container">
        <p class="post-date">D: {{ post.dateFormatted }}</p>
        <p class="post-title">{{ post.title }}</p>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="categories-container"></div>
      <div class="music-container"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainContentComponent",
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    fetch("/data/posts.json")
      .then((res) => res.json())
      .then((data) => {
        this.posts = data.map((post) => ({
          ...post,
          dateFormatted: this.dateFormatted(post.date),
        }));
      })
      .catch((err) => console.error("Error cargando posts: ", err));
  },
  methods: {
    dateFormatted(originDate) {
      const date = new Date(originDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(2);
      return `${day}${month}${year}`;
    },
  },
};
</script>

<style scoped>
.main-grid-container {
  display: grid;
  grid-template-rows: 1.4fr 1fr;
  box-sizing: border-box;
  gap: 2rem;
  height: 100%;

  padding: 1em 2em;
  border-radius: 15px;
  color: var(--text-color);

  background: linear-gradient(
    0deg,
    var(--primary-color),
    var(--secondary-color)
  );
}

.title {
  font-size: 2em;
  text-align: center;
}

.posts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  padding: 0;

  font-size: 1.4em;
}

.posts-container p {
  margin: 0 0 0.9em 0;
  padding: 0;
}

.post-date {
  text-align: left;
}

.post-title {
  text-align: right;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.categories-container {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--background-color);
}

.music-container {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--background-color);
}
</style>
