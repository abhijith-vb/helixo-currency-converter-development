exports.cleanDomain = domain => domain.replace('.myshopify.com', '');
exports.getShopifyDomain = domain => `${domain}.myshopify.com`;
exports.isEmpty = obj => !(obj ? Object.keys(obj).length : false);
