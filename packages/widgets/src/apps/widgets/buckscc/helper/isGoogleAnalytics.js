import getUrlParams from '../../../utils/getUrlParams';

const GoogleBotUserAgent = () => {
    const ua = window && window.navigator && window.navigator.userAgent;

    const googleAdsuserAgents = [
        'Mediapartners-Google',
        'AdsBot-Google-Mobile',
        'AdsBot-Google-Mobile',
        'AdsBot-Google',
        'AdsBot-Google-Mobile-Apps'
    ];
    if (googleAdsuserAgents.some(AdsUserAgent => ua.includes(AdsUserAgent))) {
        console.log('GoogleAds User Agent Found');
        return true;
    }
    return false;
};
const isGoogleAds = () => {
    const dfwTracker = getUrlParams('dfw_tracker');
    const utmSource = getUrlParams('utm_source');

    if (
        dfwTracker == null &&
        (utmSource == null || (utmSource !== 'googleshopping' && utmSource !== 'google')) &&
        !GoogleBotUserAgent()
    ) {
        return false;
    }
    console.log('GoogleAds Found');
    return true;
};
export default isGoogleAds;
