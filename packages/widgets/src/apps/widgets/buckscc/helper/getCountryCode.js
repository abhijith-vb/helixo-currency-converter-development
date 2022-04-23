import geoUrl from './geo';

export default function getCountryCode() {
    return fetch('/browsing_context_suggestions.json');
}

export function getCountryApi() {
    return new Promise((resolve, reject) => {
        hxo$.ajax({
            url: geoUrl,
            // jsonpCallback: "callback",
            dataType: 'json',
            success(t) {
                resolve(t.currency);
            }
        });
    });
}
