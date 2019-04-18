import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, Image } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import "./style.css";
import { withRouter } from "react-router-dom";
import { deleteUser } from "../DataExchange/Fetch"

@inject("UserStore", "UIStore")
@observer
class PortalUserProfile extends React.Component {

  logout () {
    const { UserStore, UIStore, history } = this.props
    deleteUser()
    if(UIStore.isScreenLoading) UIStore.toggleScreenLoading()
    UserStore.isAuthenticated = false;
    history.push("/login");
  }

  render() {
    const { UserStore } = this.props;

    return (
      <div className="PortalUserProfile">
        <div className="PortalUserSettingsDropdown">
          <Dropdown
            direction={
              this.props.direction === undefined
                ? "right"
                : this.props.direction
            }
            icon="chevron down"
            trigger={<div className="PortalUserSettingsTrigger" />}
          >
            <Dropdown.Menu>
              <Dropdown.Header>
                <div className="Avatar-Wrap"> {" "}
                  <Image
                    className="Avatar"
                    size="small"
                    src={UserStore.user.img}
                  />
                </div>{" "}
              </Dropdown.Header>
              <Dropdown.Item
                text="Settings..."
                as={NavLink}
                to="/portal/settings"
              />
              <Dropdown.Item text="Log Out" onClick={() => this.logout()} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="UserName">
          <div style={{ color: "#000000", display: "inline" }}>
            <Image
              bordered
              style={{ marginTop: -5, float: "left" }}
              avatar
              src={UserStore.user.img}
            />
            <p>{UserStore.user.displayName}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PortalUserProfile);