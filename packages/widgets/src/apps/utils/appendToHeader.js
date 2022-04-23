// import JQ from '../utils/getJquery';

const appendItem = {
    js: customJs => {
        hxo$('<script>')
            .text(customJs)
            .appendTo('head');
    },
    css: customCss => {
        hxo$('<style>')
            .text(customCss)
            .appendTo('head');
    }
};
export default appendItem;
