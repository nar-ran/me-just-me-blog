<template>
  <div class="modal-overlay">
    <div class="modal">
      <span class="close-button" @click="$emit('close')"> &times; </span>

      <div class="create-title" @click="createCategory">
        <p>
          Crear Categoria
          <span class="material-symbols-outlined">
            format_list_bulleted_add
          </span>
        </p>
      </div>
      <input
        v-model="name"
        placeholder="Generales..."
        @keyup.enter="createCategory" />

      <ErrorMessagePopup
        v-if="errorCategory"
        :message="errorCategory"
        @close="errorCategory = ''" />

      <AlertMessageModal
        v-if="infoCategory"
        :message="infoCategory"
        @close="infoCategory = ''" />
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { supabase } from '@/stores/supabase';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';
  import AlertMessageModal from '../Utils/AlertMessageModal.vue';

  export default {
    name: 'CreateCategoryModal',
    components: { ErrorMessagePopup, AlertMessageModal },
    setup(_, { emit }) {
      const errorCategory = ref('');
      const infoCategory = ref('');
      const name = ref('');

      const generarSlug = (texto) => {
        return texto
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      };

      const createCategory = async () => {
        if (!name.value.trim()) {
          errorCategory.value = 'Escriba una categoria.';
          return;
        }

        const validName = name.value.trim();
        if (!validName) return;

        const slug = generarSlug(validName);

        // 1. Verificar si ya existe una categoría con ese slug
        const { data: available, error: errorCheck } = await supabase
          .from('categorias')
          .select('slug')
          .eq('slug', slug);

        if (errorCheck) {
          errorCategory.value = 'Error al verificar existencia.';
          return;
        }

        if (available.length > 0) {
          errorCategory.value = 'La categoría ya existe.';
          return;
        }

        // 2. Insertar si no existe
        const { error } = await supabase
          .from('categorias')
          .insert({ nombre: validName, slug });

        if (!error) {
          infoCategory.value = `Se creo la categoria ${validName} correctamente.`;
          setTimeout(() => emit('close'), 3000);
        } else {
          errorCategory.value = 'Error al crear categoría.';
        }
      };

      return {
        name,
        createCategory,
        errorCategory,
        infoCategory,
      };
    },
  };
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-color-op50);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: var(--background-color);
    padding: 4rem 3.5rem;
    border-radius: 1rem;
    width: 30%;
  }

  .close-button {
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    cursor: pointer;
    font-size: 1.7rem;
    color: var(--text-color);
    transition: transform 0.2s ease;
  }

  .close-button:hover {
    transform: scale(1.2);
    text-shadow: 0 0 8px var(--text-color);
  }

  .create-title p {
    cursor: pointer;

    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    font-size: 1.8em;
    padding: 0;
    margin: 0;
    margin-bottom: 0.8em;
  }

  .create-title :hover {
    text-shadow: 0 0 20px var(--text-color);
  }

  .create-title p span {
    justify-self: end;
  }

  input {
    font-size: 1.3em;

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
  }

  input::placeholder {
    color: var(--primary-color);
    opacity: 0.7;
  }

  input:focus {
    outline: none;
  }
</style>
