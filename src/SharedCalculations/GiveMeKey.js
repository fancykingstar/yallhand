const uniqid = require('uniqid');
export const giveMeKey = () => {
    return Date.now().toString(16) + uniqid()
}