<template>
  <transition name="fade-scale">
    <div v-if="message" class="popup-overlay" @click="$emit('close')">
      <div class="popup-error" @click.stop>
        <div class="popup-content">
          <span class="popup-close" @click="$emit('close')">&times;</span>
          <p class="error-message">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'ErrorMessagePopup',
    props: {
      message: {
        type: String,
        required: true,
      },
    },
    emits: ['close'],
  };
</script>

<style scoped>
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
    animation: shake 0.4s ease;
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
