import React from "react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Queue } from "./Queue";
import { SendEmail } from "./SendEmail";
import Bundles from "./Bundles";
import { Automations } from "./Automations";
import { inject, observer } from "mobx-react";
import { modifyBundle } from "../DataExchange/Up";
import { queueEdit } from "../DataExchange/PayloadBuilder";

@inject("UIStore", "DataEntryStore")
@observer
export class EmailFrame extends React.Component {
  constructor(props) {
    super(props);
    const { UIStore, DataEntryStore } = this.props;
    this.updateQueue = (name=null) => {
      if (UIStore.menuItem.emailFrame === "queue" && name !== "queue") {
        modifyBundle(queueEdit(), false).then(() => {
          DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
          DataEntryStore.resetDraft()
        })
  
      }
    }
  }
  componentWillUnmount() {
    this.updateQueue()
  }


  render() {
    const { UIStore } = this.props;
    const handleItemClick = (e, { name }) => {
      UIStore.set("menuItem", "emailFrame", name);
    };

    const isVisable = name => {
      return name === UIStore.menuItem.emailFrame ? "Visable" : "Hidden";
    };
    const menuItems = ["queue", "bundles", "send email", "automations"];
    const handleSearch = val => {
      UIStore.set("search", "searchBundles", val);
    };

    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={UIStore.menuItem.emailFrame}
          handleClick={handleItemClick}
          useSearch={UIStore.menuItem.emailFrame === "bundles"}
          searchOutput={handleSearch}
        />
        <div className="TeamActionFrame">
          <div className={isVisable("queue")}>
            {" "}
            <Queue />
          </div>
          <div className={isVisable("send email")}>
            {" "}
            <SendEmail />
          </div>
          <div className={isVisable("bundles")}>
            {" "}
            <Bundles />
          </div>
          <div className={isVisable("automations")}>
            {" "}
            <Automations />
          </div>
        </div>
      </div>
    );
  }
}
