<template>
  <div v-if="loading" class="container">
    <p class="title-section">Cargando entrada...</p>
  </div>
  <div v-else class="container">
    <p class="title-section">Modificar Entrada</p>

    <div class="info">
      <div>
        <span class="category" @click="show = true">
          <span class="dot"></span>
          <span>
            {{ categorySelected.nombre || 'Seleccionar Categoría' }}
          </span>
        </span>

        <SelectCategorieModal
          @select-category="(category) => (categorySelected = category)"
          v-if="show"
          @close="show = false" />
      </div>
      <span class="date">
        D:
        <input type="date" class="date-input" v-model="date" />
      </span>
    </div>

    <div class="blog-title">
      <input
        type="text"
        class="title-input"
        placeholder="Future's gonna be ok..."
        v-model="title" />
      <button
        type="button"
        class="btn-cancel"
        @click="cancelEdit"
        :disabled="isSubmitting">
        Cancelar
      </button>
      <button
        type="button"
        class="btn-save"
        @click="updateContent"
        :disabled="isSubmitting">
        Actualizar
      </button>
    </div>

    <div class="content">
      <div id="editor" class="custom-editor"></div>
    </div>
  </div>

  <ErrorMessagePopup v-if="error" :message="error" @close="error = ''" />
  <AlertMessageModal v-if="info" :message="info" @close="info = ''" />
</template>

