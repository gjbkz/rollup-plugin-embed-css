const data = {};
export const set = (...patches) => {
    Object.assign(data, ...patches);
    document.body.textContent = JSON.stringify(data, null, 2);
};
