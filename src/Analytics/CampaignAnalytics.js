import React from "react";
import {inject, observer} from "mobx-react"
import CsvDownloader from 'react-csv-downloader';
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header, Icon, Pagination, Button } from "semantic-ui-react";
import { SearchBox } from "../SharedUI/SearchBox"
import {SortingChevron} from "../SharedUI/SortingChevron";
import { CampaignDetails } from "../SharedUI/CampaignDetails";
import { PageSizeSelect } from "./PageSizeSelect";
import moment from 'moment';


@inject("AccountStore", "EmailStore", "TeamStore", "UIStore")
@observer
export class CampaignAnalytics extends React.Component {
  constructor(props){
    super(props)
    this.state={ width: 0, height: 0, data: [], sortsToggled:[], limit: 25, currentPage: 1 };
    this.clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
 
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
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    const {AccountStore} = this.props;
    this.setState({data: AccountStore.analyticData_campaigns})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  onChangeLimit = (event, data) => {
    if (data.value !== this.state.limit) {
      this.setState({limit: data.value, currentPage: 1});
    }
  }

  onChangePage = (event, data) => {
    const { activePage } = data;
    if (activePage !== this.state.currentPage) {
      this.setState({currentPage: activePage})
    }
  };

  render() {
    const {AccountStore, EmailStore, UIStore} = this.props
    const { currentPage, data, limit } = this.state;
    const { width } = this.state;
    let items = [];

    const searchFilter = (all) => {
      if(UIStore.search.campaignsSearchValue === "") return all
      else return all.filter(i => i.subject.toLowerCase().includes(UIStore.search.campaignsSearchValue.toLowerCase()))
    }

    const filteredData = searchFilter(data).filter(camp => {
      const campaign = EmailStore._getCampaign(camp.campaignID)
      if (campaign) return camp;
    });

    const totalPages = Math.ceil(filteredData.length / limit);
    items = filteredData.slice(
      (currentPage - 1) * limit,
      (currentPage) * limit
    );

    const sort = (param) => {
      if (this.state.sortsToggled.includes(param)) this.setState({sortsToggled: this.state.sortsToggled.filter(i=>i !== param)});
      else (this.setState({sortsToggled: [...this.state.sortsToggled, ...[param]]}))
      if(this.state.sortsToggled.includes(param)) { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] > b[param])? 1 : -1) })}
      else { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] < b[param])? 1 : -1)}) }
    }

    const download = filteredData.map(camp => {
      return {
        "Name": camp.subject,
        "Sent": `"${UTCtoFriendly(camp.sent)}"`,
        "Views(All/Unique)": camp.total_views + "/" + camp.unique_views,
        "Open Rate": camp.open_rate + "%",
        "Click Rate": this.clickRate(camp) + "%"
      }
    });

    const outbounds = items.map(camp => {
      const campaign = EmailStore._getCampaign(camp.campaignID)

      if(!campaign) {
        return null
      }

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
          <div style={UIStore.responsive.isMobile? { display: 'flex' } : {float: 'right', paddingRight: 10, paddingBottom: 15,display: "flex"}}>
            <CsvDownloader datas={download} text="DOWNLOAD" filename={"Campaign-" + moment().format('MMDDYY')}>
              <Button primary>export CSV</Button>
            </CsvDownloader>
            <SearchBox value={UIStore.search.campaignsSearchValue} output={val => UIStore.set("search", "campaignsSearchValue", val)}/>
          </div>
          {
            width > 767 ? <PageSizeSelect 
                            limit={limit}
                            onChangeLimit={this.onChangeLimit}
                          />: <div />
          }
          <Table basic="very"   >
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
          <Table>
            <Table.Row>
              <Table.HeaderCell className="center" style={{ border: 'none', textAlign: "center" }}>
                { 
                  totalPages > 1 ?
                  <Pagination 
                    activePage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={this.onChangePage} 
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    boundaryRange={0}
                  /> : <div />
                }
              </Table.HeaderCell>
            </Table.Row>
          </Table>
      </div>
    );
  }
}
