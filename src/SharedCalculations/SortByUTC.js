export const sortByUTC = (all, direction) => {
    if(direction === "Oldest") {
    return all.slice().sort((a,b) => (a.updated > b.updated)? 1 : -1)
    }
    else {
        return all.slice().sort((a,b) => (a.updated < b.updated)? 1 : -1)
        }
}