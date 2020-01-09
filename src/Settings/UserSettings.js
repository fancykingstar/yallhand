import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Segment, Form, Button, Message, Icon, Input } from "semantic-ui-react";
import { FeaturedAvatar} from "../SharedUI/ManageContent/FeaturedAvatar";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { InfoPopUp } from "../SharedUI/InfoPopUp.js";
import { userSettingsEdit} from "../DataExchange/PayloadBuilder";
import { modifyUser } from "../DataExchange/Up";
import { apiCall }from "../DataExchange/Fetch";
import toast from '../YallToast';


@inject("UserStore", "DataEntryStore")
@observer
export class UserSettings extends React.Component {
  constructor(props){
    super(props);
    this.state={pwd1: "", pwd2: "", changePassword: false, errorMsg:"",  }
  }
  componentDidMount() {
    const { DataEntryStore, UserStore } = this.props;
    DataEntryStore.set("userSettings", "img", UserStore.user.img)
    DataEntryStore.set("userSettings", "timezone", UserStore.user.timezone)
    DataEntryStore.set("userSettings", "dob", UserStore.user.dob)
    DataEntryStore.set("userSettings", "displayName_full", UserStore.user.displayName_full)
    DataEntryStore.set("userSettings", "displayName", UserStore.user.displayName)
    const profile = Object.keys(UserStore.user.profile)
    profile.forEach(attribute => DataEntryStore.set("userSettings", attribute, UserStore.user.profile[attribute]))
    window.scrollTo(0, 0);
    
  }

  isInvalidPassword (value) {
    return !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(String(value)))
  }

  isPasswordNotEqual () {
    return this.state.pwd1 !== this.state.pwd2
  }

  async validatePwd () {
    const {UserStore} = this.props;
    const { pwd1, pwd2 } = this.state
    if (this.isInvalidPassword(pwd1)) return this.setState({errorMsg: 'New password must contains 8 characters with 1 upper, 1 lower, 1 number and 1 special character'});
    if (this.isPasswordNotEqual(pwd2)) return this.setState({errorMsg: 'Confirm new password is not equal to New password'});
    await apiCall(`/users/reset`, 'POST', {password: pwd1, email:UserStore.user.email}).then((res) => res.json()).then(res => {
      const { history } = this.props;
      if (res.ko) return this.setState({errorMsg: 'Your email or validation code is wrong'});
      this.setState({errorMsg: null, changePassword: false});
      toast.success("Your password has been changed", {hideProgressBar: true, closeOnClick: false}) 
      
    })
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


    return (
      <div style={{ padding: 15}}>
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
                <input maxLength="32" />{" "} </Form.Input>
             
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
               >     <input maxLength="32" />{" "} </Form.Input>
              <Form.Input
                icon="building"
                label={"Department"}
                value={DataEntryStore.userSettings.Department}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Department", val.value)}
                maxLength="32"
               />
             <Form.Input
                icon="map marker alternate"
                label={"Location"}
                value={DataEntryStore.userSettings.Location}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Location", val.value)}
                maxLength="32"
               />
              <Form.Input icon="phone"
                type="number"
                maxLength="13"
                label={"Phone or Extension"}
                value={DataEntryStore.userSettings["Phone or Extension"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Phone or Extension", val.value)}    
               />
               <Form.Input icon="mobile alternate"
                type="number"
                maxLength="13"
                label={"Mobile"}
                value={DataEntryStore.userSettings["Mobile"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Mobile", val.value)}    
               />
            <Form.Input icon="birthday cake"
              type="date"
              label="Birthday"
              value={DataEntryStore.userSettings.dob}
              onChange={(e) => DataEntryStore.set("userSettings", "dob", e.target.value)}    />
              <Form.TextArea
                label={"About Me"}
                value={DataEntryStore.userSettings["About Me"]}
                onChange={(e, {value}) => DataEntryStore.set("userSettings", "About Me", value.split("\n").join("")) }
                > <input maxLength="256" />{" "} </Form.TextArea>     
            <Form.Input label={ <span> <Icon name={"twitter"} /> {"Twitter"}{" "} </span> } > {" "}
            <Input
                label={"@"}
                maxLength="32"
                value={DataEntryStore.userSettings["Twitter"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Twitter", val.value)}    
               /> 
            </Form.Input>   

            <Form.Input label={ <span> <Icon name={"medium"} /> {"Medium"}{" "} </span> } > {" "}
            <Input
                fluid
                maxLength="62"
                label={"https://medium.com/@"}
                value={DataEntryStore.userSettings["Medium"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Medium", val.value)}    
               /> 
            </Form.Input>    

            <Form.Input label={ <span> <Icon name={"github"} /> {"Github"}{" "} </span> } > {" "}
            <Input
                fluid
                maxLength="62"
                label={"https://github.com/"}
                value={DataEntryStore.userSettings["Github"]}
                onChange={(e, val) => DataEntryStore.set("userSettings", "Github", val.value)}    
               /> 
            </Form.Input>    

            <Form.Input label={ <span> <Icon name={"linkedin"} /> {"LinkedIn"}{" "} </span> } > {" "}
            <Input
                fluid
                maxLength="62"
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
          {!this.state.changePassword?
          <Form>
          <Form.Group>
              <Form.Input
              disabled={true}
              label="Email"
              value={UserStore.user.email}
              action={"Update"}
              />
           
              </Form.Group>
              <Form.Button primary onClick={()=>this.setState({changePassword: true})}>Change Password</Form.Button>
              </Form>
          :
          <>
            <Form>
              <Form.Group>
              <Form.Input icon="key" type="password"  label="New password" onChange={(e) => this.setState({pwd1: e.target.value})}/>
              <Form.Input icon="key" type="password"  label="Confirm new password" onChange={(e) => this.setState({pwd2: e.target.value})}/>
          
              </Form.Group>
              <Button primary size="small"  onClick={e =>  this.validatePwd() }>Submit</Button>
              <Button  size="small"  onClick={e =>  this.setState({pwd1:"", pwd2:"", changePassword: false}) }>Cancel</Button>
            </Form>
            {this.state.errorMsg && <div style={{maxWidth: 350, paddingTop: 10}}><Message icon="warning" content={this.state.errorMsg} negative/></div>}
          </>
          }
        </Segment>
        
        <div style={{height: 100}}></div>
    
  
      </div>
    );
  }
}
