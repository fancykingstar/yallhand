import React from "react";
import "./style.css";
import { EditTeamsList } from './EditTeamsList'

export class ManageFrame extends React.Component {
  render() {
    return (
      <div className="Grid">
        <EditTeamsList/>
        <div style={{height: 7, lineHeight: 7}}><span style={{fontWeight: 400}}>configure...</span></div>
        
      </div>
    );
  }
}
