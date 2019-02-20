const uniqid = require('uniqid');
export const generateID = () => {
    return uniqid().toUpperCase()
}