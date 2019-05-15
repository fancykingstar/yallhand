import React from "react";
import {inject, observer} from "mobx-react"
import { times, alltimes, adjustedTime } from "../TemplateData/times";
import { Form } from "semantic-ui-react";
import { DatePicker } from "../SharedUI/DatePicker";
import moment from "moment"

@inject("UIStore")
@observer
export class DateTimeSelect extends React.Component {

  componentDidMount() {
    const {UIStore} = this.props
    UIStore.set("dateTimeSelect", "date", "")
    UIStore.set("dateTimeSelect", "time", "00:00")
    this.props.value(0)
  }

  render() {
      const {UIStore} = this.props
      const updateValue = () => {
        if(UIStore.dateTimeSelect.date !== 0){
        const dateTime = UIStore.dateTimeSelect.date.slice(0,10) +' '+ UIStore.dateTimeSelect.time
        this.props.value(moment(dateTime).valueOf())
      }}

      const handleDate = (val) => {
        UIStore.set("dateTimeSelect", "date", val)
        updateValue()
      }
      const handleTime = (val) => {
        console.log(UIStore.dateTimeSelect.date === ""? false: moment(UIStore.dateTimeSelect.date).isSame(new Date(), "day"))
        UIStore.set("dateTimeSelect", "time", val)
        updateValue()
      }
      
    
    return ( 
        <React.Fragment>
  
          <Form.Input label="Choose Date">
            <DatePicker
              from={"today"}
              readOnly={true}
              output={val => handleDate(val)}
            />
          </Form.Input>
          <Form.Select
            label="Choose Time"
            options={UIStore.dateTimeSelect.date === ""? [] : moment(UIStore.dateTimeSelect.date).isSame(new Date(), "day")? alltimes : times}
            defaultValue="00:00"
            onChange={(e, val) => handleTime(val.value)}
          />

      </React.Fragment>
    );
  }
}
