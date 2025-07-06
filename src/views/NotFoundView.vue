<template>
  <div class="container">
    <h1>¿Te perdiste?<br />Página no encontrada</h1>
    <a href="/"> Volver al inicio </a>
  </div>
</template>

<script>
  export default {
    name: 'NotFound',
  };
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;

    color: var(--primary-color);
  }

  h1 {
    font-weight: normal;
    font-size: 3.5em;

    background: linear-gradient(
      0deg,
      var(--secondary-color) 0%,
      var(--primary-color) 30%
    );

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    width: fit-content;

    background-size: 100% 100%;
  }

  a {
    text-decoration: none;
    font-size: 1.7em;
    color: var(--text-color);

    padding: 10px 30px;
    border-radius: 50px;

    background: linear-gradient(
      45deg,
      var(--secondary-color),
      var(--primary-color)
    );
  }

  a:hover {
    transform: scale(1.05);
  }

  /* Patron del fondo */
  .container {
    /* Múltiples background-image para los corazones dispersos */
    background-image:
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg');

    background-repeat: no-repeat;

    background-position:
      0% -5%,
      40% -30%,
      5% 90%,
      79% 23%,
      81% 19%,
      95% 85%,
      34% 35%,
      50% 85%;

    background-size: 12vw, 20vw, 15vw, 4vw, 10vw, 12vw, 5vw, 7vw;

    backdrop-filter: blur(1px);
  }

  .container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;

    background-image:
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg'),
      url('@/assets/svg/pattern-login.svg');

    background-repeat: no-repeat;

    background-position:
      0% -5%,
      40% -30%,
      5% 90%,
      79% 23%,
      81% 19%,
      95% 85%,
      34% 35%,
      50% 85%;

    background-size: 12vw, 20vw, 15vw, 4vw, 10vw, 12vw, 5vw, 7vw;

    filter: drop-shadow(0px 0px 10px var(--primary-color));
  }
</style>
