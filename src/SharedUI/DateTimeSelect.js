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
    const now = moment();
    const remainder = 15 - (now.minute() % 15);
    const dateTime = moment(now).add(remainder, "minutes");
    const start = this.props.notToday === undefined? dateTime: dateTime.add(1, 'day');
    this.state={current: this.props.includeTime !== undefined? start:start.startOf('day')};
    this.props.value(this.state.current.valueOf());
  }
 
  render() {
      
   const yesterday = moment().subtract( 1, 'day' );
    const validDates = ( current )=> current.isAfter( this.props.notToday === undefined? yesterday: moment() );
    const validTimes = () => 
      // this.state.current.isSame(new Date(), "day")? {hours:{min: moment().format('H')},minutes: {step: 5}}:
      ({minutes: {step: 15}})
  
    return ( 
        <React.Fragment>
          <DateTime 
          isValidDate={validDates}
          timeConstraints={validTimes()}
          timeFormat={this.props.includeTime !== undefined}
          defaultValue={this.state.current}
          onChange={e => {
            const newDate = e.isSame(new Date(), "day")? moment():e
            this.setState({current: newDate})
            this.props.value(moment.utc(newDate).valueOf())
          }}
          />

      </React.Fragment>
    );
  }
}
