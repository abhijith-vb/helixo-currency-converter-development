import renderApps from './registerRenderFunction';

/**
 * Register the buckscc window object
 */
export default function() {
    window.buckscc = window.buckscc || {};
    window.buckscc.apps = window.buckscc.apps || {};
    window.buckscc.state = window.buckscc.state || {};
    // Register render apps function
    window.buckscc.renderApps = window.buckscc.renderApps || renderApps;
    // Normalize buckscc hooks object
    window.buckscc.hooks = window.buckscc.hooks || {};
}
