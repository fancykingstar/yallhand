export const FormCharMax = (val, max) => 
{
    let localVal = val
    if(localVal === null) {localVal = ""}
    return (localVal.length >= max ? {status: true, message:`Maximum charecter count: ${max}`, messageHide: false} : {status: false, message: null, messageHide: true})
}