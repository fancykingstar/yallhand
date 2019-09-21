export const arrayIndexUpOrDown = (arry, i, direction) => {
    let position = i;
    let val = JSON.stringify(arry[i]);
    if (arry.length === 0 || arry.length === 1) {
      return arry;
    } else if (direction === "up" && JSON.stringify(arry[0]) === val) {
      return arry;
    } else if (direction !== "up" && JSON.stringify(arry[arry.length - 1] === val)) {
      return arry;
    } else {
      if (arry.length === 2) {
        return arry.slice().reverse();
      } else {
        let newArry = arry.slice();
        if (direction === "up") {
          newArry[position - 1] = val;
          newArry[position] = arry[position - 1];
        } else {
          newArry[position + 1] = val;
          newArry[position] = arry[position + 1];
        }
        return newArry;
      }
    }
  };
  