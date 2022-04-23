import registerGlobals from './registerGlobals';

export const useState = (widget, value) => {
    registerGlobals();
    function updateStateFn(val) {
        window.buckscc.state[widget][value];
    }
    window.buckscc.state[app];
    return [value, updateStateFn];
};
