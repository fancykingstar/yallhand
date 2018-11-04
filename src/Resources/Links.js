import React from "react";
import "./style.css";
import { Table } from "semantic-ui-react";
import { AddButton } from "../SharedUI/AddButton";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
// import { ConfigPagination, PageIndicies } from "../SharedCalculations/Pagination";

export const Links = inject("ResourcesStore", "PoliciesStore")(observer((props) => {


    const {ResourcesStore} = props
    const {PoliciesStore} = props
    const userData = ResourcesStore.urlResources

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

    const resurls = userData.map(resurl => (
      <Table.Row onClick={() => this.openEditor(resurl)} key={resurl.label}>
        <Table.Cell> {resurl.label}</Table.Cell>
        <Table.Cell>
          <a href={resurl.url} target="_blank">
            {resurl.url}
          </a>
        </Table.Cell>
        <Table.Cell>{UTCtoFriendly(resurl.updated)}</Table.Cell>
        <Table.Cell>{PoliciesStore.variationsToPolicies(resurl.variationID)}</Table.Cell>
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
        {/* {displayPagination} */}
      </div>
    );
  
}))
