import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import LandingPageJA from './pages/LandingJA';
import LandingPageEN from './pages/LandingEN';

const renderPage = (Page: React.ComponentType, lang: 'ja' | 'en') => {
    const helmetContext: { helmet?: any } = {};

    const html = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <I18nextProvider i18n={i18n}>
                <Page />
            </I18nextProvider>
        </HelmetProvider>
    );

    const { helmet } = helmetContext;

    return `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            ${helmet ? helmet.title.toString() : ''}
            ${helmet ? helmet.meta.toString() : ''}
            <script type="module" src="/src/main.tsx"></script>
        </head>
        <body>
            <div id="root">${html}</div>
        </body>
        </html>
    `;
};

export default {
    '/ja': () => renderPage(LandingPageJA, 'ja'),
    '/en': () => renderPage(LandingPageEN, 'en')
};
