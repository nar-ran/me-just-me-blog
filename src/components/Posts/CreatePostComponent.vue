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
        const toolbarOptions = [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          ['link', 'image', 'video', 'formula'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'], // remove formatting button
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
    font-size: 1.5em;
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
    font-family: var(--font-primary);
    font-size: 1.2em;

    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  #editor.ql-container.ql-snow {
    flex-grow: 1;

    border: none !important;
    border-radius: 0 0 20px 20px;

    background: linear-gradient(
      to bottom,
      var(--secondary-color),
      var(--primary-color)
    );

    color: var(--text-color);
    font-family: var(--font-primary);
    font-size: 1.2em;
  }

  /* Editor de texto interno */
  #editor .ql-editor {
    flex-grow: 1;

    color: var(--text-color) !important;
    padding: 1em;
    border: none;
  }

  /* Barra de herramientas */
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

  .ql-toolbar.ql-snow button .ql-stroke,
  .ql-toolbar.ql-snow button .ql-fill,
  .ql-toolbar.ql-snow svg {
    stroke: var(--text-color) !important;
    /* fill: var(--primary-color) !important;  */
  }

  .ql-toolbar.ql-snow .ql-picker-label {
    color: var(--text-color) !important;
  }

  button:hover .ql-stroke,
  .ql-picker-label:hover .ql-stroke {
    fill: none;
    stroke: var(--primary-color) !important;
  }
</style>