<script>
  import { onMounted, ref, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { supabase } from '@/stores/supabase';

  import SelectCategorieModal from '../Categories/SelectCategorieModal.vue';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';
  import AlertMessageModal from '../Utils/AlertMessageModal.vue';

  import Quill from 'quill';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import DOMPurify from 'dompurify';

  export default {
    name: 'ModifyPostComponent',
    components: { SelectCategorieModal, ErrorMessagePopup, AlertMessageModal },
    setup() {
      const route = useRoute();
      const router = useRouter();

      const loading = ref(true);
      const error = ref('');
      const info = ref('');
      const show = ref(false);

      const title = ref('');
      const date = ref('');
      const categorySelected = ref({ nombre: 'Categoría', categoria_id: null });
      const originalCategoryId = ref(null);
      const quillEditor = ref(null);
      const postId = ref(null);
      const postContent = ref('');
      const isSubmitting = ref(false);

      const initializeQuill = () => {
        const toolbarOptions = [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [
            { align: [] },
            { list: 'ordered' },
            { list: 'bullet' },
            { list: 'check' },
          ],
          ['link'],
          ['code-block', { direction: 'rtl' }],
          ['clean'],
        ];

        quillEditor.value = new Quill('#editor', {
          modules: { toolbar: toolbarOptions },
          theme: 'snow',
        });
      };

      function toLocalDateInputFormat(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      const fetchPostData = async () => {
        loading.value = true;
        const slug = route.params.slug;
        if (!slug) {
          error.value = 'No se ha especificado una entrada para editar.';
          loading.value = false;
          router.push({ name: 'home' });
          return;
        }

        try {
          const { data: postData, error: postError } = await supabase
            .from('entradas')
            .select(
              `
              entrada_id,
              titulo,
              contenido,
              fecha,
              post_categorias (
                categorias (
                  categoria_id,
                  nombre
                )
              )
            `
            )
            .eq('slug', slug)
            .single();

          if (postError) throw postError;

          if (postData) {
            postId.value = postData.entrada_id;
            title.value = postData.titulo;
            if (postData.fecha) {
              date.value = toLocalDateInputFormat(postData.fecha);
            }
            postContent.value = postData.contenido;

            if (
              postData.post_categorias &&
              postData.post_categorias.length > 0
            ) {
              const categoryInfo = postData.post_categorias[0].categorias;
              categorySelected.value = {
                nombre: categoryInfo.nombre,
                categoria_id: categoryInfo.categoria_id,
              };
              originalCategoryId.value = categoryInfo.categoria_id;
            }
          } else {
            throw new Error('Entrada no encontrada.');
          }
        } catch (err) {
          if (err.code === 'PGRST116') {
            error.value = 'La entrada solicitada no fue encontrada.';
            router.replace({ name: 'not-found' });
          } else {
            error.value = `Error al cargar la entrada: ${
              err.message || 'Error desconocido'
            }`;
          }
        } finally {
          loading.value = false;
        }
      };

      const slugify = (text) => {
        return text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '') // Eliminar caracteres no alfanuméricos excepto espacios y guiones
          .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones bajos por un solo guion
          .replace(/^-+|-+$/g, ''); // Eliminar guiones al principio y al final
      };

      const updateContent = async () => {
        if (!title.value.trim() || !quillEditor.value.getText().trim()) {
          error.value = 'El título y el contenido no pueden estar vacíos.';
          return;
        }
        if (!categorySelected.value?.categoria_id) {
          error.value = 'Debes seleccionar una categoría.';
          return;
        }

        isSubmitting.value = true;

        try {
          const cleanHTML = DOMPurify.sanitize(
            quillEditor.value.root.innerHTML,
            {
              USE_PROFILES: { html: true },
            }
          );

          const newSlug = slugify(title.value);

          const { error: updateError } = await supabase
            .from('entradas')
            .update({
              titulo: title.value.trim(),
              contenido: cleanHTML,
              fecha: date.value,
              slug: newSlug,
            })
            .eq('entrada_id', postId.value);

          if (updateError) throw updateError;

          if (
            categorySelected.value.categoria_id !== originalCategoryId.value
          ) {
            const { error: catUpdateError } = await supabase
              .from('post_categorias')
              .update({ categoria_id: categorySelected.value.categoria_id })
              .eq('post_id', postId.value);

            if (catUpdateError) throw catUpdateError;
          }

          info.value = `La entrada "${title.value}" se ha actualizado correctamente.`;
          originalCategoryId.value = categorySelected.value.categoria_id;

          setTimeout(() => {
            router.push({
              name: 'post-detail',
              params: { slug: newSlug },
            });
          }, 2000);
        } catch (err) {
          error.value = `Error al actualizar la entrada: ${err.message}`;
        } finally {
          isSubmitting.value = false;
        }
      };

      const cancelEdit = () => {
        router.back();
      };

      onMounted(async () => {
        await fetchPostData();
        // Después de que los datos se obtienen, `loading` se vuelve falso.
        // Usamos nextTick para asegurarnos de que el DOM se haya actualizado y el div #editor exista.
        nextTick(() => {
          initializeQuill();
          quillEditor.value.root.innerHTML = postContent.value;
        });
      });

      return {
        loading,
        error,
        info,
        show,
        title,
        date,
        categorySelected,
        updateContent,
        isSubmitting,
        cancelEdit,
      };
    },
  };
</script>

<style>
  .container {
    margin: 0 2em;

    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title-section {
    font-size: 2em;
    text-align: center;
  }

  /* info */
  .info {
    font-size: 1.35em;
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .category {
    text-align: left;
    cursor: pointer;

    display: flex;
    align-items: center;
    gap: 0.4em;
  }

  .category:hover {
    text-shadow: 0 0 20px var(--text-color);
  }

  .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(
      145deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  .date {
    text-align: right;
    cursor: pointer;
  }

  .date:hover {
    text-shadow: 0 0 20px var(--text-color);
  }

  .date-input {
    color: var(--text-color);
    font-family: var(--font-primary);
    font-size: 1em;

    background: none;
    border: none;
  }

  .date-input:hover {
    cursor: pointer;
    text-shadow: 0 0 20px var(--text-color);
  }

  .date-input:focus {
    border: none;
    outline: none;
  }

  .date-input::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }

  /* blog-title */
  .blog-title {
    margin: 2rem 0;
    display: flex;
    gap: 15px;
  }

  .title-input {
    flex-grow: 1;
    border-radius: 60px;
    border: none;
    background: linear-gradient(
      90deg,
      var(--secondary-color),
      var(--primary-color)
    );

    font-size: 1.5em;
    color: var(--text-color);
    font-family: var(--font-primary);

    box-sizing: border-box;
    padding: 10px;
    padding-left: 20px;

    box-shadow: 0 0 0 1px transparent;
    transition: box-shadow 0.2s ease;
  }

  .title-input::placeholder {
    color: var(--primary-color);
    opacity: 0.5;
  }

  .title-input:focus {
    outline: none;
  }

  .btn-save {
    font-size: 1.5em;
    color: var(--text-color);
    font-family: var(--font-primary);

    background: linear-gradient(
      45deg,
      var(--primary-color),
      var(--secondary-color)
    );

    border: none;
    padding: 10px 50px;
    border-radius: 60px;

    box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-save:hover {
    filter: brightness(1.2);
  }

  .btn-cancel {
    font-size: 1.5em;
    color: var(--primary-color);
    font-family: var(--font-primary);
    background-color: transparent;
    border: 1px solid var(--primary-color);
    padding: 10px 50px;
    border-radius: 60px;
    box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .btn-cancel:hover{
    color: var(--text-color);
    background-color: var(--primary-color);
  }

  /* Quill editor */
  .content {
    padding-bottom: 2em;
    font-family: var(--font-primary);
    font-size: 1.2em;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  #editor.ql-container.ql-snow {
    flex-grow: 1;
    min-height: 0;
    border: none !important;
    border-radius: 0 0 20px 20px;
    background: linear-gradient(
      to bottom,
      var(--secondary-color) 0%,
      var(--primary-color) 100%
    );
    color: var(--text-color);
    font-family: var(--font-primary);
    font-size: 1.2em;
  }

  #editor .ql-editor {
    flex-grow: 1;
    min-height: 0;
    color: var(--text-color) !important;
    padding: 1em;
    border: none;
    box-sizing: border-box;
  }

  .ql-toolbar.ql-snow {
    background: linear-gradient(
      45deg,
      var(--secondary-color) 0%,
      var(--primary-color) 80%
    );
    padding: 12px 10px;
    border: none !important;
    border-radius: 20px 20px 0 0;
    color: var(--text-color) !important;
  }

  .ql-toolbar .ql-stroke {
    stroke: var(--text-color) !important;
  }

  .ql-toolbar .ql-fill {
    fill: var(--text-color) !important;
  }

  .ql-toolbar .ql-picker-label {
    color: var(--text-color) !important;
  }

  .ql-toolbar .ql-picker-options {
    background-color: var(--background-color, #2a2a2a) !important;
    color: var(--text-color) !important;
  }

  .ql-toolbar button:hover .ql-stroke {
    stroke: var(--primary-color) !important;
    filter: drop-shadow(0 0 4px var(--primary-color)) !important;
    transition: all 0.3s ease;
  }

  .ql-toolbar button:hover .ql-fill {
    fill: var(--primary-color) !important;
    filter: drop-shadow(0 0 4px var(--primary-color)) !important;
    transition: all 0.3s ease;
  }

  .ql-toolbar .ql-picker-label:hover {
    color: var(--primary-color) !important;
    text-shadow: 0 0 4px var(--primary-color) !important;
    transition: all 0.3s ease;
  }

  .ql-toolbar .ql-picker-item:hover {
    color: var(--primary-color) !important;
  }

  .ql-toolbar .ql-picker-item.ql-selected {
    color: var(--primary-color) !important;
    background-color: rgba(var(--primary-color, 59, 130, 246), 0.1) !important;
  }

  #editor .ql-editor {
    z-index: 9999 !important;
  }

  @media screen and (max-width: 400px) {
    .info {
      grid-template-columns: 1fr;
      font-size: 1.2em;
    }

    .date {
      margin-top: 10px;
      text-align: left;
    }
  }

  @media screen and (max-width: 600px) {
    .container {
      margin: 0 1em;
    }

    .blog-title {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-save {
      width: 100%;
      padding: 12px 20px;
      font-size: 1.2em;
      text-align: center;
    }

    .title-input {
      font-size: 1.2em;
      padding: 12px 16px;
    }

    .content {
      padding-bottom: 1em;
    }
  }
</style>
