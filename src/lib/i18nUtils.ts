// 国際化対応のためのユーティリティ関数

/**
 * 電池形状のデータベース値（日本語）を翻訳キーに変換する
 * @param shape 電池形状のデータベース値（例: "単3形"）
 * @returns 対応する翻訳キー（例: "battery.shape.aa"）
 */
export const batteryShapeToTranslationKey = (shape: string): string => {
  const mapping: Record<string, string> = {
    '単1形': 'battery.shape.d',
    '単2形': 'battery.shape.c',
    '単3形': 'battery.shape.aa',
    '単4形': 'battery.shape.aaa',
    '9V形': 'battery.shape.9v'
  };
  return mapping[shape] || shape;
};
