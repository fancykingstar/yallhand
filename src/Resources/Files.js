import React from "react";
import "./style.css";
import { FileTypeIcons } from "../SharedUI/FileTypeIcons"
import { AddButton } from "../SharedUI/AddButton"
import { Icon, Pagination, Table } from "semantic-ui-react";
import { UserPagination, PageIndicies } from "../Teams/UserPagination";



const MockFiles = [
  {
    label: "Social Media Policy",
    size: "1.5 MB",
    type: "doc",
    last_updated: "05/23/2017",
    updated_by: "Elaine B.",
    active: ["Where is the handbook?","Where is the handbook?","Where is the handbook?","Where is the handbook?"]
  },
  {
    label: "Severance Form",
    size: "2.5 MB",
    type: "pdf",
    last_updated: "05/23/2017",
    updated_by: "Kramer K.",
    active: ["Where is the handbook?"]
  },
  {
    label: "company handbook",
    size: "7.5 MB",
    type: "pdf",
    last_updated: "05/23/2017",
    updated_by: "George C.",
    active: ["Where is the handbook?"]
  }
];

export class Files extends React.Component {
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
  getIcon = (filetype) => {return FileTypeIcons[filetype] }
  render() {
    // const userProfile = this.props.profileData
    // const modalPassed = this.props.open

    const userData = MockFiles;

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

    const resfiles = currentPage.map(resfile => (
      <Table.Row onClick={() => this.openEditor(resfile)} key={resfile.label}>
    
    <Table.Cell collapsing>
          <Icon name={this.getIcon(resfile.type)} />
          {resfile.label}
        </Table.Cell>
        <Table.Cell >{resfile.size}</Table.Cell>
        <Table.Cell >{resfile.last_updated}</Table.Cell>
        <Table.Cell >{resfile.updated_by}</Table.Cell>
        <Table.Cell>{resfile.active}</Table.Cell>
      </Table.Row>
    ));

    return (
      <div className="LinkTable">
      <AddButton/>
        <Table selectable basic="very">
          <Table.Header>
            <Table.Row>
            <Table.HeaderCell>Label</Table.HeaderCell>
            <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell >Last Updated</Table.HeaderCell>
              <Table.HeaderCell >Uploaded By</Table.HeaderCell>
              <Table.HeaderCell>Currently Used In</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{resfiles}</Table.Body>
        </Table>
        {displayPagination}
        {/* <UserEdit
          profileData={this.state.selectedUser}
          open={this.state.modal}
          close={this.handleClose}
        /> */}
      </div>
    );
  }
}
