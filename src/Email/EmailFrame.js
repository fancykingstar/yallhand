import React from "react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Queue } from "./Queue";
import { SendEmail } from "./SendEmail";
import Bundles from "./Bundles";
import { Automations } from "./Automations";
import { inject, observer } from "mobx-react";
import { modifyBundle, createBundle } from "../DataExchange/Up";
import { queueEdit, queueCreate } from "../DataExchange/PayloadBuilder";

import {EmailPrimary} from "./EmailPrimary" 
import { SendOptions } from "./SendOptions";

@inject("UIStore", "DataEntryStore", "EmailStore")
@observer
export class EmailFrame extends React.Component {
  constructor(props) {
    super(props);
    const { UIStore, DataEntryStore, EmailStore } = this.props;
    this.updateQueue = () => {
      if (UIStore.menuItem.emailFrame === "queue" && EmailStore.allBundles.filter(i => i.isQueue).length > 0) {
        modifyBundle(queueEdit(), false).then(() => {
          DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
          DataEntryStore.resetDraft()
        })
      }
      else {
        createBundle(queueCreate(), false).then(() => {
          EmailStore.loadBundles([...EmailStore.allBundles, ...[EmailStore.queue]])
          DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
          DataEntryStore.resetDraft()
        })
      }
      DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
      DataEntryStore.resetDraft()
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
    const menuItems = ["send email", "saved templates", "automations"];
    // const menuItems = ["queue", "bundles", "send email", "automations"];
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
       
          <div className={isVisable("send email")}>
            {" "}
            <EmailPrimary/>
          </div>
      <div className={isVisable("send options")}>
            {" "}
            <SendOptions/>
          </div>
             {/*  <div className={isVisable("bundles")}>
            {" "}
            <Bundles />
          </div>
          <div className={isVisable("automations")}>
            {" "}
            <Automations />
          </div> */}
        </div>
      </div>
    );
  }
}
