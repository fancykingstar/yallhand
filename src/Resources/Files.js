import React from "react";
import "./style.css";
import {inject, observer} from "mobx-react"
import { FileTypeIcons } from "../SharedUI/FileTypeIcons"
import { AddButton } from "../SharedUI/AddButton"
import { Icon, Pagination, Table } from "semantic-ui-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
// import { UserPagination, PageIndicies } from "../Teams/UserPagination";




export const Files = inject("ResourcesStore", "PoliciesStore")(observer((props) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     active: 1,
  //     selectedUser: {},
  //     modal: false
  //   };
  // }

  const {PoliciesStore} = props
  const {ResourcesStore} = props

  // handlePageChange = (e, { activePage }) => {
  //   this.setState({ active: activePage });
  // };
  // openEditor = info => {
  //   this.setState({ selectedUser: info, modal: true });
  // };
  // handleClose = () => this.setState({ modal: false });
  const getIcon = (filetype) => {return FileTypeIcons[filetype] }

    // const userProfile = this.props.profileData
    // const modalPassed = this.props.open

    const userData = ResourcesStore.fileResources;

    // const paginationData = UserPagination(userData.length);
    // const displayPagination = paginationData.usePagination ? (
    //   <div style={{ textAlign: "center" }}>
    //     <Pagination
    //       defaultActivePage={1}
    //       totalPages={paginationData.totalPages}
    //       onPageChange={this.handlePageChange}
    //     />
    //   </div>
    // ) : null;

    // const newIndicies = PageIndicies(this.state.active, userData.length);
    // const currentPage = userData.slice(newIndicies.start, newIndicies.end);

    const resfiles = userData.map(resfile => (
      <Table.Row onClick={() => this.openEditor(resfile)} key={resfile.label}>
    
    <Table.Cell collapsing>
          <Icon name={getIcon(resfile.type)} />
          {resfile.label}
        </Table.Cell>
        <Table.Cell >{resfile.size}</Table.Cell>
        <Table.Cell >{UTCtoFriendly(resfile.updated)}</Table.Cell>
        <Table.Cell >{resfile.admin.displayName}</Table.Cell>
        <Table.Cell>{PoliciesStore.variationsToPolicies(resfile.variationID)}</Table.Cell>
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
        {/* {displayPagination} */}
        {/* <UserEdit
          profileData={this.state.selectedUser}
          open={this.state.modal}
          close={this.handleClose}
        /> */}
      </div>
    );
  }
))
