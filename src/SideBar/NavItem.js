import React from "react";
import { withRouter } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { inject, observer } from "mobx-react";

@inject("UIStore")
@observer
class NavItem extends React.Component {
  render() {
    const active =
      this.props.active === true
        ? "NavItemFrame SideBarActive"
        : "NavItemFrame lightlink";
    const { UIStore } = this.props;

    const handleClick = (id) => {
      id === "dashboard"? this.props.history.push("/panel") : this.props.history.push("/panel/" + this.props.id)
      UIStore.set("sideNav", "activePrimary", this.props.id)
      document.getElementById('ActionFrame').scrollTop = 0;
    }
    
    return (
        <div
          className={active}
          onClick={e => handleClick(this.props.id)}
        >
          <div className="NavItemIcon">
            <Icon name={this.props.icon} />
          </div>
          <div className="NavItemText">
            <h4>{this.props.label}</h4>
          </div>
        </div>
    );
  }
}

export default withRouter(NavItem)
