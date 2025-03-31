import { supabase } from '../supabase';
import { compressImage } from '../imageUtils';

// 画像をアップロードして電池グループに関連付ける
export async function uploadBatteryGroupImage(
  userId: string,
  groupId: string,
  imageBlob: Blob,
  existingImageUrl: string | null = null
) {
  try {
    // 圧縮処理
    const compressedFile = await compressImage(imageBlob, {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 200,
    });

    const fileExt = compressedFile.name.split('.').pop();
    const filePath = `${userId}/${groupId}/image.${fileExt}`;

    // まず既存の画像を削除
    if (existingImageUrl) {
      const existingPath = existingImageUrl.split('/').slice(-3).join('/');
      await supabase.storage
        .from('battery-images')
        .remove([existingPath]);
    }

    // 新しい画像をアップロード
    const { error: uploadError } = await supabase.storage
      .from('battery-images')
      .upload(filePath, compressedFile, { upsert: true });

    if (uploadError) throw uploadError;

    // 電池グループの画像URLを更新
    const { error: updateError } = await supabase
      .from('battery_groups')
      .update({ image_url: filePath })
      .eq('id', groupId);

    if (updateError) throw updateError;

    return filePath;
  } catch (err) {
    console.error('画像アップロード処理エラー:', err);
    throw err;
  }
}

// ストレージから画像を削除
export async function removeBatteryGroupImage(imagePath: string) {
  if (!imagePath) return false;
  
  try {
    const { error } = await supabase.storage
      .from('battery-images')
      .remove([imagePath]);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('画像削除エラー:', err);
    throw err;
  }
}

// デバイス画像のアップロード
export async function uploadDeviceImage(
  userId: string,
  deviceId: string,
  imageBlob: Blob,
  existingImageUrl: string | null = null
) {
  try {
    // 圧縮処理
    const compressedFile = await compressImage(imageBlob, {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 200,
    });

    const fileExt = compressedFile.name.split('.').pop();
    const filePath = `${userId}/${deviceId}/image.${fileExt}`;

    // まず既存の画像を削除
    if (existingImageUrl) {
      const existingPath = existingImageUrl.split('/').slice(-3).join('/');
      await supabase.storage
        .from('device-images')
        .remove([existingPath]);
    }

    // 新しい画像をアップロード
    const { error: uploadError } = await supabase.storage
      .from('device-images')
      .upload(filePath, compressedFile, { upsert: true });

    if (uploadError) throw uploadError;

    // デバイスの画像URLを更新
    const { error: updateError } = await supabase
      .from('devices')
      .update({ image_url: filePath })
      .eq('id', deviceId);

    if (updateError) throw updateError;

    return filePath;
  } catch (err) {
    console.error('画像アップロード処理エラー:', err);
    throw err;
  }
}
