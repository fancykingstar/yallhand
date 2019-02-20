export const StdInputValidation = (str, arry, allowStr=null) => {
  const strFormatted = str.trim().toLowerCase();
  let arrayFormatted = arry
    .map(item => item.toLowerCase())
  arrayFormatted = allowStr !== null ? arrayFormatted.filter(item => item !== allowStr) : arrayFormatted
  const valid = !arrayFormatted.includes(strFormatted);
//   console.log("str", strFormatted, "arry", arrayFormatted, "valid", !arrayFormatted.includes(strFormatted))
  return { string: strFormatted, valid: valid };
};
