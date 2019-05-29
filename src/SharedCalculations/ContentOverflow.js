export const contentOverflow = function ellipsis(str, limit) {
    if (str.length <= limit) return str;
    else {
        const shortend =  str.replace(/<.*?>/g, '').split(/[!?\.<>()*]/g)[0]
        return `${shortend.length <= limit? shortend : 
            str.replace(/<.*?>/g, '').slice(0, limit)
  }…`;
    }
   
  };