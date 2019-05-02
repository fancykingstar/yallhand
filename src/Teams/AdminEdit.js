import React from "react";
// import { Dropdown, Form } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
// import { TeamSelect } from "../SharedUI/TeamSelect";
// import { TagSelect } from "../SharedUI/TagSelect";
// import { ChannelSelect } from "../SharedUI/ChannelSelect";
// import {
//   LabelGroup,
//   validateAdd,
//   labelsOneRemoved
// } from "../SharedUI/LabelGroup";
// import { ChannelStore } from "../Stores/ChannelStore";
import { PermissionLevel } from "./PermissionLevel";
import { AdminConfig } from "./AdminConfig"

@inject("DataEntryStore", "TeamStore")
@observer
export class AdminEdit extends React.Component {
  render() {
    const { DataEntryStore } = this.props;
    // const { TeamStore } = this.props;
    const changeConfig = val => {
      DataEntryStore.set("userEditFields", "adminConfig", val);
    };
    // const add = (type, val) => {
    //   const key = {
    //     team: {
    //       valid: DataEntryStore.userEditFields.adminTeams,
    //       set: "adminTeams"
    //     },
    //     tag: {
    //       valid: DataEntryStore.userEditFields.adminTags,
    //       set: "adminTags"
    //     },
    //     channel: {
    //       valid: DataEntryStore.userEditFields.adminChannels,
    //       set: "adminChannels"
    //     }
    //   };
    //   const newData = validateAdd(val, key[type].valid);
    //   newData === null
    //     ? null
    //     : DataEntryStore.set("userEditFields", key[type]["set"], newData);
    // };

    const configOptions =
      DataEntryStore.userEditFields.adminConfig === "all" ? null : <AdminConfig storeTarget="userEditFields"/>

    return (
      <React.Fragment>
      <PermissionLevel defaultVal={DataEntryStore.userEditFields.adminConfig} output={changeConfig}/>
        {configOptions}
    
      </React.Fragment>
    );
  }
}
