import React from "react"
import {inject, observer} from "mobx-react"
import { Segment, Header, Menu, Icon, Table, Modal, Pagination, Button } from "semantic-ui-react"
import { SearchBox } from "../SharedUI/SearchBox"
import CsvDownloader from 'react-csv-downloader';
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import {SortingChevron} from "../SharedUI/SortingChevron";
import { PageSizeSelect } from "./PageSizeSelect";
import _ from 'lodash'

@inject("UIStore", "AccountStore", "PoliciesStore", "AnnouncementsStore", "ResourcesStore", "TeamStore")
@observer
export class PortalViews extends React.Component {
    constructor(props){
        super(props);
        this.state={width: 0, height: 0, data: [], sortsToggled:[], limit: 5, currentPage: 1 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        const {AccountStore} = this.props;
        this.setState({data: AccountStore.analyticData_portal})
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

    render(){
        const {UIStore, AccountStore, PoliciesStore, AnnouncementsStore, ResourcesStore, TeamStore} = this.props

        const searchFilter = (all) => {
            const UItoLogKey={"announcements": "announcement", "faqs": "policy", "files":"file"}
            const result = all.slice().filter(log => log.type === UItoLogKey[UIStore.menuItem.analyticsHeader])
            if(UIStore.search.analyticsSearchValue === "") return result
            else return result.filter(i => getLabel(i).toLowerCase().includes(UIStore.search.analyticsSearchValue.toLowerCase()))
        }

        const { currentPage, data, limit } = this.state;
        const totalPages = Math.ceil(searchFilter(data).length / limit);
        const items = searchFilter(data).slice(
          (currentPage - 1) * limit,
          (currentPage) * limit
        );

        const filteredData = searchFilter(data);

        const sort = (param) => {

            if (this.state.sortsToggled.includes(param)) this.setState({sortsToggled: this.state.sortsToggled.filter(i=>i !== param)});
            else (this.setState({sortsToggled: [...this.state.sortsToggled, ...[param]]}))
            if(this.state.sortsToggled.includes(param)) { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] > b[param])? 1 : -1) })}
            else { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] < b[param])? 1 : -1)}) }  
            }

            
        const getLabel = (data) => {
        let label = ""
           try {
           if(data.type === "announcement"){label = AnnouncementsStore._getAnnouncement(data.contentID).label}
           else if(data.type === "policy"){label = PoliciesStore._getPolicy(data.contentID).label}
           else if(data.type === "file"){label = ResourcesStore._getFile(data.contentID).label}
           }
           catch(error) {
               label = ""
           }
        //    else {return "No label available"}
           return label === "" || label === undefined? "obsoleted data" : label
        }

        const templateHeader = (vari=false) =>    
        <Table.Header>
        <Table.Row>
            <Table.HeaderCell rowSpan='2'>Label</Table.HeaderCell>
            {vari?
            <Table.HeaderCell textAlign="center" rowSpan='2'>Audience</Table.HeaderCell>: null}
            <Table.HeaderCell style={{whiteSpace:"nowrap"}} textAlign="center" rowSpan='2'>Total Views {vari? null : <span> <SortingChevron onClick={e => sort("total_views", e)}/></span>} </Table.HeaderCell>
            <Table.HeaderCell style={{whiteSpace:"nowrap"}} textAlign="center" rowSpan='2'>Unique Views {vari? null :  <span> <SortingChevron onClick={e => sort("unique", e)}/></span>} </Table.HeaderCell>
            {UIStore.menuItem.analyticsHeader === "announcements" || UIStore.menuItem.analyticsHeader === "faqs"?
            <Table.HeaderCell textAlign="center"colSpan='3' textAlign="center">Feedback</Table.HeaderCell>: null}
        </Table.Row>
        {UIStore.menuItem.analyticsHeader === "announcements" || UIStore.menuItem.analyticsHeader === "faqs"?
        <Table.Row>
            <Table.HeaderCell textAlign="center"><Icon style={{paddingLeft:8}} name='smile outline' /></Table.HeaderCell>
            <Table.HeaderCell textAlign="center"><Icon  style={{paddingLeft:5}} name='meh outline' /></Table.HeaderCell>
            <Table.HeaderCell textAlign="center"><Icon style={{paddingLeft:3}} name='frown outline' /></Table.HeaderCell>
        </Table.Row>: null}
        </Table.Header>


        const rawlogs = AccountStore.logs.slice()

            const variData = (log) => {
                const content = log.type === "policy"? PoliciesStore._getPolicy(log.contentID) : AnnouncementsStore._getAnnouncement(log.contentID)
                const variation = (variID) => content.variations.filter(i => i.variationID === variID)
                const displayTeamTag = (variID) => {
                    const teamLabel = variation(variID)[0].teamID === "global"? "Global (all teams)" : TeamStore._getTeam(variation(variID)[0].teamID).label
                    const tagLabel = variation(variID)[0].tags.length === 0? "No Tags" : TeamStore._getTag(variation(variID)[0].tags[0]).label
                    return (`${teamLabel} / ${tagLabel}`)
                    // return "Global"
                }
                const getContentLabel = (variID) => {
                    return variation(variID)[0].label === ""? content.label : variation(variID)[0].label
                }

                return log.variations
                    .map(vari => 
                    <Table.Row key={"analyticsResult" + giveMeKey()}>
                     <Table.Cell>{getContentLabel(vari.variationID)}</Table.Cell>
                    <Table.Cell textAlign="center">{displayTeamTag(vari.variationID)}</Table.Cell>
                    <Table.Cell textAlign="center">{vari.total_views}</Table.Cell>
                    <Table.Cell textAlign="center">{vari.unique_views}</Table.Cell>
                    {UIStore.menuItem.analyticsHeader === "announcements" || UIStore.menuItem.analyticsHeader === "faqs"?
                             <React.Fragment>
                               <Table.Cell textAlign="center">{vari.sentiment[2]}</Table.Cell>
                               <Table.Cell textAlign="center">{vari.sentiment[1]}</Table.Cell>
                               <Table.Cell textAlign="center">{vari.sentiment[0]}</Table.Cell>
                               </React.Fragment>
                                : null }
                    </Table.Row>
                ) }
            const varis = (log) => {
                return log.variations.length === 1? 
                <Table.Cell>{getLabel(log)}</Table.Cell>
                :
                <Modal size="small"
                trigger={
                <Table.Cell style={{color: "#2185d0", cursor: "pointer"}}>{getLabel(log)}</Table.Cell>
            }
                >
                    <Modal.Content>
                    <Header as="h3">{getLabel(log)}</Header>
                    <Table basic="very" >
                     {templateHeader(true)}
                     <Table.Body>
                     {variData(log)}
                     </Table.Body>
                     </Table>
                    </Modal.Content>
                </Modal>
            }
        
        const displayResults = searchFilter(items) 
          .map(log => {
            return (
              <Table.Row key={"analyticsResult" + giveMeKey()}>
               {varis(log)}
                <Table.Cell textAlign="center">{log.total_views}</Table.Cell>
                <Table.Cell textAlign="center">{log.unique_views}</Table.Cell>
                {UIStore.menuItem.analyticsHeader === "announcements" || UIStore.menuItem.analyticsHeader === "faqs"?
                             <React.Fragment>
                               <Table.Cell textAlign="center">{log.sentiment_total[2]}</Table.Cell>
                               <Table.Cell textAlign="center">{log.sentiment_total[1]}</Table.Cell>
                               <Table.Cell textAlign="center">{log.sentiment_total[0]}</Table.Cell>
                               </React.Fragment>
                                : null }
              </Table.Row>
            )
          })

        const download = filteredData.map(camp => {   
          return {
            "Label": getLabel(camp),
            "Total Views": camp.total_views,
            "Unique Views": camp.unique_views,
            "Smile": camp.sentiment_total[2],
            "meh": camp.sentiment_total[1],
            "frown": camp.sentiment_total[0]
          }
        });


        return(
            <React.Fragment>
            <Header
            as="h2"
            content="User Portal Content Performance"
          />
           <div style={{display: "inline-block"}}>
           <Menu text secondary>
            <Menu.Item
              color="blue"
              name='announcements'
              active={UIStore.menuItem.analyticsHeader === "announcements"}
              onClick={e => UIStore.set("menuItem", "analyticsHeader", "announcements")}
            />
             <Menu.Item
             color="blue"
              name={`faqs`}
              active={UIStore.menuItem.analyticsHeader === "faqs"}
              onClick={e => UIStore.set("menuItem", "analyticsHeader", "faqs")}
            />
               {/* <Menu.Item
               color="blue"
              name='Files'
              active={UIStore.menuItem.analyticsHeader === "files"}
              onClick={e => UIStore.set("menuItem", "analyticsHeader", "files")}
            /> */}
      
            </Menu>
           </div>
           <div style={UIStore.responsive.isMobile? {display: 'flex'} : {float: 'right', paddingRight: 10,display: "flex"}}>
              <CsvDownloader datas={download} text="DOWNLOAD" filename="myfile">
                <Button primary>export CSV</Button>
              </CsvDownloader>
              <SearchBox value={UIStore.search.analyticsSearchValue} output={val => UIStore.set("search", "analyticsSearchValue", val)}/>
            </div>
            <br/>
            {
              this.state.width > 767? <PageSizeSelect 
                limit={limit}
                onChangeLimit={this.onChangeLimit} 
              />: <div />
            }
            <Table basic="very" style={this.state.width < 768 ? { display: 'none' }: { display: 'inline-block' }}>
            {templateHeader()}
            
            <Table.Body>
            {displayResults}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell style={{border: 'none'}}>
                  <Pagination 
                    activePage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={this.onChangePage} 
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    boundaryRange={0}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
            </Table>
            </React.Fragment>
  
          
        )
    }
}