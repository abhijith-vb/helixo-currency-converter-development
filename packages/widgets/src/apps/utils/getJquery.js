import loadScript from './scriptFunctions';

export default new Promise((resolve, reject) => {
    // Checking if the jQuery is available in Checkout object of thankyou page
    const jQObj = window.Checkout && window.Checkout.jQuery;
    if (
        (typeof jQuery !== 'undefined' && typeof jQuery.ajax === 'function' && jQuery.fn.jquery.localeCompare("1.7", undefined, { numeric: true, sensitivity: 'base' }) ===1   ) ||
        (typeof jQObj !== 'undefined' && typeof jQObj.ajax === 'function' &&  jQObj.fn.jquery.localeCompare("1.7", undefined, { numeric: true, sensitivity: 'base' }) ===1 )
    )
        resolve(jQObj || jQuery);
    
    else
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js', 'script', function () {
            resolve(jQuery.noConflict());
        });
});
