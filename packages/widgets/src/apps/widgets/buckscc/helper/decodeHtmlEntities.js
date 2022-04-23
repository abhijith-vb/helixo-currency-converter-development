const decodeEntities = s => {
    let temp = document.createElement('p');
    temp.innerHTML = s;
    const str = temp.textContent || temp.innerText;
    temp = null;
    return str;
};
export default decodeEntities;
