import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { Pagination, Table } from "semantic-ui-react";
import { AddButton } from "../SharedUI/AddButton"
import { ConfigPagination, PageIndicies } from "../SharedCalculations/Pagination";



export const AutomationList = inject("AutomationsStore")(observer((props) => {



  const {AutomationsStore} = props
  const handlePageChange = (e, { activePage }) => {
    AutomationsStore.makeActive(activePage)

  };
  const openEditor = info => {
   
    AutomationsStore.selectAutomation(info)
    AutomationsStore.setModal(true)
  };
  const handleClose = () => AutomationsStore.setModal(false);

  const addCommas = (fullList) => {
         const types = ['template', 'custom', 'anonymous']
         const list = []
         types.forEach(function(type){
             if (type in fullList) {list.push(...fullList[type])}
         })
         console.log(list)
         const listDisplay = list.length > 1 ? list.join(', ') : list
         return listDisplay
  }

    const userData = props.list === 'public' ? AutomationsStore.publicAutos : AutomationsStore.privateAutos

    const paginationData = ConfigPagination(userData.length);
    const displayPagination = paginationData.usePagination ? (
      <div style={{ textAlign: "center" }}>
        <Pagination
          defaultActivePage={1}
          totalPages={paginationData.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    ) : null;

    const newIndicies = PageIndicies(AutomationsStore.active, userData.length);
    const currentPage = paginationData.usePagination ? userData.slice(newIndicies.start, newIndicies.end) : userData;
    const Autos = currentPage.map(auto => (
      <Table.Row onClick={() => openEditor(auto)}>
    
        <Table.Cell > {auto.label}</Table.Cell>
        <Table.Cell>{addCommas(auto.capture)}</Table.Cell>
        {/* <Table.Cell >{auto.capture.template}{auto.capture.custom}</Table.Cell> */}
        <Table.Cell >{auto.action}</Table.Cell>
        <Table.Cell >{auto.endpoint.join(', ')}</Table.Cell>
        <Table.Cell >{UTCtoFriendly(auto.updated)}</Table.Cell>
        <Table.Cell>{auto.admin.displayName}</Table.Cell>
      </Table.Row>
    ));

    // {
    //     "accountID": "A1",
    //     "automationID": "auto1",
    //     "label": "Contact HR",
    //     "action": "email",
    //     "endpoint": ["mark@aubry.ai"],
    //     "capture": [{"template": ["email", "username", "channel", "query", "team"]}, {"custom": ["good time to contact?"]}],
    //     "policyID": ["P5"],
    //     "updated": "1538147254",
    //     "public": true,
    //     "admin": {"adminID": "adminID", "displayName": "Mark Z."}
    // },



    return (
      <div className="LinkTable">
      <AddButton/>
        <Table selectable basic="very">
          <Table.Header>
            <Table.Row>
            <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Capture Info</Table.HeaderCell>
              <Table.HeaderCell >Action</Table.HeaderCell>
              <Table.HeaderCell>Destination</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
              <Table.HeaderCell>Updated by</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{Autos}</Table.Body>
        </Table>
        {displayPagination}

      </div>
    );
  }
));

