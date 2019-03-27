import React from "react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Queue } from "./Queue";
import { SendEmail } from "./SendEmail";
import Bundles from "./Bundles";
import { Automations } from "./Automations";
import { inject, observer } from "mobx-react";
import { modifyBundle, createBundle } from "../DataExchange/Up";
import { queueEdit, queueCreate } from "../DataExchange/PayloadBuilder";

@inject("UIStore", "DataEntryStore", "EmailStore")
@observer
export class EmailFrame extends React.Component {
  constructor(props) {
    super(props);
    const { UIStore, DataEntryStore, EmailStore } = this.props;
    this.updateQueue = () => {
      if (UIStore.menuItem.emailFrame === "queue" && EmailStore.allBundles.filter(i => i.isQueue).length > 0) {
        modifyBundle(queueEdit(), false).then(() => {
          // Something strange here, why it reset the current bundle infos and make it impossible to edit it
          // DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
          // DataEntryStore.resetDraft()
        })
      }
      else {
        createBundle(queueCreate(), false).then(() => {
          EmailStore.loadBundles([...EmailStore.allBundles, ...[EmailStore.queue]])
          DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
          DataEntryStore.resetDraft()
        })
      }
      // Something strange here, why it reset the current bundle infos and make it impossible to edit it
      // DataEntryStore.reset("emailCampaign", {sendEmailsConfig: "now"});
      // DataEntryStore.resetDraft()
    }
  }

  componentWillUnmount() {
    this.updateQueue()
  }
  
  render() {
    const { UIStore } = this.props;
    const { menuItem } = UIStore;
    const { emailFrame } = menuItem;
    const handleItemClick = (e, { name }) => UIStore.set("menuItem", "emailFrame", name);
    const isVisable = name => name === emailFrame ? "Visable" : "Hidden";
    const handleSearch = val => UIStore.set("search", "searchBundles", val);
    const menuItems = ["queue", "bundles", "send email", "automations"];

    return (
      <div>
        <SecondaryMenu
          menuItems={menuItems}
          activeItem={emailFrame}
          handleClick={handleItemClick}
          useSearch={emailFrame === "bundles"}
          searchOutput={handleSearch}
        />
        <div className="TeamActionFrame">
          <div className={isVisable("queue")}>
            <Queue />
          </div>
          <div className={isVisable("send email")}>
            <SendEmail />
          </div>
          <div className={isVisable("bundles")}>
            <Bundles />
          </div>
          <div className={isVisable("automations")}>
            <Automations />
          </div>
        </div>
      </div>
    );
  }
}
