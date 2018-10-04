import moment from "moment"

function UTCtoFriendly(val) {
    const time = moment.unix(val)
    return (time.format('MMMM Do YYYY, h:mm a'))
}

export default UTCtoFriendly