'use client';

import { getSignedUrl } from './supabase';
import { useStore } from './store';

export const defaultDeviceImages = {
  remotecontroller: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
  gadget: 'https://images.unsplash.com/photo-1586349906319-48d20e9d17e5?w=400&h=400&fit=crop',
  light: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
  toy: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
  other: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop',
} as const;

export async function getDeviceImage(type: keyof typeof defaultDeviceImages, customImageUrl?: string | null) {
  const { setCachedImage, getCachedImage } = useStore.getState();

  if (customImageUrl) {
    // キャッシュをチェック
    const cachedUrl = getCachedImage(customImageUrl);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Supabaseのストレージの画像の場合はsigned URLを取得
    if (!customImageUrl.startsWith('http')) {
      const signedUrl = await getSignedUrl('device-images', customImageUrl);
      if (signedUrl) {
        // キャッシュに保存
        setCachedImage(customImageUrl, signedUrl);
        return signedUrl;
      }
    }
    return customImageUrl;
  }
  return defaultDeviceImages[type];
}
