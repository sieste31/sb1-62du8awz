import { TFunction } from 'i18next';

interface SEOMetadata {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
}

export const generateLandingPageSEO = (t: TFunction, lang: 'ja' | 'en'): SEOMetadata => {
    const seoData: Record<'ja' | 'en', SEOMetadata> = {
        ja: {
            title: 'BattDevy - スマートな電池管理アプリ | デバイスの電池状況をリアルタイムで追跡',
            description: '電池切れの不安を解消する、デバイスの電池管理アプリ。リアルタイムで電池状況を追跡し、効率的に管理できます。',
            keywords: [
                '電池管理', 'バッテリー追跡', 'デバイス電池', 'スマートアプリ',
                '電池切れ通知', '電池在庫管理', 'バッテリーライフ'
            ],
            ogTitle: 'BattDevy - スマートな電池管理アプリ',
            ogDescription: '電池切れの不安を解消する、デバイスの電池管理アプリ',
            ogImage: '/og-image-ja.png'
        },
        en: {
            title: 'BattDevy - Smart Battery Management App | Real-Time Device Battery Tracking',
            description: 'Eliminate battery anxiety with our device battery management app. Track battery status in real-time and manage efficiently.',
            keywords: [
                'battery management', 'battery tracking', 'device battery', 'smart app',
                'battery depletion alerts', 'battery inventory', 'battery life'
            ],
            ogTitle: 'BattDevy - Smart Battery Management App',
            ogDescription: 'Eliminate battery anxiety with our device battery management app',
            ogImage: '/og-image-en.png'
        }
    };

    return seoData[lang];
};

export const renderSEOMetaTags = (seo: SEOMetadata) => {
    return {
        title: seo.title,
        meta: [
            { name: 'description', content: seo.description },
            { name: 'keywords', content: seo.keywords.join(', ') },
            { property: 'og:title', content: seo.ogTitle },
            { property: 'og:description', content: seo.ogDescription },
            { property: 'og:image', content: seo.ogImage },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: seo.ogTitle },
            { name: 'twitter:description', content: seo.ogDescription },
            { name: 'twitter:image', content: seo.ogImage }
        ]
    };
};
