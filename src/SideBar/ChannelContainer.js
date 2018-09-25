import React from "react";
import { Channel } from "./Channel";
import { ChannelHeader } from "./ChannelHeader";
import { ChannelSearch } from "./ChannelSearch";

import { NavLink, Switch, Route } from "react-router-dom";
import "./style.css";

export class ChannelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };
  render() {
    const { activeIndex } = this.state;

    return (
      <div className="Container">
        <ChannelHeader />
        <ChannelSearch />
        <div className="ChannelList"></div>
        <NavLink to="/" exact>
          <Channel text="Sales" active="false" />
        </NavLink>
        <Channel text="Marketing" active="false" />
        <Channel text="Benefits" active="false" />
        <Channel text="Payroll" active="true" />
       
      </div>
    );
  }
}
