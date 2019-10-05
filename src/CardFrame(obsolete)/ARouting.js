import React from "react";
import "./style.css";
import { SelectFrame } from './SelectFrame'
// import { stateOptions, tagOptions } from "./TempObjects";
// import { Menu, Radio, Form } from "semantic-ui-react";
// import { ManageFrame } from "./ManageFrame";


export class ARouting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "SelectFrame" };
  }
  handleItemClick = (e, name) => {
    let newState = { activeItem: name };
    this.setState(newState);
  };
  frameActive = (className) =>  {return className === this.state.activeItem ? className : className + " FrameDeactivated"}
  render() {
    return (
      <div className="TeamSelect">
        <div className="SelectEditFrame">
            <div className='SelectFrame'><SelectFrame /></div>
        </div>
      </div>
    );
  }
}
