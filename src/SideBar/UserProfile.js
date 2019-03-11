import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, Image } from "semantic-ui-react";
import { inject, observer} from "mobx-react"
import "./style.css";
// import { DataEntryStore } from "../Stores/DataEntryStore";
import { deleteUser } from "../DataExchange/Fetch"
import { withRouter } from "react-router-dom"

@observer
@inject("UserStore", "UIStore")
@observer
class UserProfile extends React.Component {

  logout () {
    const { UIStore } = this.props
    deleteUser()
    this.props.history.push("/login");
    if(UIStore.isScreenLoading) UIStore.toggleScreenLoading()
  }

  render() {
    const {UserStore} = this.props

    return (
      <div className="UserProfile">
        <div className="UserSettingsDropdown" >
          <Dropdown icon="chevron down" trigger={<div className="UserSettingsTrigger"/>} >
            <Dropdown.Menu>
              <Dropdown.Header>
                <div className="Avatar-Wrap"> <Image className="Avatar" size="small"  src={UserStore.user.img} /></div>
              </Dropdown.Header>
              <Dropdown.Item text='Settings...' as={NavLink} to='/panel/user-settings'/>
              <Dropdown.Item text='Contact Support' as="a" href="mailto:support@yallhands.com?subject=Report%20an%20issue"/>
              <Dropdown.Item text='Log Out' onClick={() => this.logout()} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="UserName">
          <div>
            <h4>{UserStore.user.displayName_full}</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(UserProfile)