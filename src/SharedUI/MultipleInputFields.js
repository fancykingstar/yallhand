import React from "react";
import { inject, observer } from "mobx-react";
import { Form, Icon, Input } from "semantic-ui-react";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";


@inject("UserStore", "DataEntryStore")
@observer
export class MultipleInputFields extends React.Component {
  render() {
    const {DataEntryStore} = this.props
         
    return (

    <React.Fragment key = {"multipleInptsFragements" + giveMeKey()}>
           <Form.Input
          label={"Title"}
          value={DataEntryStore.userSettings.Title}
          onChange={(e, val) => DataEntryStore.set("userSettings", "Title", val.value) }
        />
    
      </React.Fragment>
    );
  }
}
