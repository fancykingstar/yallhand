import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { inject, observer } from "mobx-react";

@inject("SideBarStore")
@observer
export class NavItem extends React.Component {
  render() {
    const active =
      this.props.active === true
        ? "NavItemFrame SideBarActive"
        : "NavItemFrame";
    const { SideBarStore } = this.props;
    return (
      <Link to={"/" + this.props.id}>
        <div
          className={active}
          id={this.props.id}
          onClick={e => SideBarStore.makeActive(e)}
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