#!/usr/bin/env node

// Import iconv-lite using require
const iconv = require('iconv-lite');

// Language name to code mapping
const languageCodes = {
    french: 'fr',
    german: 'de',
    spanish: 'es',
    bengali: 'bn',
    japanese: 'ja',
    korean: 'ko',
    chinese: 'zh',
    arabic: 'ar',
    russian: 'ru',
    portuguese: 'pt',
    italian: 'it',
    hindi: 'hi'
};

// Use dynamic import instead of require
import('translate').then(({ default: translate }) => {

    // Function to perform translation
    async function translateText(text, targetLanguages) {
        try {
            // Object to store translated texts
            const translatedTexts = {};

            // Maximum width for alignment
            let maxWidth = 0;

            // Iterate over each target language
            for (const targetLanguage of targetLanguages) {
                const languageCode = languageCodes[targetLanguage];
                if (!languageCode) {
                    console.error(`Error: Unsupported language '${targetLanguage}'.`);
                    continue;
                }

                // Translate the text to the current target language
                const translatedText = await translate(text, { to: languageCode });

                // Convert Bengali output to proper encoding
                const translatedOutput = languageCode === 'bn' ? iconv.encode(translatedText, 'utf-8').toString() : translatedText;

                // Store translated text
                translatedTexts[targetLanguage] = translatedOutput;

                // Update maximum width
                if (translatedOutput.length > maxWidth) {
                    maxWidth = translatedOutput.length;
                }
            }

            // Output translated texts with padding
            for (const [language, translation] of Object.entries(translatedTexts)) {
                const padding = ' '.repeat(maxWidth - translation.length);
                console.log(`Translated text (${language}): ${translation}${padding}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Get command-line arguments
    const args = process.argv.slice(2);
    const text = args.shift(); // Text to translate
    const targetLanguages = args.map(lang => lang.toLowerCase()); // Convert to lowercase

    // Check if text and target languages are provided
    if (!text || targetLanguages.length === 0) {
        console.error('Usage: whatt <text_to_translate> <target_language1> <target_language2> ...');
        process.exit(1);
    }

    // Call the translation function
    translateText(text, targetLanguages);

}).catch(error => {
    console.error('Error importing translate module:', error);
});