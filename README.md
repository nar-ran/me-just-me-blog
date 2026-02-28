# Me, Just Me - Blog Personal ![Estado](https://img.shields.io/badge/Estado-Finalizado-green)

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D) 
![Vue CLI](https://img.shields.io/badge/Vue_CLI-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white) 
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) 
![Pinia](https://img.shields.io/badge/Pinia-FFD600?style=for-the-badge&logo=pinia&logoColor=black)

## 🌐 [Ver Demo en Vivo →](https://me-just-me-blog.vercel.app/) | ✨ [Ver Diseño en Figma →](https://www.figma.com/design/tGnC8FBQ7rmxK1K7QxTOao/Me--Just-Me-Blog?node-id=0-1&t=5RFm1LIO2Jngb79w-1)

"Me, Just Me" es una plataforma de blog personal desarrollada con Vue.js 3 (Options API). Permite a los usuarios autenticarse para crear y gestionar sus propias entradas, organizarlas por categorías y mucho más. El proyecto destaca por su diseño limpio, su interfaz responsiva y una integración con la API de Spotify para mostrar la música que el autor ha escuchado recientemente.

> **Nota Importante:** Este proyecto está concebido como un blog personal para un **único usuario**. El registro de nuevas cuentas no está habilitado desde la interfaz web; el usuario debe ser creado directamente en la base de datos de Supabase.

## 🚀 Funcionalidades Principales

- **Autenticación de Usuarios:** Sistema de Login/Logout para gestionar el contenido del blog.
- **Gestión de Posts:**
  - Creación de nuevas entradas a través de un editor de texto enriquecido.
  - Visualización de todos los posts en la página principal, ordenados cronológicamente.
  - Eliminación de posts desde la pagina de Categorias.
- **Gestión de Categorías:**
  - Creación de categorías para organizar los posts.
  - Navegación a través de las categorías.
  - Marcar posts como favoritos directamente desde la lista de categorías.
- **Página de Favoritos:** Una sección dedicada para visualizar los posts marcados como favoritos.
- **Integración con Spotify:** Muestra en la barra lateral la última canción que el autor ha reproducido en Spotify, incluyendo carátula, nombre de la canción y artista.
- **Diseño Responsivo:** La interfaz se adapta fluidamente a diferentes tamaños de pantalla, desde dispositivos móviles hasta ordenadores de escritorio.
- **Búsqueda:** Funcionalidad para buscar entradas específicas dentro del blog.

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Framework:** [Vue.js 3](https://vuejs.org/) (Options API)
- **Enrutamiento:** [Vue Router](https://router.vuejs.org/)
- **Gestión de Estado:** [Pinia](https://pinia.vuejs.org/)
- **Bundler:** [Vue CLI](https://cli.vuejs.org/)
- **Iconos:** [Material Symbols](https://fonts.google.com/icons)
- **Fuentes:** [Google Fonts](https://fonts.google.com/) (uso de fuentes de libre uso)
- **Estilos:** CSS3 nativo con variables, Flexbox y Grid Layout.

### Backend

- **Plataforma:** [Supabase](https://supabase.io/)
- **Funcionalidades:** Autenticación de usuarios, base de datos PostgreSQL para posts y categorías, y APIs autogeneradas.

## 📝 Estructura de la Base de Datos (Supabase)

La base de datos en Supabase se organiza en torno a las siguientes tablas principales para gestionar el contenido del blog.

### Tabla `posts`

| Columna          | Tipo                     | Descripción                                                                     |
| :--------------- | :----------------------- | :------------------------------------------------------------------------------ |
| `usuario_id`     | `uuid`                   | Referencia al usuario que creó la entrada.                                       |
| `titulo`         | `text`                   | Título de la entrada.                                                           |
| `contenido`      | `text`                   | Contenido de la entrada en formato HTML.                                        |
| `entrada_id`     | `uuid`                   | Identificador único de la entrada (Clave primaria).                              |
| `fecha`          | `timestamp with time zone` | Fecha y hora de publicación.                                                    |
| `publicado`      | `boolean`                | `true` si la entrada está publicada.                                             |
| `favorito`       | `boolean`                | `true` si la entrada está marcada como favorita.                                  |
| `creado_en`      | `timestamp with time zone` | Fecha y hora de creación.                                                         |
| `actualizado_en` | `timestamp with time zone` | Fecha y hora de la última actualización.                                        |
| `slug`           | `text`                   | Slug para la URL amigable.                                                       |

### Tabla `categories`

| Columna        | Tipo   | Descripción                                                 |
| :------------- | :----- | :---------------------------------------------------------- |
| `nombre`       | `text` | Nombre de la categoría.                                     |
| `slug`         | `text` | Slug para la URL amigable.                                   |
| `categoria_id` | `uuid` | Identificador único de la categoría (Clave primaria).         |
| `usuario_id`   | `uuid` | Referencia al usuario que creó la categoría.                  |

### Tabla `post_categories` (Tabla de Unión)

| Columna        | Tipo   | Descripción                                                     |
| :------------- | :----- | :-------------------------------------------------------------- |
| `post_id`      | `uuid` | Referencia a la tabla `entradas` (Clave foránea).                 |
| `categoria_id` | `uuid` | Referencia a la tabla `categorias` (Clave foránea).               |

### Tabla `usuarios`

| Columna      | Tipo   | Descripción                                                 |
| :----------- | :----- | :---------------------------------------------------------- |
| `usuario_id` | `uuid` | Identificador único del usuario (Clave primaria y foránea a `auth.users(id)`). |
| `usuario`    | `text` | Nombre de usuario único (mínimo 3 caracteres).                    |
| `nombre`     | `text` | Nombre completo del usuario.                                  |
| `url_avatar` | `text` | URL del avatar del usuario.                                   |
| `email`      | `text` | Email del usuario.                                            |

## 🏁 Puesta en Marcha (Desarrollo Local)

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/nar-ran/me-just-me-blog.git
    cd me-just-me-blog
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las variables necesarias. Necesitarás las credenciales para la API de Spotify y las claves de tu proyecto de Supabase.

    ```.env
    # Variables para la API de Spotify
    VUE_APP_SPOTIFY_CLIENT_ID="tu_client_id"
    VUE_APP_SPOTIFY_CLIENT_SECRET="tu_client_secret"
    VUE_APP_SPOTIFY_REDIRECT_URI="http://127.0.0.1:8080/"

    # Variables para Supabase
    VUE_APP_SUPABASE_PROJECT_URL="tu_url_de_proyecto_supabase"
    VUE_APP_SUPABASE_ANON_KEY="tu_anon_key_de_supabase"
    ```

4.  **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run serve
    ```

5.  Abre tu navegador y visita `http://127.0.0.1:8080`.



## ⚙️ Credenciales de Prueba para la Demo

Estas credenciales son de solo prueba y están restringidas exclusivamente al entorno demo. No tienen acceso a datos privados ni permiten cambios destructivos.

**Usuario:** mandarina@prueba.co  
**Contraseña:** mandarina1423

