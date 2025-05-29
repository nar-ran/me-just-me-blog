<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Jersey+10&display=swap");

:root {
  --primary-color: #dc3485; /* El verde de Vue, como ejemplo */
  --secondary-color: #242325; /* Un azul/gris oscuro */
  --text-color: #f7f7f7;

  --background-color: #242325;
  --background-color-op50: #242325c3;

  --font-primary: "Jersey 10", cursive;
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
}

body {
  background-color: var(--background-color);

  margin: 0;
  padding: 0;
}
</style>
