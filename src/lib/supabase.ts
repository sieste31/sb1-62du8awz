import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  global: {
    fetch: (...args) => {
      // Add retry logic for fetch requests
      const fetchWithRetry = async (attempt = 1, maxAttempts = 3) => {
        try {
          const response = await fetch(...args);
          return response;
        } catch (error) {
          if (attempt < maxAttempts) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            return fetchWithRetry(attempt + 1, maxAttempts);
          }
          throw error;
        }
      };
      return fetchWithRetry();
    },
  },
});

// 画像のsigned URLを取得する関数
export async function getSignedUrl(bucket: string, path: string | null) {
  if (!path) return null;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1時間有効

    if (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error('Error getting signed URL:', err);
    return null;
  }
}
