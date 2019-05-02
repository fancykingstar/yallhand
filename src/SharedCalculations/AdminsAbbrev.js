export const adminsAbrev = (admins) => {
    let firstfew = admins.slice(0,3)
    firstfew.push("...")
    return firstfew
}