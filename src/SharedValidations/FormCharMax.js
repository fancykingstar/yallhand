export const FormCharMax = (val, max) => 
    val.length >= max ? {status: true, message:`Maximum charecter count: ${max}`, messageHide: false}: {status: false, message: null, messageHide: true}
