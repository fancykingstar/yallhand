import React from "react";
import { inject, observer } from "mobx-react";
import { SecondaryMenu } from "../SharedUI/SecondaryMenu";
import { Automations } from "./Automations";
import EmailPrimary from "./EmailPrimary";
import SendOptions from "./SendOptions";
import { EmailTemplates } from "./EmailTemplates";

@inject("UIStore", "DataEntryStore", "EmailStore")
@observer
export class EmailFrame extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
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
          <div className={isVisable("send email")}> {" "} <EmailPrimary /> </div>
          <div className={isVisable("send options")}> {" "} <SendOptions /> </div>
          <div className={isVisable("saved templates")}> {" "} <EmailTemplates /> </div>
          <div className={isVisable("automations")}> {" "} <Automations/></div>
        </div>
      </div>
    );
  }
}
