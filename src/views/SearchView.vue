<template>
  <app-header-component />
  <div class="container">
    <div class="title-section">
      <p v-if="searchQuery">Resultados de búsqueda para: "{{ searchQuery }}"</p>
      <p v-else>Búsqueda de Entradas</p>
    </div>

    <div v-if="loading" class="loading-message">Buscando...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-else style="margin: 0 1em">
      <!-- 1. Si hay resultados, los mostramos -->
      <div v-if="results.length > 0">
        <router-link
          v-for="post in results"
          :key="post.entrada_id"
          :to="{ name: 'post-detail', params: { slug: post.slug } }"
          class="post-link">
          <div class="post-card">
            <div class="post-header">
              <span>{{ post.titulo }}</span>
              <span class="right-info">
                <span class="post-date">{{ formatDate(post.fecha) }}</span>
              </span>
            </div>
            <p class="post-content multiline-ellipsis">
              {{ getPlainText(post.contenido) }}
            </p>
          </div>
        </router-link>
      </div>
      <!-- 2. Si no hay término de búsqueda, mostramos un mensaje inicial -->
      <div v-else-if="!searchQuery" class="initial-state-message">
        <p>
          Usa la barra de búsqueda para encontrar entradas por título o
          contenido.
        </p>
      </div>
      <!-- 3. Si hay búsqueda pero sin resultados, mostramos el mensaje de "no encontrados" -->
      <div v-else class="no-results-message">
        <p>No se encontraron resultados para tu búsqueda.</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, watch } from 'vue';
  import { supabase } from '@/stores/supabase';
  import AppHeaderComponent from '@/components/AppHeaderComponent/AppHeaderComponent.vue';

  export default {
    name: 'SearchView',
    components: { AppHeaderComponent },
    props: {
      query: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const searchQuery = ref(props.query);
      const results = ref([]);
      const loading = ref(false);
      const error = ref(null);

      const fetchResults = async () => {
        if (!searchQuery.value.trim()) {
          results.value = [];
          return;
        }

        loading.value = true;
        error.value = null;
        results.value = [];

        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            throw new Error(
              'No se pudo obtener el usuario. Por favor, inicia sesión de nuevo.'
            );
          }

          const { data, error: dbError } = await supabase
            .from('entradas')
            .select('*')
            .eq('usuario_id', user.id)
            .eq('publicado', true)
            .or(
              `titulo.ilike.%${searchQuery.value}%,contenido.ilike.%${searchQuery.value}%`
            )
            .order('fecha', { ascending: false });

          if (dbError) throw dbError;

          results.value = data.filter((post) => post && post.slug);
        } catch (e) {
          error.value =
            e.message || 'Ocurrió un error al realizar la búsqueda.';
        } finally {
          loading.value = false;
        }
      };

      watch(
        () => props.query,
        (newQuery) => {
          searchQuery.value = newQuery || '';
          fetchResults();
        },
        { immediate: true }
      );

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      };

      const getPlainText = (html) => {
        if (!html) return '';
        const tempElem = document.createElement('div');
        tempElem.innerHTML = html;
        return tempElem.textContent || tempElem.innerText || '';
      };

      return {
        searchQuery,
        results,
        loading,
        error,
        formatDate,
        getPlainText,
      };
    },
  };
</script>

<style scoped>
  .container {
    padding: 40px 2em;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .title-section {
    font-size: 2em;
    text-align: center;
    font-family: var(--font-primary);
    color: var(--text-color);
    margin-bottom: 20px;
  }

  .post-card {
    background: linear-gradient(
      to right,
      var(--primary-color),
      var(--secondary-color)
    );
    border-radius: 16px;
    padding: 22px 26px;
    margin-bottom: 28px;
    color: var(--text-color);
    font-family: var(--font-primary);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease;
  }

  .post-card:hover {
    transform: scale(1.01);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    font-size: 1.4em;
    margin-bottom: 10px;
    color: var(--text-color);
  }

  .right-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .post-date {
    font-size: 0.9em;
    white-space: nowrap;
    padding-left: 10px;
    color: var(--text-color);
  }

  .post-content {
    font-size: 0.95em;
    color: rgba(247, 247, 247, 0.58);
    white-space: pre-wrap;
    margin-top: 5px;
    padding-left: 15px;
  }

  .multiline-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-link {
    text-decoration: none;
    color: inherit;
  }

  .no-results-message,
  .initial-state-message,
  .loading-message,
  .error-message {
    text-align: center;
    font-size: 1.2em;
    margin-top: 2em;
    color: var(--text-color);
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .container {
      padding: 20px;
    }
  }
</style>
