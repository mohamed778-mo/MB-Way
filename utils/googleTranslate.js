const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY, 
});

const translateText = async (text, targetLanguage) => {
    try {
        let [translations] = await translate.translate(text, targetLanguage);
        return translations;
    } catch (error) {
        console.error('Translation error:', error);
        return text; 
    }
};

module.exports = translateText;
