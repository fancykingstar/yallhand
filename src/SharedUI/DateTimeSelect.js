import React from "react";
import {inject, observer} from "mobx-react"
import { times, adjustedTime } from "../TemplateData/times";
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
  }

  render() {
      const {UIStore} = this.props
      const updateValue = () => {
        const dateTime = UIStore.dateTimeSelect.date.slice(0,10) +' '+ UIStore.dateTimeSelect.time
        this.props.value(moment(dateTime).valueOf())
        console.log(moment(dateTime).valueOf())
          }

      const handleDate = (val) => {
        UIStore.set("dateTimeSelect", "date", val)
        updateValue()
      }
      const handleTime = (val) => {
        UIStore.set("dateTimeSelect", "time", val)
        updateValue()
      }
      
    
    return ( 
        <React.Fragment>
  
          <Form.Input label="Choose Date">
            <DatePicker
              from={"tomorrow"}
              output={val => handleDate(val)}
            />
          </Form.Input>
          <Form.Select
            label="Choose Time"
            options={times}
            defaultValue="00:00"
            onChange={(e, val) => handleTime(val.value)}
          />

      </React.Fragment>
    );
  }
}
