import imageCompression from 'browser-image-compression';

interface CompressImageOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const defaultOptions: CompressImageOptions = {
  maxSizeMB: 0.5, // 500KB
  maxWidthOrHeight: 800, // 800px
  useWebWorker: true,
};

export async function compressImage(
  file: File | Blob,
  customOptions?: Partial<CompressImageOptions>
): Promise<File> {
  try {
    // 画像のバリデーション
    validateImage(file);

    const options = { ...defaultOptions, ...customOptions };

    // Blobの場合はFileに変換
    const fileToCompress = file instanceof File 
      ? file 
      : new File([file], 'image.jpg', { type: file.type });

    // 画像の圧縮を実行
    const compressedFile = await imageCompression(fileToCompress, options);

    // ファイル名を生成
    const fileName = file instanceof File ? file.name : 'cropped_image.jpg';
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const compressedFileName = `${fileName.replace(
      `.${fileExtension}`,
      ''
    )}_compressed.${fileExtension}`;

    // 新しいFileオブジェクトを作成
    const resultFile = new File([compressedFile], compressedFileName, {
      type: compressedFile.type,
    });

    return resultFile;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('画像の圧縮に失敗しました');
  }
}

export function validateImage(file: File | Blob): void {
  // MIMEタイプの詳細なチェック
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  // Content-Typeのチェック
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw new Error('JPG、PNG、WebP形式の画像のみアップロードできます');
  }

  // ファイルサイズのチェック（5MB以下）
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('ファイルサイズは5MB以下にしてください');
  }

  // ファイルサイズの最小チェック（空のファイル防止）
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    throw new Error('ファイルサイズが小さすぎます');
  }
}
