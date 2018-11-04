import React from "react";
import {TeamTagSelect} from "../SharedUI/TeamTagSelect"


export const PostControls = () => {
    
    return (
      <div className="Form">
   
      <TeamTagSelect invalidTeams={[]} invalidTags={[]} defaultTeam={''} defaultTag={''}/>
      
    </div>
    );
  }

