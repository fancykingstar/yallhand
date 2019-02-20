import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import { inject, observer } from "mobx-react";

@inject("AccountStore")
@observer
export class Workspace extends React.Component {
  render() {
    const { AccountStore } = this.props;
    return (
      <div className="Workspace">
        <NavLink to="/panel/base-settings">
          {" "}
          <div
            className="WorkspaceLogo"
            style={{ backgroundImage: `url(${AccountStore.account.img})` }}
          />
        </NavLink>

        <div className="WorkspaceName">
          <div className="CompanyName">{AccountStore.account.label}</div>
        </div>
      </div>
    );
  }
}
