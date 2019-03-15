import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import { inject, observer } from "mobx-react";

@inject("AccountStore")
@observer
export class Workspace extends React.Component {
  render() {
    const { AccountStore } = this.props;
    const styles = {7: {fontSize: "1.8em"}, 14: {fontSize: "1.3em"}, 30: {fontSize: "0.85em"}}
    const getStyle = val => {
      let style = {}
      let found = false
      Object.keys(styles).forEach(size => {
        if(val.length <= Number(size) && !found){
          found = true
          style = styles[size]
        }
      })
      return style
    }
    const { account } = AccountStore
    return (
      <div className="Workspace">
        <NavLink to="/panel/base-settings">
          {" "}
          <div
            className="WorkspaceLogo"
            style={{ backgroundImage: `url(${account && account.img ? account.img : ''})` }}
          />
        </NavLink>

        <div className="WorkspaceName">
          <div 
          style={getStyle(account && account.label ? account.label : '')}
          className="CompanyName">{account && account.label ? account.label : ''}</div>
        </div>
      </div>
    );
  }
}
