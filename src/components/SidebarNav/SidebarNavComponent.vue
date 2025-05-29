<template>
  <div class="container">
    <div class="image-icon" @click="selectImage">
      <!-- <img v-if="profileImage" :src="profileImage" ref="profileImage" alt="Imagen de perfil" /> -->
      <img
        class="profile-image"
        :src="profileImage"
        ref="profileImage"
        alt="Imagen de perfil"
      />
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        style="display: none"
        @change="handleImageUpload"
      />

      <span class="icon material-symbols-outlined"> add_photo_alternate </span>
    </div>

    <p class="blog-title">Me, Just Me</p>

    <hr />

    <div class="options">
      <a href="/create-post/">
        <p>
          Crear Entrada
          <span class="material-symbols-outlined"> contextual_token_add </span>
        </p>
      </a>
      <a href="/create-category/">
        <p>
          Crear Categoria
          <span class="material-symbols-outlined">
            format_list_bulleted_add
          </span>
        </p>
      </a>
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
</template>

<script>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "SidebarNavComponent",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
      authStore.logout();
      router.push("/login");
    };

    return {
      authStore,
      handleLogout,
    };
  },
  data() {
    return {
      profileImage: require("@/assets/profileImage/obsess.jpg"),
    };
  },
  methods: {
    selectImage() {
      this.$refs.fileInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Por favor selecciona un archivo de imagen válido.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  min-width: 16rem;
  box-sizing: border-box;

  padding: 2em;
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
  text-align: center;
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

.options :hover {
  text-shadow: 0 0 20px var(--text-color);
}

.options p span {
  justify-self: end;
}
</style>
