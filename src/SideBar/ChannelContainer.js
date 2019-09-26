import React from "react";
import { Channel } from "./Channel";
import { ChannelHeader } from "./ChannelHeader";
import { ChannelSearch } from "./ChannelSearch";
import { inject, observer } from "mobx-react";
import { Transition } from "semantic-ui-react";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";


@inject("ChannelStore", "PoliciesStore", "UIStore")
@observer
export class ChannelContainer extends React.Component {

  render() {
    const { ChannelStore, UIStore } = this.props;
    const channelFilter =
      UIStore.search.channel === ""
        ? ChannelStore.allChannels
        : ChannelStore.allChannels.filter(chan =>
            chan.label
              .toLowerCase()
              .includes(UIStore.search.channel.toLowerCase())
          )

    const channels = channelFilter.map(chan => (
      <div
        key={"chan" + giveMeKey()}
        onClick={e => UIStore.set("sideNav", "activeChannel", chan.chanID)}
      >
        <Channel label={chan.label} active={UIStore.sideNav.activeChannel === chan.chanID} />
      </div>
    ));

    const showChannel =
      UIStore.sideNav.activePrimary === "faqs" ||
      UIStore.sideNav.activePrimary === "announcements"
        ? true
        : false;
    return (
      <React.Fragment>
        <Transition visible={showChannel} duration={500}>
          <div className="Container">
            <ChannelHeader />
            <ChannelSearch />
            <div className="ChannelList">
              <div
                onClick={e => UIStore.set("sideNav", "activeChannel", "All")}
                style={UIStore.search.channel !== "" ? {display: "none"} : null}
              >
                <Channel label="All" active={UIStore.sideNav.activeChannel === "All"} />
              </div>

              {channels}
            </div>
          </div>
        </Transition>
      </React.Fragment>
    );
  }
}
