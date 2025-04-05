import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻訳ファイルのインポート
import translationJA from './locales/ja/translation.json';
import translationEN from './locales/en/translation.json';

// 利用可能な言語リソース
const resources = {
  ja: {
    translation: translationJA
  },
  en: {
    translation: translationEN
  }
};

i18n
  // ブラウザの言語を自動検出
  .use(LanguageDetector)
  // react-i18nextの初期化
  .use(initReactI18next)
  // i18nextの初期化
  .init({
    resources,
    fallbackLng: 'ja', // フォールバック言語
    debug: process.env.NODE_ENV === 'development', // 開発環境の場合はデバッグモードを有効化

    interpolation: {
      escapeValue: false // XSS対策は不要（Reactが行う）
    },

    // 言語検出の設定
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
