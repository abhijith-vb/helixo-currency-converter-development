const getUrlParams = name => {
    const url = new URLSearchParams(window.location.search);
    return url.get(name);
};
export default getUrlParams;
