import React from "react";
import { Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./card-style.css";
import "./style.css";

export const UserCard = props => {
  const bgimg = props.data.img;
  return (
    <div>

            <div className="CardContainerbg" style={{backgroundImage: `url(${props.data.img})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
            <div className="CardContaineralpha"></div>

      <Link
        to={"/portal/learn-detail/" + props.data.policyID}
        style={{ color: "rgb(45, 45, 45)" }}
      >
        <div className="PortalCard">
          <div className="PortaldisplayAdjust">
            <div className="PortalQuestion">
              <h3>{props.data.label}</h3>
            </div>
          </div>
        </div>
      </Link>

    </div>
    </div>
  );
};
