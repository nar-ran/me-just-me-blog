<template>
  <div class="container">
    <p class="title-section">Crear Entrada</p>

    <div class="info">
      <div>
        <span class="category" @click="show = true">
          <span class="dot"></span>
          <span> {{ categorySelected.nombre }} </span>
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
      <button type="button" class="btn-save" @click="saveContent">
        Guardar
      </button>
    </div>

    <div class="content">
      <div id="editor" class="custom-editor"></div>
    </div>
  </div>

  <ErrorMessagePopup v-if="error" :message="error" @close="error = ''" />
  <AlertMessageModal
    v-if="infoPost"
    :message="infoPost"
    @close="infoPost = ''" />
</template>

<script>
  import { onMounted, ref, watch, computed } from 'vue';
  import { supabase } from '@/stores/supabase';
  import { useAuthStore } from '@/stores/auth';

  import SelectCategorieModal from '../Categories/SelectCategorieModal.vue';
  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';
  import AlertMessageModal from '../Utils/AlertMessageModal.vue';

  import Quill from 'quill';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import DOMPurify from 'dompurify';

  export default {
    name: 'CreatePostComponent',
    components: { SelectCategorieModal, ErrorMessagePopup, AlertMessageModal },
    setup() {
      const error = ref('');
      const infoPost = ref('');
      const show = ref(false);

      const authStore = useAuthStore();
      const categorySelected = ref({ nombre: 'Categoría' });
      const date = ref(new Date().toISOString().split('T')[0]);
      const title = ref('');
      const quillEditor = ref(null);

      const storageKey = computed(() => {
        return authStore.user && authStore.user.id
          ? `postsInput-${authStore.user.id}`
          : null;
      });

      watch(title, (newTitle) => {
        if (storageKey.value) {
          localStorage.setItem(`${storageKey.value}-title`, newTitle);
        }
      });

      watch(
        categorySelected,
        (newCategory) => {
          if (storageKey.value) {
            localStorage.setItem(
              `${storageKey.value}-category`,
              JSON.stringify(newCategory)
            );
          }
        },
        { deep: true }
      );

      watch(date, (newDate) => {
        if (storageKey.value) {
          localStorage.setItem(`${storageKey.value}-date`, newDate);
        }
      });

      const generateSlug = (texto) => {
        if (!texto) return '';

        const slug = texto
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

        return slug.replace(/^-+|-+$/g, '');
      };

      onMounted(() => {
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
          modules: {
            toolbar: toolbarOptions,
          },
          theme: 'snow',
        });

        if (storageKey.value) {
          const savedTitle = localStorage.getItem(`${storageKey.value}-title`);
          if (savedTitle) title.value = savedTitle;

          const savedCategory = localStorage.getItem(
            `${storageKey.value}-category`
          );
          if (savedCategory) {
            categorySelected.value = JSON.parse(savedCategory);
          }

          const savedDate = localStorage.getItem(`${storageKey.value}-date`);
          if (savedDate) date.value = savedDate;

          const savedContent = localStorage.getItem(
            `${storageKey.value}-content`
          );
          if (savedContent) {
            quillEditor.value.root.innerHTML = savedContent;
          }
        }

        quillEditor.value.on('text-change', () => {
          if (storageKey.value) {
            localStorage.setItem(
              `${storageKey.value}-content`,
              quillEditor.value.root.innerHTML
            );
          }
        });
      });

      const saveContent = async () => {
        if (!quillEditor.value || !title.value.trim()) {
          error.value =
            'Por favor, completa el título y el contenido antes de guardar';
          return;
        }

        let baseSlug = generateSlug(title.value);
        if (!baseSlug) {
          baseSlug = `post-${Date.now().toString(36)}`;
        }

        let finalSlug = baseSlug;
        let count = 1;
        let isUnique = false;

        do {
          const { data: existing, error: checkError } = await supabase
            .from('entradas')
            .select('slug')
            .eq('slug', finalSlug);

          if (checkError) {
            error.value = 'Error al verificar el slug.';
            return;
          }

          if (!existing || existing.length === 0) {
            isUnique = true;
          } else {
            finalSlug = `${baseSlug}-${count}`;
            count++;
          }
        } while (!isUnique);

        const dirtyHTML = quillEditor.value.root.innerHTML;
        const cleanHTML = DOMPurify.sanitize(dirtyHTML, {
          USE_PROFILES: { html: true },
        });

        if (!categorySelected.value?.categoria_id) {
          error.value = 'Debes seleccionar una categoría.';
          return;
        }

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          error.value = 'No se pudo obtener el usuario actual.';
          return;
        }

        const { data: insertedPost, error: insertError } = await supabase
          .from('entradas')
          .insert({
            usuario_id: userData.user.id,
            titulo: title.value.trim(),
            contenido: cleanHTML,
            fecha: date.value,
            publicado: true,
            slug: finalSlug,
          })
          .select('entrada_id')
          .single();

        if (insertError) {
          error.value = 'Error al crear la entrada.';
          return;
        }

        const { error: postCatError } = await supabase
          .from('post_categorias')
          .insert({
            post_id: insertedPost.entrada_id,
            categoria_id: categorySelected.value.categoria_id,
          });

        if (postCatError) {
          error.value = 'Error al relacionar la categoría con la entrada.';
          return;
        }

        infoPost.value = `La entrada "${title.value}" se creó con éxito.`;

        if (storageKey.value) {
          localStorage.removeItem(`${storageKey.value}-title`);
          localStorage.removeItem(`${storageKey.value}-category`);
          localStorage.removeItem(`${storageKey.value}-date`);
          localStorage.removeItem(`${storageKey.value}-content`);
        }

        title.value = '';
        date.value = new Date().toISOString().split('T')[0];
        quillEditor.value.root.innerHTML = '';
        categorySelected.value = { nombre: 'Categoría' };
      };

      return {
        title,
        date,
        saveContent,
        show,
        error,
        infoPost,
        categorySelected,
        authStore,
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
