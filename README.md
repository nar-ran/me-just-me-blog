# Me, Just Me - Blog Personal

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Pinia](https://img.shields.io/badge/Pinia-FFD600?style=for-the-badge&logo=pinia&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

"Me, Just Me" es una plataforma de blog personal desarrollada con Vue.js 3 (Composition API). Permite a los usuarios autenticarse para crear y gestionar sus propias entradas, organizarlas por categorías y mucho más. El proyecto destaca por su diseño limpio, su interfaz responsiva y una integración con la API de Spotify para mostrar la música que el autor ha escuchado recientemente.

## 🚀 Funcionalidades Principales

- **Autenticación de Usuarios:** Sistema de Login/Logout para gestionar el contenido del blog.
- **Gestión de Posts:**
  - Creación de nuevas entradas a través de un editor de texto enriquecido.
  - Visualización de todos los posts en la página principal, ordenados cronológicamente.
- **Gestión de Categorías:**
  - Creación de categorías para organizar los posts.
  - Selección de múltiples categorías al crear un post.
  - Navegación a través de las categorías.
- **Página de Favoritos:** Una sección dedicada para visualizar los posts marcados como favoritos.
- **Integración con Spotify:** Muestra en la barra lateral la última canción que el autor ha reproducido en Spotify, incluyendo carátula, nombre de la canción y artista.
- **Diseño Responsivo:** La interfaz se adapta fluidamente a diferentes tamaños de pantalla, desde dispositivos móviles hasta ordenadores de escritorio.
- **Búsqueda:** Funcionalidad para buscar entradas específicas dentro del blog.

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
- **Enrutamiento:** [Vue Router](https://router.vuejs.org/)
- **Gestión de Estado:** [Pinia](https://pinia.vuejs.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Iconos:** [Material Symbols](https://fonts.google.com/icons)
- **Fuentes:** [Google Fonts](https://fonts.google.com/) (uso de fuentes de libre uso)
- **Estilos:** CSS3 nativo con variables, Flexbox y Grid Layout.

### Backend

- **Plataforma:** [Supabase](https://supabase.io/)
- **Funcionalidades:** Autenticación de usuarios, base de datos PostgreSQL para posts y categorías, y APIs autogeneradas.

## 📝 Estructura de la Base de Datos (Supabase)

La base de datos en Supabase se organiza en torno a las siguientes tablas principales para gestionar el contenido del blog.

### Tabla `posts`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del post (Clave primaria). |
| `created_at` | `timestampz` | Fecha y hora de creación. |
| `title` | `text` | Título del post. |
| `content` | `text` | Contenido del post en formato HTML. |
| `is_favorite` | `boolean` | `true` si el post está marcado como favorito. |
| `user_id` | `uuid` | Referencia al usuario que creó el post. |

### Tabla `categories`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único de la categoría (Clave primaria). |
| `created_at` | `timestampz` | Fecha y hora de creación. |
| `name` | `text` | Nombre de la categoría. |
| `user_id` | `uuid` | Referencia al usuario que creó la categoría. |

### Tabla `post_categories` (Tabla de Unión)
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `post_id` | `uuid` | Referencia a la tabla `posts` (Clave foránea). |
| `category_id` | `uuid` | Referencia a la tabla `categories` (Clave foránea). |


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
    Crea un archivo `.env.local` en la raíz del proyecto y añade las variables necesarias. Necesitarás las credenciales para la API de Spotify y las claves de tu proyecto de Supabase.

    ```env
    # Variables para la API de Spotify
    VITE_SPOTIFY_CLIENT_ID=tu_client_id
    VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret
    VITE_SPOTIFY_REFRESH_TOKEN=tu_refresh_token

    # Variables para Supabase
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    ```

4.  **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

5.  Abre tu navegador y visita `http://localhost:5173` (o el puerto que Vite indique).
