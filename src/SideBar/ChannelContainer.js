import React from "react";
import { Channel } from "./Channel";
import { ChannelHeader } from "./ChannelHeader";
import { ChannelSearch } from "./ChannelSearch";

import { NavLink, Switch, Route } from "react-router-dom";
import { inject, observer } from "mobx-react";
import "./style.css";

@inject("Store")
@observer
export class ChannelContainer extends React.Component {
  render() {
    const { Store } = this.props;
    const channelTitles = Store.displayTitles;
    const channels = channelTitles.map(title => (
      <div id={title} onClick={(e) => Store.makeActive(e)}>
      <Channel text={title} active={Store.checkActive(title)} />
      </div>
    ));

    return (
      
      <div className="Container">
  
        <ChannelHeader />
        <ChannelSearch />
        <div className="ChannelList" />
        <NavLink to="/" exact>
          <Channel text="All" active="false" />
        </NavLink>
        {channels}

      </div>
    );
  }
}
