import React from "react";
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Star from "@material-ui/icons/Star";

export const iconKey = {
    Star: <Star/>,
    AcUnitIcon: <AcUnitIcon/>,
    AccessAlarmIcon: < AccessAlarmIcon/>
}

export const iconOptions =  [{
    value: 'AcUnitIcon',
    image: <AcUnitIcon/>
  },
  {value: 'Star',
  image: <Star />
  },
  {
   value: 'AccessAlarmIcon',
   image:  < AccessAlarmIcon/>,
  }]

