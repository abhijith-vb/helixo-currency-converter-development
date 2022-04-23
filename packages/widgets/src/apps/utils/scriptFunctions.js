export default function(url, type, loaded) {
    const element = document.createElement(type);
    if (type === 'script') {
        element.src = url;
        element.type = 'text/javascript';
    }
    element.onload = function() {
        loaded();
    };
    document.getElementsByTagName('head')[0].appendChild(element);
}
