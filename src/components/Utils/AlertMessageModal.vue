<template>
  <transition name="fade-scale">
    <div v-if="message" class="popup-overlay" @click="$emit('close')">
      <div class="popup-info" @click.stop>
        <div class="popup-content">
          <span class="popup-close" @click="$emit('close')">&times;</span>
          <p class="info-message">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'AlertMessageModal',
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

  .popup-info {
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

  .info-message {
    color: var(--text-color);
    margin: 0;
    text-align: center;
    font-size: 20px;
    line-height: 1.5;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .popup-info {
    animation: fadeUp 0.3s ease;
  }
</style>
