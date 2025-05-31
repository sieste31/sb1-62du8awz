const fs = require('fs');
const path = require('path');
const translationJA = require('../src/locales/ja/translation.json');
const translationEN = require('../src/locales/en/translation.json');

function generateStaticPage(lang) {
    const translations = lang === 'ja' ? translationJA : translationEN;
    const heroTitle = translations.landingPage.hero.title;
    const heroSubtitle = translations.landingPage.hero.subtitle;
    const ctaSignup = translations.landingPage.cta.signup;
    const existingUser = translations.landingPage.hero.existingUser;

    const fullHtml = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BattDevy - ${heroTitle}</title>
    <meta name="description" content="${heroSubtitle}">
    <meta name="keywords" content="battery management, device tracking, battery life">
    <link rel="stylesheet" href="/assets/index-jlf8ZuOB.css">
    <script type="module" src="/assets/index-BXeorLrz.js"></script>
    
    <meta property="og:title" content="BattDevy - ${heroTitle}">
    <meta property="og:description" content="${heroSubtitle}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://battdevy.com/${lang}">
    <meta property="og:image" content="/og-image-${lang}.png">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="BattDevy - ${heroTitle}">
    <meta name="twitter:description" content="${heroSubtitle}">
    <meta name="twitter:image" content="/og-image-${lang}.png">
</head>
<body>
    <div id="root" data-prerendered="true">
        <div class="min-h-screen bg-gray-100 flex flex-col">
            <header class="bg-white shadow-md">
                <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
                    <a href="/" class="text-2xl font-bold text-blue-600">BattDevy</a>
                </nav>
            </header>

            <main class="flex-grow container mx-auto px-4 py-16">
                <section class="text-center mb-16">
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${heroTitle}</h1>
                    <p class="text-xl text-gray-600 mb-8">${heroSubtitle}</p>

                    <div class="flex justify-center items-center space-x-4">
                        <a href="/signup" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                            ${ctaSignup}
                        </a>
                        <a href="/login" class="text-blue-600 hover:text-blue-800 transition duration-300">
                            ${existingUser}
                        </a>
                    </div>
                </section>
            </main>

            <footer class="bg-gray-800 text-white py-8">
                <div class="container mx-auto px-4 text-center">
                    <p>&copy; 2025 BattDevy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </div>
</body>
</html>
`;

    return fullHtml;
}

function writeStaticPage(filename, content) {
    const outputPath = path.resolve(__dirname, '../dist', filename);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(outputPath, content);
    console.log(`Generated static page: ${filename}`);
}

function generateStaticPages() {
    const jaPage = generateStaticPage('ja');
    const enPage = generateStaticPage('en');

    writeStaticPage('ja/index.html', jaPage);
    writeStaticPage('en/index.html', enPage);
}

generateStaticPages();
