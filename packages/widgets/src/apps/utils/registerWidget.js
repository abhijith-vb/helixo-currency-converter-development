/**
 * Register the widget to window object
 */
import registerGlobals from './registerGlobals';

export default function(widgetName, widgetFunction) {
    registerGlobals();
    window.buckscc.apps[widgetName] = widgetFunction;
    window.buckscc.state[widgetName] = {};
}
