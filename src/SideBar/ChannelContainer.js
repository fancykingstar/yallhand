import React from "react";
import { Channel } from "./Channel";
import { ChannelHeader } from "./ChannelHeader";
import { ChannelSearch } from "./ChannelSearch";
import { NavLink } from "react-router-dom";
import { inject, observer } from "mobx-react";

import "./style.css";

@inject("SideBarStore")
@observer
export class ChannelContainer extends React.Component {
  componentWillMount() {
    const { SideBarStore } = this.props;
    SideBarStore.loadChannels();
  }
  render() {
    const { SideBarStore } = this.props;
    const channelTitles = SideBarStore.displayTitles;
    const channels = channelTitles.map(title => (
      <div id={title} key={title} onClick={e => SideBarStore.makeActive(e)}>
        <Channel text={title} active={SideBarStore.checkActive(title)} />
      </div>
    ));

    return (
      <div className="Container">
        <ChannelHeader />
        <ChannelSearch />
        <div className="ChannelList" />
        <NavLink to="/" exact>
          <div id="All" onClick={e => SideBarStore.makeActive(e)}>
            <Channel text="All" active={SideBarStore.checkActive("All")} />
          </div>
        </NavLink>
        {channels}
      </div>
    );
  }
}
