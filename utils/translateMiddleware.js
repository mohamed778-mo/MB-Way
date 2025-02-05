const translateText = require('./googleTranslate');

async function translateMiddleware(req, res, next) {
    if (!req.query.lang) {
        return next(); 
    }

    const lang = req.query.lang; 

    const originalJson = res.json;

    res.json = async function (data) {
        if (typeof data === 'object') {
            data = await translateObject(data, lang);
        }
        originalJson.call(this, data);
    };

    next();
}


async function translateObject(obj, lang) {
    if (Array.isArray(obj)) {
        return Promise.all(obj.map(item => translateObject(item, lang)));
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                newObj[key] = await translateText(obj[key], lang);
            } else {
                newObj[key] = await translateObject(obj[key], lang);
            }
        }
        return newObj;
    }
    return obj;
}

module.exports = translateMiddleware;
