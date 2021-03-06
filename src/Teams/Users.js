import React from "react";
import { Header, Table, Image, Dropdown, Pagination } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { UserEdit } from "./UserEdit";
import { getDisplayTags } from "../SharedCalculations/GetDisplayTags";
import { getDisplayTeams } from "../SharedCalculations/GetDisplayTeams";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { UserImgPlaceholder } from "../SharedCalculations/UserImgPlaceholder";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import { PageSizeSelect } from "../Analytics/PageSizeSelect";

@inject("TeamStore", "UIStore", "DataEntryStore", "AccountStore")
@observer
export class Users extends React.Component {
  constructor(props){
    super(props);
    this.state={user: "", limit: 25, currentPage: 1};
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

  onChangeLimit = (event, data) => {
    if (data.value !== this.state.limit) {
      this.setState({limit: data.value, currentPage: 1});
    }
  }

  onChangePage = (event, data) => {
    const { activePage } = data;
    if (activePage !== this.state.currentPage) {
      this.setState({currentPage: activePage})
    }
  };

  render() {
    const { UIStore, DataEntryStore, AccountStore, TeamStore } = this.props;
    const { userEdit } = DataEntryStore.userEditFields;
    const { adminLimits } = userEdit;
    const { dropdown, search } = UIStore;

    const { currentPage, data, limit } = this.state;
    let items = [];

    const displayFilter = () => {
      if (dropdown.usersFilter === "active") return AccountStore.activeUsers;
      else if (dropdown.usersFilter === "invited") return AccountStore.invitedUsers;
      else return AccountStore.inactiveUsers;
    }

    const filteredDisplay = () => {
      if (search.searchUsers !== "") {
        const results = stupidSearch(search.searchUsersData, search.searchUsers);
        return AccountStore.allUsers.filter(item => results.includes(item.email));
      } else {
        return displayFilter()
      }
    };

    const totalPages = Math.ceil(filteredDisplay().length / limit);
    items = filteredDisplay().slice(
      (currentPage - 1) * limit,
      (currentPage) * limit
    );

    const users = items.map(user => (
      <Table.Row  disabled={!user.isActive && !user.code} key={`user${giveMeKey()}`} onClick={() => this.setState({user})}>
        <Table.Cell width={3}>
        <Image src={user.img !== "" && user.img !== undefined ? user.img : UserImgPlaceholder()} avatar />{" "}{user.displayName_full}
        </Table.Cell>
        
        <Table.Cell>
        {user.isAdmin ? "Admin" : null}{" "}
        {!user.code ? null: user.now? "Invite Sent":"Scheduled To Invite"}
        {!user.code && !user.isActive? `Offboarded ${UTCtoFriendly(user.updated).split(',')[0]}`:null}
        </Table.Cell>
        

        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {getDisplayTeams(user.teamID, TeamStore.structure)}
        </Table.Cell>
        <Table.Cell>
          {user.tags.length === 0 ? "None" : getDisplayTags(user.tags, TeamStore.tags)}
        </Table.Cell>
        <Table.Cell>
          {!user.boss? "": user.boss === "self"? "Self":AccountStore._getDisplayName(user.boss) }
        </Table.Cell>
      </Table.Row>
    ));

    return (
      <div className="UserTable">
      <span style={{ marginRight: 10 }}>
        view{' '}
        <Dropdown
          inline
          value={dropdown.usersFilter}
          onChange={(e, val) => UIStore.set("dropdown", "usersFilter", val.value)}
          options={[{text: "active", value: "active" }, { text: "invited", value: "invited"}, { text: "offboarded", value: "offboarded"}]} />
        </span>
        <PageSizeSelect 
          limit={limit}
          onChangeLimit={this.onChangeLimit}
        />
        <Table basic="very" selectable fixed columns={10}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Employee</Table.HeaderCell>
              <Table.HeaderCell width={1}/>
              <Table.HeaderCell width={2}>Email</Table.HeaderCell>
              <Table.HeaderCell width={1}>Team</Table.HeaderCell>
              <Table.HeaderCell width={1}>Tag</Table.HeaderCell>
              <Table.HeaderCell width={1}>Reports To</Table.HeaderCell>
             
            </Table.Row>
          </Table.Header>
          <Table.Body>{users}</Table.Body>
        </Table>
        {
          totalPages > 1 ?
          <Table>
            <Table.Row>
              <Table.HeaderCell className="center" style={{ border: 'none', textAlign: "center" }}>
                  <Pagination 
                    activePage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={this.onChangePage} 
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    boundaryRange={0}
                  />
              </Table.HeaderCell>
            </Table.Row>
          </Table> : ""
        }
        <UserEdit data={this.state.user} open={Boolean(this.state.user)} close={()=>this.setState({user: ""})} />
      </div>
    );
  }
}
