import React from "react";
import {inject, observer} from "mobx-react"
import { Header, Segment, Form, Icon, Table, Loader } from "semantic-ui-react";
import { api_get } from "./Down"
import { CSVLink, CSVDownload } from "react-csv";
import _ from "lodash";
const moment = require('moment')

@inject("DataEntryStore")
@observer
export class Analytics extends React.Component {
constructor(props){
    super(props)
    this.state={
        loading: false   
    }
}
  render() {
    const {DataEntryStore} = this.props

    const actionOptions = () => 
      [...[{"text":"All","value":"all"}], 
      ..._.uniqBy(DataEntryStore.superAdmin.analyticsLogs, 'event').map(i => ({"text": i.event, "value": i.event}))]
      
    const accountSelect = this.props.accounts.slice()
    accountSelect.unshift({"text": "All", "value": "all"})
    
    const typeOptions = [{"text": "view", "value":"view"},{"text": "action", "value":"action"},{"text": "view & action", "value":"both"}]
    
    const filterData = () => {
        let filteredData = DataEntryStore.superAdmin.analyticsLogs.slice()
        if(DataEntryStore.superAdmin.analyticsAccount !== "all"){ 
            filteredData = filteredData.filter(i => i.accountID === DataEntryStore.superAdmin.analyticsAccount) 
        }
        if(DataEntryStore.superAdmin.analyticsSource !== "all") {
              filteredData = filteredData.filter(i => DataEntryStore.superAdmin.analyticsSource === 'portal'? !i.campaignID: i.campaignID !== undefined)
          }
        if(DataEntryStore.superAdmin.analyticsType !== "both") {
            filteredData = filteredData.filter(i => i.isAction === (DataEntryStore.superAdmin.analyticsType === "action"))
        }
        if(DataEntryStore.superAdmin.analyticsAction !== "all") {
            filteredData = filteredData.filter(i => i.event === DataEntryStore.superAdmin.analyticsAction || i.type === DataEntryStore.superAdmin.analyticsAction)
        }
        if(DataEntryStore.superAdmin.analyticsSort === "old"){
            filteredData = filteredData.sort((a,b) => (a.updated > b.updated)? 1 : -1)
        }
        if(DataEntryStore.superAdmin.analyticsSort === "new") {
            filteredData = filteredData.sort((a,b) => (a.updated < b.updated)? 1 : -1) 
        }
        DataEntryStore.set("superAdmin", "analyticsCurrentDisplay", filteredData)
  }


    const displayData = () => {
        if(DataEntryStore.superAdmin.analyticsLogs.length !== 0){
            filterData()
        }
        else{
            DataEntryStore.set("superAdmin", "analyticsLoading", true)
            api_get(`itslogs/${DataEntryStore.superAdmin.analyticsAccount}`)
            .then((response) => {
                DataEntryStore.set("superAdmin", "analyticsLogs", response.data)
                DataEntryStore.set("superAdmin", "analyticsLoading", false)
                filterData()
            })
            .catch((error) => {
                console.log(error)
                DataEntryStore.set("superAdmin", "analyticsLoading", false)
        })
    }}
    const results = DataEntryStore.superAdmin.analyticsCurrentDisplay.length === 0? null :
    DataEntryStore.superAdmin.analyticsCurrentDisplay
    // .filter(i=> i.data !== undefined)
    .map(i => 
        <Table.Row key={i.logID}>
            <Table.Cell>{this.props.accounts.filter(x => x.value === i.accountID)[0].text}</Table.Cell>
            <Table.Cell>{moment(i.updated).format('LLL')}</Table.Cell>
            <Table.Cell>{i.isAction? "Action" : "View"}</Table.Cell>
            <Table.Cell>{i.isAction? 
                  i.type + " " + (!i.event? "":i.event)
                  : 
                  `${i.type} ${i.logID} ${!i.variationID?"":" / " + i.variationID}`
                  }</Table.Cell>
        </Table.Row>
        )
    return (
      <div style={{overflowY: "auto"}}>
        <Header inverted floated="left">
          Analytics
        </Header>
        <br />
        <Segment inverted>
        <Icon name="filter" size="sm"/>
          <Form inverted>
            <Form.Group>
              <Form.Select label="Account" value={DataEntryStore.superAdmin.analyticsAccount} options={accountSelect} onChange={(e, val) => DataEntryStore.set("superAdmin", "analyticsAccount", val.value)} />
              <Form.Select label="Source" value={DataEntryStore.superAdmin.analyticsSource} options={[{"text":"All", "value":"all"},{"text":"email", "value":"email"},{"text":"portal", "value":"portal"}]} onChange={(e, val) => DataEntryStore.set("superAdmin", "analyticsSource", val.value)} />
              <Form.Select value={DataEntryStore.superAdmin.analyticsType} label="Type" options={typeOptions} onChange={(e, val) => DataEntryStore.set("superAdmin", "analyticsType", val.value)} />
              <Form.Select disabled={DataEntryStore.superAdmin.analyticsType !== "action"} label="Action" value={DataEntryStore.superAdmin.analyticsAction} options={[...[{"text": "", "value": ""}], ...actionOptions()]} onChange={(e, val) => DataEntryStore.set("superAdmin", "analyticsAction", val.value)}/>
              <Form.Select label="Sort by" value={DataEntryStore.superAdmin.analyticsSort} options={[{"text": "newest", "value": "new"}, {"text": "oldest", "value": "old"}]} onChange={(e, val) => DataEntryStore.set("superAdmin", "analyticsSort", val.value)}/>
              <Form.Button style={{marginTop: 23}} inverted onClick={e => displayData()}>Display</Form.Button>
              <Form.Field/>
            </Form.Group>
          </Form>
        </Segment>
        <Loader inverted active={DataEntryStore.superAdmin.analyticsLoading} size="large"/>
        <Segment inverted disabled={DataEntryStore.superAdmin.analyticsLoading}>
<div style={{paddingBottom: 10}}>
<div style={{float: "left"}}>
<span>{`Displaying ${DataEntryStore.superAdmin.analyticsCurrentDisplay.length} of ${DataEntryStore.superAdmin.analyticsLogs.length} total records`}</span>
</div>
<div style={{float: "right"}}>
<CSVLink
  data={DataEntryStore.superAdmin.analyticsCurrentDisplay}
  separator={";"}
  headers={[
    { label: 'LogID', key: 'logID'},
    { label: 'accountID', key: 'accountID'},
    { label: 'userID', key: 'userID' },
    { label: 'Time Date', key: 'updated' },
    { label: 'is Action', key: 'isAction' },
    { label: 'Type', key: 'data.type' },
    { label: 'Event', key: 'data.event' }
  ]}
  filename={"yhands-data-output.csv"}
  target="_blank"
>
  {DataEntryStore.superAdmin.analyticsCurrentDisplay.length === 0? "" : "Download CSV"}
</CSVLink>
</div>
</div>
            

                <Table inverted celled striped>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Account</Table.HeaderCell>
                <Table.HeaderCell>Date Time</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Data</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
                {results}
            </Table.Body>
            </Table>
       </Segment>
      </div>
    );
  }
}
