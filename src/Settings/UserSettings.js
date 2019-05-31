import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Segment, Form, Button, Message, Icon, Input } from "semantic-ui-react";
import { FeaturedAvatar} from "../SharedUI/ManageContent/FeaturedAvatar";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";
import { MultipleInputFields } from "../SharedUI/MultipleInputFields.js";
import { modifyUserSettings, deactivateUser } from "../DataExchange/Up"
import { userSettingsEdit} from "../DataExchange/PayloadBuilder"
import { modifyUser } from "../DataExchange/Up"
// import _ from "lodash";
import { ConfirmDelete } from "../SharedUI/ConfirmDelete.js";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

@inject("UserStore", "DataEntryStore")
@observer
export class UserSettings extends React.Component {
  componentDidMount() {
    const { DataEntryStore, UserStore } = this.props;
    DataEntryStore.set("userSettings", "img", UserStore.user.img)
    DataEntryStore.set("userSettings", "timezone", UserStore.user.timezone)
    DataEntryStore.set("userSettings", "displayName_full", UserStore.user.displayName_full)
    DataEntryStore.set("userSettings", "displayName", UserStore.user.displayName)
    const profile = Object.keys(UserStore.user.profile)
    profile.forEach(attribute => DataEntryStore.set("userSettings", attribute, UserStore.user.profile[attribute]))
    window.scrollTo(0, 0);
    
  }
  render() {
    const { DataEntryStore, UserStore } = this.props;
    const timezones = require("../TemplateData/timezones.json")
    .map(time => ({ text: time.text, value: time.offset }))
    .reverse();

    const newLabelStatus_full = FormCharMax(DataEntryStore.userSettings.displayName_full, 32);
    const newLabelStatus = FormCharMax(DataEntryStore.userSettings.displayName, 16);
    const handleTimezone = val => {
      DataEntryStore.set("userSettings", "timezone", val);
    };
    const handleFullName = val => {
      DataEntryStore.set("userSettings", "displayName_full", val);
    };
    const handleName = val => {
      DataEntryStore.set("userSettings", "displayName", val);
    };
    const handleTitle = val =>{
      DataEntryStore.set("userSettings", "Title", val)
    }
    const profileLabels = ["Title", "Department", "Location", "Phone or Extension", "Mobile", "About Me"].map(i => ({label: i, prefix: null, value: i}))
    const socialLabels = [{"network": "Twitter", "prefix": "@"},{"network": "Medium", "prefix": "https://medium.com/@"},{"network": "Github", "prefix": "https://github.com/"}, {"network": "LinkedIn", "prefix": "https://www.linkedin.com/in/"}].map(i => ({label: i.network, prefix: i.prefix, value: i.network}))
    const multipleInputs = [...profileLabels,...socialLabels]
    

    const handleDeactivate = () => {
      deactivateUser(UserStore.user)
    }

    return (
      <div style={{ padding: 15, maxWidth: 900 }}>
        <Header
          as="h2"
          content="Your Profile Settings"
          subheader="Settings for your personal Yallhands account"
        />
            <FeaturedAvatar
            label="Avatar"
            circular
            defaultImgUrl={DataEntryStore.userSettings.img}
            uploaded={url => {
            DataEntryStore.set("userSettings", "img", url)
            modifyUser(userSettingsEdit())
          }}
        />

        <Segment>
          <div style={{ maxWidth: 400 }}>
            <Form>
            <Form.Input
                label="Full Name"
                value={DataEntryStore.userSettings.displayName_full}
                onChange={(e, val) => handleFullName(val.value)}
              >
                {" "}
                <input maxLength="32" />{" "}
              </Form.Input>
              <Form.Input
                label={<span>Display Name<InfoPopUp content="Short name or nickname"/></span>}
                value={DataEntryStore.userSettings.displayName}
                onChange={(e, val) => handleName(val.value)}
              >
                {" "}
                <input maxLength="16" />{" "}
              </Form.Input>
             
                {/* <Form.Select
                  label="Default Timezone"
                  options={timezones}
                  value={DataEntryStore.userSettings.timezone}
                  onChange={(e, { value }) => handleTimezone(value)}
                  search
                /> */}
              <Form.Input
                label={"Title"}
                value={DataEntryStore.userSettings.Title}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Title", val.value)}    
               />    
              <Form.Input
                label={"Department"}
                value={DataEntryStore.userSettings.Department}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Department", val.value)}    
               />     
             <Form.Input
                label={"Location"}
                value={DataEntryStore.userSettings.Location}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Location", val.value)}    
               />      
              <Form.Input
                label={"Phone or Extension"}
                value={DataEntryStore.userSettings["Phone or Extension"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Phone or Extension", val.value)}    
               />     
               <Form.Input
                label={"Mobile"}
                value={DataEntryStore.userSettings["Mobile"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Mobile", val.value)}    
               />      
              <Form.Input
                label={"About Me"}
                value={DataEntryStore.userSettings["About Me"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "About Me", val.value)}    
               />     

            <Form.Input label={ <span> <Icon name={"twitter"} /> {"Twitter"}{" "} </span> } > {" "}
            <Input
                label={"@"}
                value={DataEntryStore.userSettings["Twitter"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Twitter", val.value)}    
               /> 
            </Form.Input>   

            <Form.Input label={ <span> <Icon name={"medium"} /> {"Medium"}{" "} </span> } > {" "}
            <Input
                fluid
                label={"https://medium.com/@"}
                value={DataEntryStore.userSettings["Medium"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Medium", val.value)}    
               /> 
            </Form.Input>    

            <Form.Input label={ <span> <Icon name={"github"} /> {"Github"}{" "} </span> } > {" "}
            <Input
                fluid
                label={"https://github.com/"}
                value={DataEntryStore.userSettings["Github"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Github", val.value)}    
               /> 
            </Form.Input>    

            <Form.Input label={ <span> <Icon name={"linkedin"} /> {"LinkedIn"}{" "} </span> } > {" "}
            <Input
                fluid
                label={"https://linkedin.com/"}
                value={DataEntryStore.userSettings["LinkedIn"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "LinkedIn", val.value)}    
               /> 
            </Form.Input>    
<br/>
              <Button primary type="submit"
              disabled={DataEntryStore.userSettings.displayName === "" || DataEntryStore.userSettings.displayName_full === ""}
              onClick={e => modifyUser(userSettingsEdit())}
              >
                Update
              </Button>
            </Form>
            <Message error attached hidden={newLabelStatus_full.messageHide}>
              {newLabelStatus_full.message}
            </Message>
            <Message error attached hidden={newLabelStatus.messageHide}>
              {newLabelStatus.message}
            </Message>
          </div>
        </Segment>
        
        <Segment>
          <Header>Email and Security</Header>
          <Form>
          <Form.Group>
              <Form.Input
              disabled={true}
              label="Email"
              value={UserStore.user.email}
              action={"Update"}
              />
           
              </Form.Group>
              <Form.Button primary>Change Password</Form.Button>
              </Form>
        </Segment>
        
       
       {/* <Segment>
         <div style={{height: 30}}>    <ConfirmDelete deleteLabel="Deactivate" size="mini" confirm={handleDeactivate}/></div>
   
       </Segment> */}
        <div style={{height: 100}}></div>
    
  
      </div>
    );
  }
}
