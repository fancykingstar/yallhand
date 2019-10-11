export const ValidObjKeysOnly = (obj) => {
    const keys = Object.keys(obj);
    const newObj = Object.assign({}, obj);
    keys.forEach(i=> {
        if(i[0]==="_") delete newObj.i
    });
    return newObj
}