import React from "react";
import { withRouter } from "react-router-dom";
import "./card-style.css";
import "./style.css";

const UserCard = props => {
  return (
    <div>

            <div className="CardContainerbg" style={{backgroundImage: `url(${props.data.img})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
            <div className="CardContaineralpha"></div>

        <div onClick={e => { props.history.push("/portal/learn-detail/" + props.data.policyID)}} 
    className="PortalCard">
          <div className="PortaldisplayAdjust">
            <div className="PortalQuestion">
              <h3>{props.data.label}</h3>
            </div>
          </div>
        </div>
  

    </div>
    </div>
  );
};

export default withRouter(UserCard)