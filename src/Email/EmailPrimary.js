import React from "react";
import {inject, observer} from "mobx-react"
import { Segment, Header, Menu, Form, Icon, Button, Checkbox } from "semantic-ui-react";
import { ChooseTargeting } from "./ChooseTargeting";
import { BundleContent } from "../SharedUI/Bundle/BundleContent";
import { ContentSearch } from "../SharedUI/ContentSearch";
import { DraftFormField } from "../SharedUI/DraftFormField";
import _ from "lodash";


@inject("DataEntryStore", "EmailStore", "UIStore")
@observer
export class EmailPrimary extends React.Component {
  render() {
      const {DataEntryStore, EmailStore, UIStore} = this.props
    return (
      <div style={{maxWidth: 650}}>
          <Header as="h2">
          Send Email
          <Header.Subheader>
            Configure and send emails to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <div style={{ minWidth: 400 }}> <ChooseTargeting /> </div>
          <div style={{ paddingTop: 10, paddingBottom: 10}}>
          <Form>
          <Form.Input
                label="Email Subject (Required)"
                // value={DataEntryStore.emailCampaign.queueSubject}
                // onChange={(e, val) =>
                //   DataEntryStore.set("emailCampaign", "queueSubject", val.value)
                // }
              />
            </Form>
          </div>
        
          <span style={{fontWeight: 800, fontSize: ".9em"}}>What should the email body contain?</span><br/>
            <Menu compact size="tiny">
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "message"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "message")}> Custom Message Only </Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "messagecontent"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "messagecontent")}> Custom Message + Selected Content </Menu.Item>
            <Menu.Item as='a' active={UIStore.menuItem.sendEmailBody === "content"} onClick={e => UIStore.set("menuItem", "sendEmailBody", "content")}> Selected Content Only </Menu.Item>
          </Menu>
          
          <div style={UIStore.menuItem.sendEmailBody === "content"? {display: "none"}:{display:"contents"} }>
          <div style={{ maxWidth: 520, paddingTop: 20, paddingBottom: 20 }}>        <div>
            <span style={{fontWeight: 800, fontSize: ".9em"}}>Custom Message</span>
                <DraftFormField 
                  loadContent={_.isEmpty(EmailStore.queue.bodyContentRAW)? null : EmailStore.queue.bodyContentRAW}
                />
            </div></div>
          </div>
         

          <div style={UIStore.menuItem.sendEmailBody === "message"? {display: "none"}:{display:"contents"} }>
        <div style={{paddingTop: 20}}>
            <ContentSearch/>
            </div>
          <div style={{ maxWidth: 500, paddingTop: 5 }}>    <BundleContent input={[]} /> </div>
        </div>
         
        <br/>
        <div style={{paddingBottom: 5}}>
        <Checkbox label="Use as template in the future"/>
        </div>
      
        <Button
            icon
            primary
            labelPosition="left"
            // onClick={e => {
            //   createCampaign(emailCampaign(true)).then(() => UIStore.set("menuItem", "emailFrame", "outbound"))
            // }}
          >
          
            <Icon name="send" /> Send Now
          </Button>
          <Button
          onClick={e => UIStore.set("menuItem", "emailFrame", "send options")}
          >
          
            Preview & Options...
          </Button>
          <div style={{float: "right"}}>
          <Button
          >
          
            Clear All
          </Button>
          </div>
       
       
        </Segment>
        <br/>

      </div>
    );
  }
}
