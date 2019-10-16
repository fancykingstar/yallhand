import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header,Icon} from "semantic-ui-react";
import { SearchBox } from "../SharedUI/SearchBox"
import {SortingChevron} from "../SharedUI/SortingChevron";
import { CampaignDetails } from "../SharedUI/CampaignDetails";

@inject("AccountStore", "EmailStore", "TeamStore", "UIStore")
@observer
export class CampaignAnalytics extends React.Component {
  constructor(props){
    super(props)
    this.state={data: [], sortsToggled:[]};
    this.clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
    
 
    // this.sort = (controller, direction) => {
    //   const param = controller
    //   if(direction === "Lowest") {
    //     if(param === "clicks") AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (this.clickRate(a) > this.clickRate(b)? 1 : -1)))
    //     else AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (a[param] > b[param])? 1 : -1))
    //   }


  //     else {
  //       if(param === "clicks") AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (this.clickRate(a) < this.clickRate(b)? 1 : -1)))
  //       else AccountStore.loadAnalyticData_campaigns(AccountStore.analyticData_campaigns.slice().sort((a,b) => (a[param] < b[param])? 1 : -1))
  //         }
  // }
  }
  componentDidMount(){
    const {AccountStore} = this.props;
    this.setState({data: AccountStore.analyticData_campaigns})
}
  render() {
    const {AccountStore, EmailStore, UIStore} = this.props


    const sort = (param) => {
      if (this.state.sortsToggled.includes(param)) this.setState({sortsToggled: this.state.sortsToggled.filter(i=>i !== param)});
      else (this.setState({sortsToggled: [...this.state.sortsToggled, ...[param]]}))
      if(this.state.sortsToggled.includes(param)) { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] > b[param])? 1 : -1) })}
      else { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] < b[param])? 1 : -1)}) }  
      }


    const searchFilter = (all) => {
      if(UIStore.search.campaignsSearchValue === "") return all
      else return all.filter(i => i.subject.toLowerCase().includes(UIStore.search.campaignsSearchValue.toLowerCase()))
  }


    const outbounds = searchFilter(this.state.data).map(camp => {
      const campaign = EmailStore._getCampaign(camp.campaignID)

      if(!campaign) return null
      return (
        <Table.Row key={"camp" + giveMeKey()}>
          <Table.Cell style={{fontSize: "1em !important" , fontFamily: "Rubik, sans-serif" }}  disabled={!camp.completed? EmailStore._getCampaign(camp.campaignID).isTriggered? false:true : false}>
              {camp.subject}
          </Table.Cell>
          <Table.Cell disabled={!camp.completed? EmailStore._getCampaign(camp.campaignID).isTriggered? false:true : false}>{UTCtoFriendly(camp.sent)}</Table.Cell>
          <Table.Cell disabled={!camp.completed? EmailStore._getCampaign(camp.campaignID).isTriggered? false:true : false}>{`${camp.total_views}/${camp.unique_views}`}</Table.Cell>
          <Table.Cell disabled={!camp.completed? EmailStore._getCampaign(camp.campaignID).isTriggered? false:true : false}>{camp.open_rate}%</Table.Cell>
          <Table.Cell disabled={!camp.completed? EmailStore._getCampaign(camp.campaignID).isTriggered? false:true : false}>{this.clickRate(camp)}%</Table.Cell>
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
     
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell><div style={{paddingBottom: 20}}>Name</div></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Sent<span> <SortingChevron onClick={e => sort("sent", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Views (All/Unique)<span> <SortingChevron onClick={e => sort("total_views", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Open Rate <span> <SortingChevron onClick={e => sort("open_rate", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Click Rate<span> <SortingChevron onClick={e => sort("clicks", e)}/></span></Table.HeaderCell>
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
