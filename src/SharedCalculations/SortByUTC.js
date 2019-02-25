export const sortByUTC = (all, direction) => {
    if(direction === "Oldest") {
    return all.sort((a,b) => (a.updated > b.updated)? 1 : -1)
    }
    else {
        return all.sort((a,b) => (a.updated < b.updated)? 1 : -1)
        }
}