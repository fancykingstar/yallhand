import React from "react";
import { Button } from "semantic-ui-react";
import "./card-style.css";
import { NavLink } from "react-router-dom";

export class CreateCard extends React.Component {
  render() {
    return (
      <div className="CreateCard">
        <div className="Q">
        <NavLink to="/manage-policy">
          <Button circular icon="plus" color="blue" size="large" />
          </NavLink>
        </div>
        <div className="CreateNewHeader">
          <h3>Create a new policy</h3>
        </div>
      </div>
    );
  }
}
