import React from "react";
import MockUsers from "./MOCK_DATA";
import { Header, Pagination, Table } from "semantic-ui-react";
import { UserPagination, PageIndicies } from "./UserPagination";
import { UserEdit } from "./UserEdit";

export class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      selectedUser: {},
      modal: false
    };
  }

  handlePageChange = (e, { activePage }) => {
    this.setState({ active: activePage });
  };
  openEditor = info => {
    this.setState({ selectedUser: info, modal: true });
  };
  handleClose = () => this.setState({ modal: false });

  render() {
    const userData = MockUsers;
    const paginationData = UserPagination(userData.length);
    const displayPagination = paginationData.usePagination ? (
      <div style={{ textAlign: "center" }}>
        <Pagination
          defaultActivePage={1}
          totalPages={paginationData.totalPages}
          onPageChange={this.handlePageChange}
        />
      </div>
    ) : null;

    const newIndicies = PageIndicies(this.state.active, userData.length);
    const currentPage = userData.slice(newIndicies.start, newIndicies.end);

    const users = currentPage.map(user => (
      <Table.Row onClick={() => this.openEditor(user)}>
        <Table.Cell>
          <Header>
            <Header.Content>
              {user.first_name} {user.last_name}
              <Header.Subheader>{user.class}</Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.city}</Table.Cell>
        <Table.Cell>{user.city}</Table.Cell>
      </Table.Row>
    ));

    return (
      <div style={{ maxWidth: 700 }}>
        <Table basic="very" selectable celled collapsing columns={4}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Employee</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Team(s)</Table.HeaderCell>
              <Table.HeaderCell>Channel(s)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{users}</Table.Body>
        </Table>
        {displayPagination}
        <UserEdit
          profileData={this.state.selectedUser}
          open={this.state.modal}
          close={this.handleClose}
        />
      </div>
    );
  }
}
