export const getDefaultUserImg = (ID) => {
    const base = "https://s3.amazonaws.com/quadrance-files/central/"
    const filename = (val) => `default-user${val}.png`
    const stringConvert = (str) => {
        const numb = str.charCodeAt(0)
        let arry = numb.toString().split('')
        return Number(arry[1])
    }

    
    const key = {0: 0, 1:0, 2:1, 3:1, 4:2, 5:2, 6:3, 7:3, 8:4, 9:4,}
    return base + filename(key[stringConvert(ID.slice(-1))])
} 