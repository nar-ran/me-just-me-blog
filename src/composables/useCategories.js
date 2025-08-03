import { ref } from 'vue';
import { supabase } from '@/stores/supabase';

export function useCategories() {
  const categories = ref([]);

  async function fetchCategories() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: conteos, error } = await supabase
      .from('categoria_conteos')
      .select('*');

    if (error) throw error;

    const { data: categoriasData, error: catError } = await supabase
      .from('categorias')
      .select('*')
      .eq('usuario_id', user.id)
      .limit(3);

    if (catError) throw catError;

    categories.value = categoriasData.map((cat) => {
      const match = conteos.find((c) => c.categoria_id === cat.categoria_id);
      return {
        ...cat,
        postCount: match?.post_count || 0,
      };
    });
  }

  return {
    categories,
    fetchCategories,
  };
}
