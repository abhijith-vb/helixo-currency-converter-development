import { getIt } from './getIt';

export const registerHook = (name, func) => {
    const hooks = getIt(window, 'buckscc.hooks', {});
    if (!hooks[name]) hooks[name] = [];
    hooks[name].push(func);
};

export const callHook = (name, ...params) => {
    const hooks = getIt(window, 'buckscc.hooks', {});
    if (hooks[name]) hooks[name].forEach(func => func(...params));
};
