import React from "react";
import { inject, observer } from "mobx-react";
import {Header, Segment, Icon } from "semantic-ui-react"
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { CampaignAnalytics } from "./CampaignAnalytics"
import { PortalViews} from "./PortalViews"

@inject("UIStore", "DataEntryStore", "EmailStore")
@observer
export class AnalyticsFrame extends React.Component {
  componentWillUnmount(){
    const {UIStore} = this.props;
    UIStore.set("search","campaignsSearchValue","");
    UIStore.set("search","analyticsSearchValue","");
  }
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  render() {
    const { UIStore } = this.props;
    const handleItemClick = (e, { name }) => {
      UIStore.set("menuItem", "analyticsFrame", name);
      UIStore.set("search","campaignsSearchValue","");
      UIStore.set("search","analyticsSearchValue","");
    };

    const isVisable = name => {
      return name === UIStore.menuItem.analyticsFrame ? "Visable" : "Hidden";
    };
    const menuItems = ["email campaigns", "user portal"];
    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={UIStore.menuItem.analyticsFrame}
          handleClick={handleItemClick}
        />
        <div className="TeamActionFrame">
          <div className={isVisable("email campaigns")}> {" "}  <CampaignAnalytics /></div>
          <div className={isVisable("user portal")}> {" "}  <PortalViews/> </div>
        </div>
      </div>
    );
  }
} 
