<template>
  <div class="login-container background-pattern">
    <div class="login-form">
      <h1 @click="handleAutenticar">Iniciar Sesión</h1>

      <div class="input-group">
        <input
          type="text"
          v-model="username"
          name="username"
          placeholder="Username o Email"
          autocomplete="off"
          @keyup.enter="handleAutenticar"
          required />
      </div>

      <div class="input-group">
        <input
          type="password"
          v-model="password"
          name="password"
          placeholder="Password"
          autocomplete="off"
          @keyup.enter="handleAutenticar"
          required />
      </div>
    </div>
  </div>

  <!-- Popup de Error -->
  <transition name="fade-scale">
    <div v-if="loginError" class="popup-overlay">
      <div class="popup-error">
        <div class="popup-content">
          <span class="popup-close" @click="loginError = ''">&times;</span>
          <p class="error-message">
            {{ loginError }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ref } from 'vue';
  import { useAuthStore } from '../../stores/auth';
  import { useRouter } from 'vue-router';

  export default {
    name: 'LoginComponent',
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();

      const username = ref('');
      const password = ref('');
      const isLoading = ref(false);
      const loginError = ref('');

      const handleAutenticar = async () => {
        isLoading.value = true;
        loginError.value = '';

        if (username.value && password.value) {
          const sucess = await authStore.login(username.value, password.value);

          if (sucess) {
            router.push('/');
          } else {
            loginError.value = 'Usuario o contraseña incorrectos.';
          }
        } else {
          loginError.value = 'Ingrese el usuario y la contraseña.';
        }

        isLoading.value = false;
      };

      return {
        username,
        password,
        isLoading,
        loginError,
        authStore,
        handleAutenticar,
      };
    },
  };
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .login-container {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 100vh;
    overflow: hidden;
  }

  .background-pattern {
    /* Múltiples background-image para los corazones dispersos */
    background-image:
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg');

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

    background-size: 12vw, 20vw, 5vw, 4vw, 10vw, 12vw, 5vw, 7vw;

    backdrop-filter: blur(1px);
  }

  /* PSEUDO-ELEMENTO PARA LAS SOMBRAS DE LOS CORAZONES */
  .login-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; /*segunda capa, debajo del form */
    pointer-events: none; /* los eventos atraviesan la capa */

    background-image:
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg'),
      url('../../assets/svg/pattern-login.svg');

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

  .login-form {
    width: 500px;
    height: 500px;
    max-width: 90vw;
    max-height: 90vh;
    aspect-ratio: 1 / 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
    box-shadow: 0px 12px 12px -6px var(--primary-color);
  }

  h1 {
    color: var(--primary-color);
    font-weight: normal;
    text-align: center;
    padding-bottom: 10px;
    line-height: 1.2;
  }

  h1:hover {
    text-shadow: 0 0 20px var(--primary-color);
    cursor: pointer;
  }

  .input-group {
    margin-bottom: 20px;
    width: 70%;
  }

  .input-group input {
    background-color: var(--secondary-color);
    border: 1px solid var(--primary-color);
    border-radius: 50px;

    width: 100%;

    padding: 12px 25px;
    color: var(--text-color);
    font-family: var(--font-primary);
    font-size: 1em;
    font-weight: normal;

    box-sizing: border-box;
  }

  .input-group input::placeholder {
    color: var(--text-color);
    opacity: 0.9;
  }

  .input-group input:focus {
    color: var(--text-color);
    outline: none;

    background: linear-gradient(
      50deg,
      var(--secondary-color) 0%,
      var(--primary-color) 90%
    );
  }

  .input-group input:hover {
    background: linear-gradient(
      50deg,
      var(--secondary-color) 0%,
      var(--primary-color) 90%
    );
  }

  @media (max-width: 530px) {
    .login-form {
      box-shadow: none;
    }
  }

  /* Popup */
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.3s ease;
  }
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-color-op50);
    display: grid;
    place-items: center;
    z-index: 1000;
  }

  .popup-error {
    background: var(--background-color);
    border-radius: 12px;
    box-shadow: 0 0 15px 1px var(--primary-color);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    animation: shake 0.4s ease; /* Efecto de vibración al aparecer */
  }

  .popup-content {
    padding: 35px;
    position: relative;
  }

  .popup-close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    cursor: pointer;
    color: var(--text-color);
    transition: color 0.2s;
  }

  .popup-close:hover {
    color: var(--primary-color);
  }

  .error-message {
    color: var(--text-color);
    margin: 0;
    text-align: center;
    font-size: 20px;
    line-height: 1.5;
  }

  /* Efecto de vibración */
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-5px);
    }
    40%,
    80% {
      transform: translateX(5px);
    }
  }
</style>
