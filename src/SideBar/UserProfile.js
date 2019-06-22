import React from "react";
import { inject, observer} from "mobx-react"
import { NavLink } from "react-router-dom";
import { Dropdown, Image, Button, Modal, Form } from "semantic-ui-react";
import { deleteUser } from "../DataExchange/Fetch"
import { withRouter } from "react-router-dom"
import "./style.css";

@inject("UserStore", "UIStore", "DataEntryStore")
@observer
class UserProfile extends React.Component {

  logout () {
    const { UserStore, UIStore } = this.props
    deleteUser()
    if(UIStore.isScreenLoading) UIStore.toggleScreenLoading()
    UserStore.isAuthenticated = false;
    this.props.history.push("/");
  }

  render() {
    const {UserStore, UIStore, DataEntryStore} = this.props

    const openSupportModal = () => {
      UIStore.set("modal", "customerSupport", !UIStore.modal.customerSupport)
    }

    const submitJiraTicket = (e) => {
      e.preventDefault()
      const jira_token = process.env.REACT_APP_JIRA_TOKEN
      fetch('https://aubryai.atlassian.net/rest/api/latest/issue', {
        method: "POST", 
        mode: "cors",
        headers: {
          'Authorization': 'Basic ' + btoa(process.env.REACT_APP_JIRA_UN + ":" + jira_token),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            "fields": {
              "project":
              {
                  "key": "YS"
              },
              "summary": "Test.",
              "description": "Test",
              "issuetype": {
                  "name": "Story"
              }     
            }
          }
        )
      })
    }
    return (
      <div className="UserProfile">
        <div className="UserSettingsDropdown" >
          <Dropdown icon="chevron down" trigger={<div className="UserSettingsTrigger"/>} >
            <Dropdown.Menu>
              <Dropdown.Header>
                <div className="Avatar-Wrap">
                  {UserStore.user && UserStore.user.img && <Image className="Avatar" size="small"  src={UserStore.user.img} />}
                </div>
              </Dropdown.Header>
              <Dropdown.Item text='Settings...' as={NavLink} to='/panel/user-settings'/>
              <Dropdown.Item text='Contact Support'  onClick={openSupportModal}/>
              <Dropdown.Item text='Log Out' onClick={() => this.logout()} />
            </Dropdown.Menu>
          </Dropdown>

          <Modal onClose={e => UIStore.set("modal", "customerSupport", false)} open={UIStore.modal.customerSupport} size='small'>
            <Modal.Content>
              <Form>
                <Form.Input label="Message"
                  value={DataEntryStore.supportTicket.sendSubject}
                  onChange={(e, val) => 
                    DataEntryStore.set("supportTicket", "sendSubject", val.value)
                  }
                />
                <Form.Button
                  onClick={
                    submitJiraTicket
                  }
                >
                Submit 
                </Form.Button>
              </Form>
            </Modal.Content>
          </Modal>
        </div>
        <div className="UserName">
          <div>
            <h4>{UserStore.user && UserStore.user.displayName_full}</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(UserProfile)