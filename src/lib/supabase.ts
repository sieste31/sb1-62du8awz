import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 画像のsigned URLを取得する関数
export async function getSignedUrl(bucket: string, path: string | null) {
  if (!path) return null;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1時間有効

    if (error) throw error;
    return data.signedUrl;
  } catch (err) {
    console.error('Error getting signed URL:', err);
    return null;
  }
}