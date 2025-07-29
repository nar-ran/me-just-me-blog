<template>
  <transition name="fade-scale">
    <div v-if="message" class="modal-overlay" @click="$emit('close')">
      <div class="modal-info" @click.stop>
        <div class="modal-content">
          <span class="modal-close" @click="$emit('close')">&times;</span>
          <p class="info-message">
            {{ message }}
          </p>
          <div class="modal-actions">
            <button class="btn btn-cancel" @click="$emit('close')">
              Cancelar
            </button>
            <button class="btn btn-confirm" @click="$emit('confirm')">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'ConfirmActionModal',
    props: {
      message: {
        type: String,
        required: true,
      },
    },
    emits: ['close', 'confirm'],
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

  .modal-overlay {
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

  .modal-info {
    background: var(--background-color);
    border-radius: 12px;
    box-shadow: 0 0 15px 1px var(--primary-color);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    animation: shake 0.4s ease;
  }

  .modal-content {
    padding: 35px;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    cursor: pointer;
    color: var(--text-color);
    transition: color 0.2s;
  }

  .modal-close:hover {
    color: var(--primary-color);
  }

  .info-message {
    color: var(--text-color);
    margin: 0 0 25px 0;
    text-align: center;
    font-size: 20px;
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-primary);
    min-width: 120px;
  }

  .btn-confirm {
    background-color: var(--primary-color);
    color: var(--text-color);
  }

  .btn-confirm:hover {
    background-color: var(--background-color);
    border: 1px solid var(--primary-color);
    transform: translateY(-2px);
  }

  .btn-cancel {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .btn-cancel:hover {
    background-color: var(--primary-color);
    color: var(--text-color);
    transform: translateY(-2px);
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

  .modal-info {
    animation: fadeUp 0.3s ease;
  }
</style>
