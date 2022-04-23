/**
 * This is a helper module that containts useful functions
 */

export const appendApp = (position, newContent) => {
    const element = document.querySelector(position);
    element.innerHtml += newContent;
};
/* Check if an object is empty */
export const isEmpty = (obj) =>
    obj === undefined ||
    obj === null ||
    obj === NaN ||
    (typeof obj === 'object' && Object.keys(obj).length === 0) ||
    (typeof obj === 'string' && obj.trim().length === 0);