<template>
  <div class="container">
    <p class="title-section">Crear Entrada</p>

    <div class="info">
      <span class="category">
        <span class="material-symbols-rounded"> fiber_manual_record </span>
        <span> Category </span>
      </span>
      <span class="date"> D: {{ date }} </span>
    </div>

    <div class="blog-title">
      <input
        type="text"
        class="title-input"
        placeholder="Future's gonna be ok..." />
      <button type="button" class="btn-save">Guardar</button>
    </div>

    <div class="content">
      <div id="editor" class="custom-editor"></div>
    </div>
  </div>
</template>

<script>
  import { onMounted } from 'vue';
  import Quill from 'quill';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';

  export default {
    name: 'CreatePostComponent',
    components: {},
    data() {
      return {
        date: '29/08/2019',
      };
    },
    setup() {
      onMounted(() => {
        const SizeStyle = Quill.import('attributors/style/size');
        SizeStyle.whitelist = ['12px', '14px', '16px', '18px']; // Tamaños permitidos
        Quill.register(SizeStyle, true);

        const toolbarOptions = [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          ['bold', 'italic', 'underline', 'strike'],
          ['link', 'image'],
          [
            { align: [] },
            { list: 'ordered' },
            { list: 'bullet' },
            { list: 'check' },
          ],

          ['code-block', { direction: 'rtl' }],

          ['clean'],
        ];

        new Quill('#editor', {
          modules: {
            toolbar: toolbarOptions,
          },
          theme: 'snow',
        });
      });

      return {};
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
  }

  .date {
    text-align: right;
    cursor: pointer;
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
    padding-bottom: 3em;
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
    background-color: rgba(
      var(--primary-color, 59, 130, 246),
      0.1
    ) !important;
  }
</style>
