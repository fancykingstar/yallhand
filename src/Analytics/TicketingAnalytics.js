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
import prettyMilliseconds from 'pretty-ms';
import percentage from 'percentage';



@inject("AccountStore", "EmailStore", "TeamStore", "UIStore")
@observer
export class TicketingAnalytics extends React.Component {
  constructor(props){
    super(props)
    this.state={ width: 0, height: 0, data: [], sortsToggled:[], limit: 25, currentPage: 1 };
    this.clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    const {AccountStore} = this.props;
    this.setState({data: AccountStore.analyticData_ticketing})
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
    const {UIStore} = this.props
    const { currentPage, data, limit } = this.state;
    const { width } = this.state;
    let items = [];

    const searchFilter = (all) => {
      if(UIStore.search.ticketingSearchValue === "") return all
      else return all.filter(i => i.label.toLowerCase().includes(UIStore.search.ticketingSearchValue.toLowerCase()))
    }

    const filteredData = searchFilter(data)

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

    const download = filteredData.map(ticket => {
      return {
        "Name": ticket.label,
        "Last Created": `"${!ticket.lastCreated? "Never": UTCtoFriendly(ticket.lastCreated)}"`,
        "Count": ticket.count,
        "Open Rate": percentage(ticket.accepted),
        "Click Rate": prettyMilliseconds(ticket.duration, {compact: true})
      }
    });

    const outbounds = items.map(ticket => {


      return (
        <Table.Row key={"camp" + giveMeKey()}>
          <Table.Cell style={{fontSize: "1em !important" , fontFamily: "Rubik, sans-serif" }}>
              {ticket.label}
          </Table.Cell>
      <Table.Cell>{!ticket.lastCreated? "Never": UTCtoFriendly(ticket.lastCreated)}</Table.Cell>
      <Table.Cell>{ticket.count}</Table.Cell>
      <Table.Cell>{percentage(ticket.accepted)}</Table.Cell>
      <Table.Cell>{prettyMilliseconds(ticket.duration, {compact: true})}</Table.Cell>
          <Table.Cell></Table.Cell>
        
        </Table.Row>
      )
    })

    return (
      <div>
        <Header
          as="h2"
          content="Service Desk Performance"
        />
          <div style={UIStore.responsive.isMobile? { display: 'flex' } : {float: 'right', paddingRight: 10, paddingBottom: 15,display: "flex"}}>
            <CsvDownloader datas={download} text="DOWNLOAD" filename={"ServiceDesk-" + moment().format('MMDDYY')}>
              <Button primary>export CSV</Button>
            </CsvDownloader>
            <SearchBox value={UIStore.search.ticketingSearchValue} output={val => UIStore.set("search", "ticketingSearchValue", val)}/>
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
                <Table.HeaderCell><div style={{paddingBottom: 20}}>Template Name</div></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Last Ticket Created<span> <SortingChevron onClick={e => sort("lastCreated", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Count Total<span> <SortingChevron onClick={e => sort("count", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Acceptance Rate<span> <SortingChevron onClick={e => sort("accepted", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Open Duration<span> <SortingChevron onClick={e => sort("duration", e)}/></span></Table.HeaderCell>
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
      
                { 
                  totalPages > 1 ?
                  <Table.HeaderCell className="center" style={{ border: 'none', textAlign: "center" }}>
                  <Pagination 
                    activePage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={this.onChangePage} 
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    boundaryRange={0}
                  />  </Table.HeaderCell> : <div />
                }
             
            </Table.Row>
          </Table>
      </div>
    );
  }
}
