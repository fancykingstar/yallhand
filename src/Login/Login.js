import React from "react";
import { QLogo } from "../Assets/Graphics/QLogo";
import { Reauth } from "./Reauth";
import { Register } from "./Register"
import { ProfileInfo } from "./ProfileInfo"
import "./style.css";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: "reauth" };
  }
  render() {

    const views = {
        "reauth": <Reauth register={e => this.setState({"view": "register"})}/>,
        "register": <Register continues={e => this.setState({"view":"profileinfo"})}/>,
        "profileinfo": <ProfileInfo/>
}

    return (
      <div className="LoginFrame">
        {views[this.state.view]}
        <div className="LoginQuadrance">
          <div style={{ float: "left", opacity: "0.5" }}>
            {" "}
            <QLogo fill="#FFFFFF" style="" width="48px" height="60px" />{" "}
          </div>
          <div style={{ float: "right", lineHeight: "48px" }}> quadrance.</div>
        </div>
      </div>
    );
  }
}
