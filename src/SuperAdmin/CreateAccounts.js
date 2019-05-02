import React from "react"
import {inject, observer} from "mobx-react"
import {Header, Segment, Form, Button} from "semantic-ui-react"
import {FeaturedAvatar} from "../SharedUI/ManageContent/FeaturedAvatar"
import {periods} from "../TemplateData/periods"
import { createAccount } from "../DataExchange/Up";
import { account } from "../DataExchange/PayloadBuilder"
import { api_get } from "./Down"
const timezones = require("../TemplateData/timezones.json")

@inject("DataEntryStore")
@observer
export class CreateAccounts extends React.Component {
render(){
    const {DataEntryStore} = this.props

    const handleSubmit = () => {
      createAccount(account()).then(() =>
      api_get("accounts/all")
      .then((response) => {
        DataEntryStore.set("superAdmin", "allAccounts", response.data)
      })
      .catch((error) => {
        console.log(error);
      })
      )

    }

    return(
        <div>
            <Header inverted floated="left">Create Account</Header>
            <br/>
            <FeaturedAvatar
          inverted
          label="Company Logo"
          defaultImgUrl={DataEntryStore.superAdmin.accountImg}
          uploaded={url => {
          DataEntryStore.set("superAdmin", "accountImg", url)
          }}
        />
            <Segment inverted>
          <div style={{ width: 400 }}>
          
            <Form inverted onSubmit={e => handleSubmit()}>
           
              <Form.Input
                label="Company Name"
                value={DataEntryStore.superAdmin.accountLabel}
                onChange={(e, val) => DataEntryStore.set("superAdmin", "accountLabel", val.value)}
              >
                {" "}
                <input maxLength="24" />{" "}
              </Form.Input>
                      
                
              <Form.Field>
                <Form.Select
                  label="Default Timezone"
                  options={timezones}
                  value={DataEntryStore.superAdmin.accountTimezone}
                  onChange={(e, { value }) => DataEntryStore.set("superAdmin", "accountTimezone", value)}
                  search
                />
              </Form.Field>
              <Form.Select
                label="Default Review Alert For Aging Content"
                style={{ width: 150 }}
                options={periods}
                onChange={(e, { value }) => DataEntryStore.set("superAdmin", "accountReviewAlert", value)}
                value={DataEntryStore.superAdmin.accountReviewAlert}
              />
                <Form.Input
                label="General Query Email Address"
                value={DataEntryStore.superAdmin.accountEmail}
                onChange={(e, val) => DataEntryStore.set("superAdmin", "accountEmail", val.value)}
              >
                {" "}
                <input maxLength="48" />{" "}
              </Form.Input>

              <Button inverted 
                type="submit"
              >
                Create
              </Button>
            </Form>
          </div>
        </Segment>
  
        
        
       
           


        </div>
    )
}
}