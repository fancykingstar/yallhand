import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { inject, observer } from "mobx-react";

@inject("UIStore")
@observer
export class NavItem extends React.Component {
  render() {
    const active =
      this.props.active === true
        ? "NavItemFrame SideBarActive"
        : "NavItemFrame lightlink";
    const { UIStore } = this.props;
    return (
      <Link to={"/panel/" + this.props.id}>
        <div
          className={active}
          onClick={e => UIStore.set("sideNav", "activePrimary", this.props.id)}
        >
          <div className="NavItemIcon">
            <Icon name={this.props.icon} />
          </div>
          <div className="NavItemText">
            <h4>{this.props.label}</h4>
          </div>
        </div>
      </Link>
    );
  }
}
