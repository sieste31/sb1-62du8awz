import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import LandingPageJA from '../src/pages/LandingJA';
import LandingPageEN from '../src/pages/LandingEN';

function generateStaticPage(Page: React.ComponentType, lang: 'ja' | 'en') {
    const helmetContext: { helmet?: any } = {};

    const html = ReactDOMServer.renderToString(
        React.createElement(
            HelmetProvider,
            { context: helmetContext },
            React.createElement(
                I18nextProvider,
                { i18n: i18n },
                React.createElement(Page)
            )
        )
    );

    const { helmet } = helmetContext;

    const fullHtml = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${helmet ? helmet.title.toString() : ''}
    ${helmet ? helmet.meta.toString() : ''}
    <link rel="stylesheet" href="/assets/index-jlf8ZuOB.css">
    <script type="module" src="/assets/index-B0pRpIvU.js"></script>
</head>
<body>
    <div id="root" data-prerendered="true">${html}</div>
</body>
</html>
`;

    return fullHtml;
}

function writeStaticPage(filename: string, content: string) {
    const outputPath = path.resolve(__dirname, '../dist', filename);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(outputPath, content);
    console.log(`Generated static page: ${filename}`);
}

function generateStaticPages() {
    const jaPage = generateStaticPage(LandingPageJA, 'ja');
    const enPage = generateStaticPage(LandingPageEN, 'en');

    writeStaticPage('ja/index.html', jaPage);
    writeStaticPage('en/index.html', enPage);
}

generateStaticPages();
