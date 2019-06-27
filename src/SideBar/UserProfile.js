import React from "react";
import { inject, observer} from "mobx-react"
import { NavLink } from "react-router-dom";
import toast  from "../YallToast"
import { isEmpty } from '../SharedValidations/InputValidations'
import { Dropdown, Image, Button, Modal, Form } from "semantic-ui-react";
import { deleteUser, apiCall } from "../DataExchange/Fetch"
import { withRouter } from "react-router-dom"
import "./style.css";
import { AccountStore } from "../Stores/AccountStore";

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
      const {accountID, generalEmail, label} = AccountStore.account
      e.preventDefault()
      let {sendDescription} = DataEntryStore.supportTicket
      if(isEmpty(sendDescription)) {
        toast.error("Please fill out all fields...", {hideProgressBar: true}) 
      } else {
        apiCall("users/needsupport", "POST", {
          summary: label, 
          description: `User Description: ${sendDescription},\n 
                        email: ${generalEmail},\n 
                        accountId: ${accountID}, \n
                        label: ${label}`})
        .then(() => {
          UIStore.set("modal", "customerSupport", false)
          toast.success("Your support request has been generated.", {hideProgressBar: true})
        })
        .catch(err => {
          console.log(err)
          toast.error("oops somethign went wrong", {hideProgressBar: true})
        })
      }
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
                <Form.Input label="Description"
                  value={DataEntryStore.supportTicket.sendDescription}
                  onChange={(e, val) => 
                    DataEntryStore.set("supportTicket", "sendDescription", val.value)
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