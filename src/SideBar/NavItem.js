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
    const checkKnowledge = this.props.id === "knowledge" ? "/panel/"  : "/panel/" + this.props.id
    const activeall = (val) => {
    if(val.currentTarget.id === "knowledge" ) {
      val.currentTarget.id = "All" 
      return val
    }
    else {return val}}

    return (
      <Link to={checkKnowledge}>
        <div
          className={active}
          id={this.props.id}
          onClick={e => SideBarStore.makeActive(activeall(e))}
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