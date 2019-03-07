import React from "react";
import { ProfileInfo } from "./ProfileInfo"
import { PrimaryLogins} from "./PrimaryLogins"
import "./style.css";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: "register" };
  }
  render() {

    const views = {
        "reauth": <PrimaryLogins stage="reauth"/>,
        "reauthEmail": <PrimaryLogins stage="reauthEmail"/>,
        "register": <PrimaryLogins stage="register"/>,
        "profileinfo": <ProfileInfo gmail={false}/>,
        "profileinfoGmail": <ProfileInfo gmail={true}  />
    }

    return (
      <div className="LoginFrame">
        {views[this.state.view]}
      </div>
    );
  }
}
