import React from "react";
import { Header, Table, Image } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { UserEdit } from "./UserEdit";
import { getDisplayTags } from "../SharedCalculations/GetDisplayTags";
import { getDisplayTeams } from "../SharedCalculations/GetDisplayTeams";
import {
  initSearchObj,
  stupidSearch
} from "../SharedCalculations/StupidSearch";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { UserImgPlaceholder } from "../SharedCalculations/UserImgPlaceholder";


@inject("TeamStore", "UIStore", "DataEntryStore", "AccountStore")
@observer
export class Users extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    const { TeamStore } = this.props;
    const { AccountStore } = this.props;
    if (UIStore.search.searchUsersData.length === 0) {
      UIStore.set("search",
        "searchUsersData",
        initSearchObj(
         AccountStore.allUsers,
          "userID",
          TeamStore.structure,
          TeamStore.tags,
          true
        ) 
      );
    }
  }
  render() {
    const {UIStore ,DataEntryStore, AccountStore, TeamStore, UserStore } = this.props;

    const openEditor = info => {
      DataEntryStore.reset("userEditFields", {adminConfig: "all"});
      DataEntryStore.set(
        "userEditFields",
        "userEdit",
        AccountStore._getUser(info)
      );
      DataEntryStore.set(
        "userEditFields",
        "isAdmin",
        DataEntryStore.userEditFields.userEdit.isAdmin
      );
      if(DataEntryStore.userEditFields.userEdit.isAdmin){
      DataEntryStore.set("userEditFields", "adminTeams", DataEntryStore.userEditFields.userEdit.adminLimits.teams)
      DataEntryStore.set("userEditFields", "adminTags", DataEntryStore.userEditFields.userEdit.adminLimits.tags)
      DataEntryStore.set("userEditFields", "adminChannels", DataEntryStore.userEditFields.userEdit.adminLimits.channels)
      }
      UIStore.set("modal", "editUser", true);
    };
    const handleClose = () => UIStore.set("modal", "editUser", false);
    const filteredDisplay = () => {
      if (UIStore.search.searchUsers !== "") {
        const results = stupidSearch(
          UIStore.search.searchUsersData,
          UIStore.search.searchUsers
        );
        return AccountStore.allUsers.filter(item => results.includes(item.userID));
      } else {
        return AccountStore.allUsers;
      }
    };

    const users = filteredDisplay().map(user => (
      <Table.Row 
        disabled={!user.isActive}
        key={"user" + giveMeKey()} 
        onClick={() => openEditor(user.userID)}>
        <Table.Cell width={3}>
          <Header disabled={!user.isActive}>
            <Header.Content>
              {user.displayName_full}
              <Header.Subheader>
                <Image src={user.img !== "" ? user.img : UserImgPlaceholder()} avatar />
                {user.isAdmin ? "Admin" : null}{" "}
                {user.displayName_full === "" ? "Invite Sent" : null}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {getDisplayTeams(user.teamID, TeamStore.structure)}
        </Table.Cell>
        <Table.Cell>
          {user.tags.length === 0
            ? "None"
            : getDisplayTags(user.tags, TeamStore.tags)}
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <div className="UserTable">
        <Table basic="very" selectable fixed columns={8}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>Employee</Table.HeaderCell>
              <Table.HeaderCell width={3}>Email</Table.HeaderCell>
              <Table.HeaderCell width={1}>Team</Table.HeaderCell>
              <Table.HeaderCell width={1}>Tag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{users}</Table.Body>
        </Table>
        <UserEdit open={UIStore.modal.editUser} close={handleClose} />
      </div>
    );
  }
}
