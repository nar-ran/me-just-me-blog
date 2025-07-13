<template>
  <div class="container">
    <div class="image-icon" @click="selectImage">
      <img
        class="profile-image"
        :src="profileImage"
        ref="profileImage"
        alt="Imagen de perfil" />
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        style="display: none"
        @change="handleImageUpload" />

      <span class="icon material-symbols-outlined"> add_photo_alternate </span>
    </div>

    <div class="container-blog-name">
      <p class="blog-title">Me, Just Me</p>
      <p style="font-size: 1.2em; text-align: center">{{ username }}</p>
    </div>

    <hr />

    <div class="options">
      <a href="/create-post/">
        <p>
          Crear Entrada
          <span class="material-symbols-outlined"> contextual_token_add </span>
        </p>
      </a>
      <div>
        <p @click="$emit('openCreateCategory')">
          Crear Categoría
          <span class="material-symbols-outlined"
            >format_list_bulleted_add</span
          >
        </p>
      </div>
      <a href="/favorites/">
        <p>
          Favoritos
          <span class="material-symbols-outlined"> favorite </span>
        </p>
      </a>

      <hr />
      <a @click="handleLogout">
        <p>
          Cerrar Sesión
          <span class="material-symbols-outlined"> chip_extraction </span>
        </p>
      </a>
    </div>
  </div>

  <ErrorMessagePopup v-if="error" :message="error" @close="error = ''" />
  <AlertMessageModal
    v-if="alertConfirm"
    :message="alertConfirm"
    @close="alertConfirm = ''" />
</template>

<script>
  import { useRouter } from 'vue-router';
  import { supabase } from '@/stores/supabase';
  import { useAuthStore } from '@/stores/auth';

  import ErrorMessagePopup from '../Utils/ErrorMessagePopup.vue';
  import AlertMessageModal from '../Utils/AlertMessageModal.vue';

  export default {
    name: 'SidebarNavComponent',
    components: {
      ErrorMessagePopup,
      AlertMessageModal,
    },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();

      const handleLogout = () => {
        authStore.logout();
        router.push('/login');
      };

      return {
        authStore,
        handleLogout,
      };
    },
    data() {
      return {
        profileImage: require('@/assets/profileImage/obsess.jpg'),
        username: '',
        error: '',
        alertConfirm: '',
      };
    },
    methods: {
      selectImage() {
        this.$refs.fileInput.click();
      },
      async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
          this.error = 'Por favor selecciona un archivo de imagen válido.';
          return;
        }

        const userId = this.authStore.user.id;
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${userId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          this.error = 'Error al subir la imagen.';
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const avatarUrl = publicUrlData.publicUrl;

        // Actualiza la URL del avatar en la tabla usuarios
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ url_avatar: avatarUrl })
          .eq('usuario_id', userId);

        if (updateError) {
          this.error = 'Error al guardar la imagen en tu perfil.';
          return;
        }

        this.profileImage = `${avatarUrl}?t=${Date.now()}`;
        this.alertConfirm = 'Imagen de perfil actualizada correctamente.';
      },
    },
    async mounted() {
      try {
        // 1. Obtener el usuario actual
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('No se pudo obtener la sesión del usuario.');
        }

        // 2. Usar el ID del usuario para obtener el perfil de la tabla 'usuarios'
        const { data: profileData, error: profileError } = await supabase
          .from('usuarios')
          .select('usuario, url_avatar') // Pedimos el username y el avatar
          .eq('usuario_id', user.id)
          .single();

        // Si hay un error y no es porque el perfil no existe
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // 3. Asignar los datos a las variables del componente
        if (profileData) {
          this.username = profileData.usuario;
          if (profileData.url_avatar) {
            this.profileImage = `${profileData.url_avatar}?t=${Date.now()}`;
          }
        } else {
          // Si no hay perfil en 'usuarios', usamos el email como fallback
          this.username = user.email.split('@')[0];
        }
      } catch (err) {
        this.error = err.message || 'Error al cargar los datos del perfil.';
        console.error(err);
      }
    },
  };
</script>

<style scoped>
  .container {
    height: 100%;
    min-width: 16rem;
    box-sizing: border-box;

    padding: 2em;
    margin: 0;
    border-radius: 15px;
    color: var(--text-color);

    background: linear-gradient(
      180deg,
      var(--primary-color),
      var(--secondary-color)
    );

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-icon {
    height: 13em;
    width: 13em;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    box-shadow: 0 5px 20px 3px var(--background-color-op50);
  }

  .profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .image-icon:hover .profile-image {
    filter: brightness(60%);
    transform: scale(1.05);
    cursor: pointer;
  }

  .image-icon .icon {
    position: absolute;
    color: var(--text-color);
    font-size: 2em;
    opacity: 0;
  }

  .image-icon:hover .icon {
    opacity: 1;
    cursor: pointer;
  }

  .blog-title {
    font-size: 2em;
    margin: 0;
    text-align: center;
  }

  .container-blog-name {
    margin: 32px 0px;
  }

  hr {
    width: 100%;
    height: 2px;
    border: transparent;
    border-radius: 50px;
    background: linear-gradient(
      45deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  a {
    text-decoration: none;
    color: var(--text-color);
  }

  .options {
    width: 100%;
    max-width: 100%;
    padding: 0 20px;
  }

  .options p {
    cursor: pointer;

    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    font-size: 1.3em;
  }

  .options a:hover p,
  .options div:hover p {
    text-shadow: 0 0 20px var(--text-color);
  }

  .options a p span {
    justify-self: end;
  }

  @media (max-width: 700px) {
    .container {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 250px;
      border-radius: 0 15px 0 15px;
      background: linear-gradient(
        180deg,
        var(--primary-color),
        var(--secondary-color)
      );
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      z-index: 1000;
    }

    .is-visible .container {
      transform: translateX(0);
    }
  }
</style>
