'use client';

import { getSignedUrl } from './supabase';
import { useStore } from './store';

export const defaultBatteryImages = {
  '単1形': 'https://images.unsplash.com/photo-1621360241147-d9ecddc46459?w=400&h=400&fit=crop',
  '単2形': 'https://images.unsplash.com/photo-1621360241147-d9ecddc46459?w=400&h=400&fit=crop',
  '単3形': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&h=400&fit=crop',
  '単4形': 'https://images.unsplash.com/photo-1584269600519-0d15e1a71570?w=400&h=400&fit=crop',
  '9V形': 'https://images.unsplash.com/photo-1621360241147-d9ecddc46459?w=400&h=400&fit=crop',
} as const;

export async function getBatteryImage(type: keyof typeof defaultBatteryImages, customImageUrl?: string | null) {
  const { setCachedImage, getCachedImage } = useStore.getState();

  if (customImageUrl) {
    // キャッシュをチェック
    const cachedUrl = getCachedImage(customImageUrl);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Supabaseのストレージの画像の場合はsigned URLを取得
    if (!customImageUrl.startsWith('http')) {
      const signedUrl = await getSignedUrl('battery-images', customImageUrl);
      if (signedUrl) {
        // キャッシュに保存
        setCachedImage(customImageUrl, signedUrl);
        return signedUrl;
      }
    }
    return customImageUrl;
  }
  return defaultBatteryImages[type];
}