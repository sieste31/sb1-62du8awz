// 国際化対応のためのユーティリティ関数
import i18n from '../i18n';

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
    '単５形': 'battery.shape.n',
    'LR44/SR44': 'battery.shape.lr44',
    'CR2032': 'battery.shape.cr2032',
    'CR2025': 'battery.shape.cr2025',
    'CR2016': 'battery.shape.cr2016',
    '9V形': 'battery.shape.9v',
    'その他': 'battery.shape.other'
  };
  return mapping[shape] || shape;
};

/**
 * URLパスから言語コードを抽出する
 * @returns 抽出された言語コード（'ja' または 'en'）
 */
export const extractLanguageFromPath = (): string => {
  const path = window.location.pathname;
  if (path.startsWith('/en/')) {
    return 'en';
  }
  return 'ja';
};

/**
 * URLパスに基づいて言語を設定する
 */
export const setLanguageFromPath = () => {
  const language = extractLanguageFromPath();
  i18n.changeLanguage(language);
};
