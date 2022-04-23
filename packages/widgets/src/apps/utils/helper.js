export const isEmpty = (obj) => !(obj ? Object.keys(obj).length : false);
export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}