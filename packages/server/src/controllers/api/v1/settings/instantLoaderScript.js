const getMinifiedInstantLoaderScript = require('./getMinifiedInstantLoaderScript');

const instantLoaderScript = (domain, myshopify_domain) => {
    // Minified script that will be added to theme
    let MINIFIED_SCRIPT = '';

    // Fetch 500bytes polyfill
    const FETCH_POLYFILL =
        'self.fetch||(self.fetch=function(e,n){return n=n||{},new Promise(function(t,s){var r=new XMLHttpRequest,o=[],u=[],i={},a=function(){return{ok:2==(r.status/100|0),statusText:r.statusText,status:r.status,url:r.responseURL,text:function(){return Promise.resolve(r.responseText)},json:function(){return Promise.resolve(JSON.parse(r.responseText))},blob:function(){return Promise.resolve(new Blob([r.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var c in r.open(n.method||"get",e,!0),r.onload=function(){r.getAllResponseHeaders().replace(/^(.*?):[^S\\n]*([sS]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t}),t(a())},r.onerror=s,r.withCredentials="include"==n.credentials,n.headers)r.setRequestHeader(c,n.headers[c]);r.send(n.body||null)})});';

    // Conversion flickering fix script
    // const CONVERSION_FLICKERING_FIX_SCRIPT =
    //     "const a=['createElement','span.money{color:\x20inherit\x20!important}','style','innerText','span.money{color:\x20transparent;}','head'];(function(b,e){const f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x18a));const b=function(c,d){c=c-0x0;let e=a[c];return e;};function appendStyle(c){const d=document[b('0x2')](b('0x4'));d[b('0x5')]=c;document[b('0x1')]['appendChild'](d);}appendStyle(b('0x0'));setTimeout(function(){appendStyle(b('0x3'));},0x5dc);";

    // Fetch polyfill
    MINIFIED_SCRIPT += `${FETCH_POLYFILL}`;

    // Instant loader script
    MINIFIED_SCRIPT += getMinifiedInstantLoaderScript(domain, myshopify_domain);

    // Add Conversion flickering fix script to the script to be injected
    // MINIFIED_SCRIPT += CONVERSION_FLICKERING_FIX_SCRIPT;
    // if (fixConversionFlickering) MINIFIED_SCRIPT += CONVERSION_FLICKERING_FIX_SCRIPT;
    return MINIFIED_SCRIPT;
};
module.exports = instantLoaderScript;

/**
 * UNMINIFIED VERSION OF SCRIPT
 */
/*  // Inject script to theme
    const CONVERSION_FLICKERING_FIX_SCRIPT_SOURCE = `
    // Hide span.money until convertion takes place
        // function appendStyle(content) {
        //     const style = document.createElement('style');
        //     style.innerText = content;
        //     document.head.appendChild(style);
        // }
        // appendStyle('span.money{color: transparent;}');
        // setTimeout(function(){
        //     appendStyle('span.money{color: inherit !important}')
        // }, 1500);
    `;
    let additionalScriptsToBeInjected = FETCH_POLYFILL;

    //////////////////////////////////////////////////
    additionalScriptsToBeInjected += `

        (function(){
            function appendStyle(content) {
            const style = document.createElement('style');
            style.innerText = content;
            document.head.appendChild(style);
        }
        appendStyle('span.money{color: transparent;}');
        setTimeout(function(){
            appendStyle('span.money{color: inherit !important}')
        }, 1500);
        function appendScript(content) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = content;
        document.head.appendChild(script);
        console.log("%cBUCKSCC: Instant Loader Activated ⚡️", "background: #1c64f6; color: #fff; font-size: 12px; font-weight:bold; padding: 5px 10px; border-radius: 3px");
        }

        let localScript = sessionStorage.getItem('bucksccHash');
        localScript = localScript ? JSON.parse(localScript) : null;
        if (!localScript) {
        fetch('https://${domain}/apps/buckscc/sdk.min.js', { mode: 'no-cors' })
            .then(function(response) {
                return response.text();
            })
            .then(function(content) {
                // Inject only if the script length is greater than 100
                if ((content || '').length > 100) {
                    const hashedScript = JSON.stringify(content);
                    sessionStorage.setItem('bucksccHash', hashedScript);
                    localScript = content;
                    appendScript(content);
                }
            });
        } else appendScript(localScript);
    })()
        `;
        ////////////////////////////////////////////////////////////

        */

/**
 * BASE64 CONVERSION IF NEEDED
 * const BASE64CONVERTED = Buffer.from(additionalScriptsToBeInjected).toString('base64');
 * const ENCODED_SCRIPT = `eval(atob('${BASE64CONVERTED}'))`;
 */
