import React from "react";
import { BackToChan } from "./BackToChan";
import { ManagePolicyHead } from "./ManagePolicyHead";
import { Link } from "react-router-dom";
import { CardFrame } from "../CardFrame/CardFrame"
import "./style.css";

export class ManagePolicy extends React.Component {
  render() {
    return (
      <div className="ManagePolicy">
        <Link to='/CardFrame' component={CardFrame}>
          <BackToChan />
        </Link>
        <ManagePolicyHead />
      </div>
    );
  }
}
