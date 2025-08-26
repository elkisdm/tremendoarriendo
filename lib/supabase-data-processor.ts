import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface SupabaseProcessor {
  getBuildings: () => Promise<any[]>;
  getBuildingBySlug: (slug: string) => Promise<any | null>;
  getRelatedBuildings: (slug: string, limit: number) => Promise<any[]>;
}

export function getSupabaseProcessor(): SupabaseProcessor {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  return {
    async getBuildings() {
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching buildings:', error);
        return [];
      }
    },

    async getBuildingBySlug(slug: string) {
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching building by slug:', error);
        return null;
      }
    },

    async getRelatedBuildings(slug: string, limit: number) {
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .neq('slug', slug)
          .limit(limit)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching related buildings:', error);
        return [];
      }
    },
  };
}
