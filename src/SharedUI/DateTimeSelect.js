import React from "react";
import {inject, observer} from "mobx-react"
import DateTime from 'react-datetime'
import './DateTime.css'
import moment from "moment"

@inject("UIStore")
@observer
export class DateTimeSelect extends React.Component { 
  constructor(props){
    super(props)
    const now = moment()
    const remainder = 15 - (now.minute() % 15);

    this.state = {
      currentDate:  moment(now).add(remainder, "minutes"),
      toggled: false,
      // moment(now).add(remainder, "minutes")
    }
  }
  
  validTimeConstraints () {
    const {currentDate} = this.state.currentDate
    if (typeof(currentDate) === "number") this.setState({currentDate: moment(this.state.currentDate)});
    if(currentDate && this.state.currentmoment().isSame(currentDate, 'day')) {
      return {
        hours: {
          min: this.state.currentDate.hours(),
          max: 23,
          step: 1,
        },
        minutes: {
          min: this.state.currentDate.minutes(),
          max: 59,
          step: 5,
        },
      };
    }
    return {
      hours: { min: 1, max: 23, step: 1 }, 
      minutes: {min: 0, max: 59, step: 15}
    }
  }

  updateDate(newDateTime) {
    this.setState({
      currentDate: newDateTime,
      toggled: true
    })
    this.props.value(newDateTime.valueOf())
  }

  static getDerivedStateFromProps(props, state) { 
    if(props.defaultValue) return { currentDate: props.defaultValue }
    return null
 }  


  render() {
    const yesterday = moment().subtract( 1, 'day' );
    const validDates = ( current )=> current.isAfter( this.props.notToday === undefined? yesterday: moment() );

    return ( 
        <React.Fragment>
          <DateTime 
          isValidDate={validDates}
          timeConstraints={this.validTimeConstraints()}
          inputProps={{ value: this.state.toggled ? moment(this.state.currentDate).format('MMMM Do YYYY, h:mm a'): "Choose date and time"  }}
          value={this.state.currentDate}
          onChange={e => this.updateDate(e)}
          />
      </React.Fragment>
    );
  }
}
