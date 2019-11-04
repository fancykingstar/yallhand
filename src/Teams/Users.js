import React from "react";
import { Header, Table, Image, Dropdown } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { UserEdit } from "./UserEdit";
import { getDisplayTags } from "../SharedCalculations/GetDisplayTags";
import { getDisplayTeams } from "../SharedCalculations/GetDisplayTeams";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { UserImgPlaceholder } from "../SharedCalculations/UserImgPlaceholder";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";

@inject("TeamStore", "UIStore", "DataEntryStore", "AccountStore")
@observer
export class Users extends React.Component {
  constructor(props){
    super(props);
    this.state={user: ""};
  }
  componentWillUnmount(){
    const {UIStore} = this.props;
    UIStore.set("search", "searchUsers", "")
  }

  componentDidMount() {
    const { AccountStore, TeamStore, UIStore } = this.props;
    if (UIStore.search.searchUsersData.length === 0) {
      UIStore.set("search",
        "searchUsersData",
        initSearchObj(AccountStore.allUsers, "email", TeamStore.structure, TeamStore.tags, true)
      );
    }
  }
  render() {
    const { UIStore, DataEntryStore, AccountStore, TeamStore } = this.props;
    const { userEdit } = DataEntryStore.userEditFields;
    const { adminLimits } = userEdit;
    const { dropdown, search } = UIStore;

    const displayFilter = (all) => {
      if (dropdown.usersFilter === "active") return all.filter(user => user.isActive || (user.password === '' && user.userId === '')) 
      else if (dropdown.usersFilter === "invited") return all.filter(user => user.code);
      else return all.filter(user => !user.isActive && (user.password !== '' && user.userId !== ''))
    }

    const filteredDisplay = () => {
      if (search.searchUsers !== "") {
        const results = stupidSearch(search.searchUsersData, search.searchUsers);
        return AccountStore.allUsers.filter(item => results.includes(item.email));
      } else {
        return displayFilter(AccountStore.allUsers)
      }
    };

    const users = filteredDisplay().map(user => (
      <Table.Row  disabled={!user.isActive && !user.code} key={`user${giveMeKey()}`} onClick={() => this.setState({user})}>
        <Table.Cell width={3}>
          <Header >
            <Header.Content>
              {user.displayName_full}
              <Header.Subheader>
                <Image src={user.img !== "" && user.img !== undefined ? user.img : UserImgPlaceholder()} avatar />
                {user.isAdmin ? "Admin" : null}{" "}
                {!user.code ? null: user.now? "Invite Sent":"Scheduled To Invite"}
                {!user.code && !user.isActive? `Offboarded ${UTCtoFriendly(user.updated).split(',')[0]}`:null}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {getDisplayTeams(user.teamID, TeamStore.structure)}
        </Table.Cell>
        <Table.Cell>
          {user.tags.length === 0 ? "None" : getDisplayTags(user.tags, TeamStore.tags)}
        </Table.Cell>
        <Table.Cell>
          {user.boss && AccountStore._getDisplayName(user.userID)}
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <div className="UserTable">
      <span>
        view{' '}
        <Dropdown
          inline
          value={dropdown.usersFilter}
          onChange={(e, val) => UIStore.set("dropdown", "usersFilter", val.value)}
          options={[{text: "active", value: "active" }, { text: "invited", value: "invited"}, { text: "offboarded", value: "offboarded"}]} />
        </span>
        <Table basic="very" selectable fixed columns={10}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Employee</Table.HeaderCell>
              <Table.HeaderCell width={2}>Email</Table.HeaderCell>
              <Table.HeaderCell width={1}>Team</Table.HeaderCell>
              <Table.HeaderCell width={1}>Tag</Table.HeaderCell>
              <Table.HeaderCell width={1}>Reports To</Table.HeaderCell>
             
            </Table.Row>
          </Table.Header>
          <Table.Body>{users}</Table.Body>
        </Table>
        <UserEdit data={this.state.user} open={Boolean(this.state.user)} close={()=>this.setState({user: ""})} />
      </div>
    );
  }
}
