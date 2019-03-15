import {UserStore} from "../Stores/UserStore"
const moment = require('moment-timezone');

const preferredTZ = {
  "-4": "America/New_York",
  "-5":"America/Chicago",
  "-6":"America/Denver",
  "-8":"America/Los_Angeles"
}

const UTCtoFriendly = (val, adjustment) => {
  const useTZ = preferredTZ[String(UserStore.user !== null && UserStore.user.timezone? UserStore.user.timezone: -4)]
  const time = moment.utc(val).tz(useTZ).format('MMMM Do YYYY, h:mm a')
  return time
}

export default UTCtoFriendly