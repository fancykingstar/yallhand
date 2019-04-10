import React from "react";
import { withRouter } from "react-router-dom";
import { UIStore } from "../Stores/UIStore"
import { Label } from "semantic-ui-react"
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
              <h3>{props.data.variations[0].label === ""? props.data.label : props.data.variations[0].label}</h3>
            </div>
            {UIStore.portal.viewedContent.includes(props.data.policyID) === false? <div style={{marginLeft: 20}}><Label as='a' size="mini" color='red'> Unread </Label></div>  : null}
          </div>
        </div>
  

    </div>
    </div>
  );
};

export default withRouter(UserCard)