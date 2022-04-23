const loc = window.location.href;
export const isThankyouPage = !!(loc.indexOf('/checkouts/') !== -1 && loc.indexOf('/thank_you') !== -1);
export const isOrderPage = !!(loc.indexOf('/orders/') !== -1);
export const isBucksAdminPage = !!(loc.indexOf('buckscc.helixo.co') !== -1);
