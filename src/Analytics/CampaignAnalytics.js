import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header, Button, Modal,Icon} from "semantic-ui-react";
import { SearchBox } from "../SharedUI/SearchBox"
import { CampaignDetails } from "../SharedUI/CampaignDetails";

@inject("AccountStore", "EmailStore", "TeamStore", "UIStore")
@observer
export class CampaignAnalytics extends React.Component {
  constructor(props){
    super(props)
    const {AccountStore} = this.props
    this.clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
    this.sort = (controller, direction) => {
      const param = controller
      if(direction === "Lowest") {
        if(param === "clicks") AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (this.clickRate(a) > this.clickRate(b)? 1 : -1)))
        else AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (a[param] > b[param])? 1 : -1))
      }


      else {
        if(param === "clicks") AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (this.clickRate(a) < this.clickRate(b)? 1 : -1)))
        else AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (a[param] < b[param])? 1 : -1))
          }
  }
  }
  componentDidMount(){
    this.sort("sent", "Highest")
  }
  render() {
    const {AccountStore, EmailStore, TeamStore, UIStore} = this.props


    

    const searchFilter = (all) => {
      if(UIStore.search.campaignsSearchValue === "") return all
      else return all.filter(i => i.subject.toLowerCase().includes(UIStore.search.campaignsSearchValue.toLowerCase()))
  }


    const outbounds = searchFilter(AccountStore.analyticData_campaigns).map(camp => {
      const campaign = EmailStore._getCampaign(camp.campaignID)

      if(!campaign) return null
      return (
        <Table.Row disabled={!camp.completed? EmailStore._getCampaign(camp.campaignID).isTriggered? false:true : false} key={"camp" + giveMeKey()}>
          <Table.Cell>
            <Header>
              <Header.Content>
              {camp.subject}
              </Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{UTCtoFriendly(camp.sent)}</Table.Cell>
          <Table.Cell>{`${camp.total_views}/${camp.unique_views}`}</Table.Cell>
          <Table.Cell>{camp.open_rate}%</Table.Cell>
          <Table.Cell>{this.clickRate(camp)}%</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell> 
                    {CampaignDetails(campaign)}
            </Table.Cell>
          </Table.Row>
        )
      })

    return (
      <div>
        <Header
          as="h2"
          content="Email Campaign Performance"
        />
                   <div style={UIStore.responsive.isMobile? null : {float: 'right', paddingRight: 10, paddingBottom: 15,display: "inline-block"}}>     <SearchBox value={UIStore.search.campaignsSearchValue} output={val => UIStore.set("search", "campaignsSearchValue", val)}/></div>
     
          <Table padded="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell rowSpan='2'>Name</Table.HeaderCell>
                <Table.HeaderCell>Sent <br/><span> <Icon size="small" name="arrow up" onClick={e => this.sort("sent", "Highest")}/> <Icon size="small" name="arrow down" onClick={e => this.sort("sent", "Lowest")}/></span></Table.HeaderCell>
                <Table.HeaderCell>Views (All/Unique) <br/><span> <Icon size="small" name="arrow up" onClick={e => this.sort("total_views", "Highest")}/> <Icon size="small" name="arrow down" onClick={e => this.sort("total_views", "Lowest")}/></span></Table.HeaderCell>
                <Table.HeaderCell>Open Rate <br/><span> <Icon size="small" name="arrow up" onClick={e => this.sort("open_rate", "Highest")}/> <Icon size="small" name="arrow down" onClick={e => this.sort("open_rate", "Lowest")}/></span></Table.HeaderCell>
                <Table.HeaderCell>Click Rate <br/><span> <Icon size="small" name="arrow up" onClick={e => this.sort("clicks", "Highest")}/> <Icon size="small" name="arrow down" onClick={e => this.sort("clicks", "Lowest")}/></span></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
                {outbounds}
            </Table.Body>
          </Table>

   
       
      </div>
    );
  }
}
