import moment from "moment"

function UTCtoFriendly(val, adjustment) {
    const time = moment.utc(val).utcOffset(adjustment * 60)
    return (time.format('MMMM Do YYYY, h:mm a'))
}

export default UTCtoFriendly