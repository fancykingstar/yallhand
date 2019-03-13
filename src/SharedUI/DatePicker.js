import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import 'react-day-picker/lib/style.css';
import {formatDate,parseDate,} from 'react-day-picker/moment';
import { today, tomorrow } from "../SharedCalculations/GetDates";
import { UserStore } from "../Stores/UserStore"
import moment from "moment"

export const DatePicker = (props) => {
        const startingDate = {
            "today": today,
            "tomorrow": tomorrow
        }
       const dayChange = (day) => {
        const date = moment.utc(day).format()
        //Couldn't get React Day Picker to Enforce Init of Moment objects in UTC time as it binds to local time
        const adjusted = moment.utc(`${date.substring(0, 10)}T00:00:00Z`)
        //Adjusting for USERS preferred timezone
        const delta = moment.duration(Math.abs(UserStore.user.timezone), 'hours')
        props.output(adjusted.add(delta).format())
        }
        return(
          <div onKeyPress={(e)=> e.preventDefault()}>
            <DayPickerInput
            dayPickerProps={{ disabledDays: { before: startingDate[props.from] } }}
            format="M/D/YYYY"
            formatDate={formatDate}
            parseDate={parseDate}
            placeholder="MM/DD/YYYY"
            onDayChange={val => dayChange(val)}
          />
          </div>
        )
    }
