import React from "react";
import "./style.css";
import { Pagination, Table } from "semantic-ui-react";
import { AddButton } from "../SharedUI/AddButton";
import { UserPagination, PageIndicies } from "../Teams/UserPagination";

const MockLinks = [
  {
    label: "company handbook",
    url: "https://www.example.com/companyhandbookasdfasdfasdfasd",
    last_updated: "05/23/2017",
    active: ["Where is the handbook?"]
  },
  {
    label: "company handbook",
    url: "https://www.example.com/companyhandbookasfdsadfsadfds",
    last_updated: "05/23/2017",
    active: ["Where is the handbook?"]
  },
  {
    label: "company handbook",
    url: "https://www.example.com/companyhandbookasdfsadfsdfsdfaasdf",
    last_updated: "05/23/2017",
    active: ["Where is the handbook?"]
  }
];

export class Links extends React.Component {
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
    const userData = MockLinks;

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

    const resurls = currentPage.map(resurl => (
      <Table.Row onClick={() => this.openEditor(resurl)} key={resurl.label}>
        <Table.Cell> {resurl.label}</Table.Cell>
        <Table.Cell>
          <a href={resurl.url} target="_blank">
            {resurl.url}
          </a>
        </Table.Cell>
        <Table.Cell>{resurl.last_updated}</Table.Cell>
        <Table.Cell>{resurl.active}</Table.Cell>
      </Table.Row>
    ));

    return (
      <div className="LinkTable">
        <AddButton />
        <Table selectable basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>URL</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
              <Table.HeaderCell>Currently Used In</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{resurls}</Table.Body>
        </Table>
        {displayPagination}
      </div>
    );
  }
}
