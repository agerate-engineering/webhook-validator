const crypto = require('crypto');
const safeCompare = require('safe-compare');

const ValidateWebhook = async (request, secret, algorithm = 'sha256', encoding = 'utf8', hmacHeader = 'X-Shopify-Hmac-Sha256') => {
    console.debug(`validating incoming webhook.`);
    const hmacHeader = request.get(hmacHeader);
    const body = request.rawBody;
    const generatedHash = crypto
        .createHmac(algorithm, secret)
        .update(body, encoding)
        .digest('base64');
    if (!safeCompare(generatedHash, hmacHeader)) {
        const ip = request.ip;
        const userAgent = request.get('User-Agent');
        throw new Error(`generated hash !== match hmac header, ${ip} : ${userAgent}`);
    }
}

export default ValidateWebhook;