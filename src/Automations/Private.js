import React from "react";
import { Header, Pagination, Table } from "semantic-ui-react";
import { AddButton } from "../SharedUI/AddButton"
import { UserPagination, PageIndicies } from "../Teams/UserPagination";
import { UserEdit } from "../Teams/UserEdit";
import { set } from "mobx";


const MockAutos = [{
    "label": "do something else",
    "info_acquired": "name, email",
    "action_type": "email",
    "destination": "home@company.com",
    "last_updated": "5.23.17",
    "updated_by": "Mark Z"
}]


export class PrivateAutos extends React.Component {
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
    // const userProfile = this.props.profileData
    // const modalPassed = this.props.open

    const userData = MockAutos;

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

    const globalAutos = currentPage.map(globalAuto => (
      <Table.Row onClick={() => this.openEditor(globalAuto)}>
    
        <Table.Cell > {globalAuto.label}</Table.Cell>
        <Table.Cell >{globalAuto.info_acquired}</Table.Cell>
        <Table.Cell >{globalAuto.action_type}</Table.Cell>
        <Table.Cell >{globalAuto.destination}</Table.Cell>
        <Table.Cell >{globalAuto.last_updated}</Table.Cell>
        <Table.Cell>{globalAuto.updated_by}</Table.Cell>
      </Table.Row>
    ));

    return (
      <div className="LinkTable">
      <AddButton/>
        <Table selectable basic="very">
          <Table.Header>
            <Table.Row>
            <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Info Aquired</Table.HeaderCell>
              <Table.HeaderCell >Action</Table.HeaderCell>
              <Table.HeaderCell>Destination</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
              <Table.HeaderCell>Updated by</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{globalAutos}</Table.Body>
        </Table>
        {displayPagination}

      </div>
    );
  }
}
