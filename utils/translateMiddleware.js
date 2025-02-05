const translateText = require('./googleTranslate'); 

const translateMiddleware = async (req, res, next) => {
    const lang = req.query.lang || 'en'; 
    if (lang === 'en' || lang === 'tr') {
        const originalJson = res.json;

        res.json = async function (data) {
            if (typeof data === 'object') {
                for (const key in data) {
                    if (typeof data[key] === 'string') {
                        data[key] = await translateText(data[key], lang);
                    } else if (typeof data[key] === 'object' && data[key] !== null) {
                        for (const subKey in data[key]) {
                            if (typeof data[key][subKey] === 'string') {
                                data[key][subKey] = await translateText(data[key][subKey], lang);
                            }
                        }
                    }
                }
            }
            originalJson.call(this, data);
        };
    }
    next();
};

module.exports = translateMiddleware;
