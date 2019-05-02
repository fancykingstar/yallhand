import {UserStore} from "../Stores/UserStore"
const timezones = require("../TemplateData/timezones.json")


export const getTimeZone = () => timezones.filter(tz => tz.offset === UserStore.user.timezone)[0]
