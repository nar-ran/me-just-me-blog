<template>
<header>
    <a href="/">
        <p class="name-blog">Me, Just Me</p>
    </a>
    <div class="input-container">
        <input type="text" class="buscador" placeholder="Buscar entrada..." />
        <span class="material-symbols-outlined icono-buscador"> search </span>
    </div>

    <div class="icons">
        <a href="/"><span class="material-symbols-outlined">home</span></a>
        <a href="#" @click="handleLogout"><span class="material-symbols-outlined">chip_extraction</span></a>
    </div>
</header>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
    name: "AppHeaderComponent",
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const handleLogout = async () => {
            await authStore.logout();
            router.push("/login");
        };

        return {
            authStore,
            handleLogout,
        };
    },
};
</script>

<style scoped>
header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 10px 30px;
    gap: 20px;
}

a {
    text-decoration: none;
}

.name-blog {
    font-size: 25px;
    margin: 0;

    background: linear-gradient(0deg,
            var(--secondary-color) 0%,
            var(--primary-color) 60%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    width: fit-content;
    background-size: 100% 100%;
}

.input-container {
    position: relative;
    width: 90%;
    max-width: 80%;
    margin: 0 auto;
}

.buscador {
    font-size: 20px;

    width: 100%;
    border-radius: 60px;
    border: none;
    background: linear-gradient(90deg,
            var(--secondary-color),
            var(--primary-color));

    color: var(--text-color);
    font-family: var(--font-primary);

    box-sizing: border-box;
    padding: 10px;
    padding-left: 20px;

    box-shadow: 0 0 0 1px transparent;
    transition: box-shadow 0.2s ease;
}

.buscador:focus {
    outline: none;
    box-shadow: 0 0 0 0.5px var(--primary-color);
}

input {
    font-size: 20px;
    padding: 5px;
    padding-right: 40px;
    padding-left: 20px;
}

input::placeholder {
    color: var(--primary-color);
    opacity: 0.7;
}

.icono-buscador {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;

    background: radial-gradient(circle,
            var(--primary-color) 0%,
            var(--secondary-color) 60%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    width: fit-content;

    background-size: 100% 100%;
}

.icons {
    display: flex;
    gap: 30px;
    align-items: center;
    font-size: 25px;

    background: linear-gradient(120deg,
            var(--secondary-color) 0%,
            var(--primary-color) 40%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    width: fit-content;

    background-size: 100% 100%;
}
</style>
