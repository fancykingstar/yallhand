import React from "react"
import {inject, observer} from "mobx-react"
import { Segment, Header, Menu, Icon, Table, Modal } from "semantic-ui-react"
import { SearchBox } from "../SharedUI/SearchBox"
import _ from 'lodash'
import { giveMeKey } from "../SharedCalculations/GiveMeKey";


@inject("UIStore", "AccountStore", "PoliciesStore", "AnnouncementsStore", "ResourcesStore", "TeamStore")
@observer
export class PortalViews extends React.Component {
    render(){
        const {UIStore, AccountStore, PoliciesStore, AnnouncementsStore, ResourcesStore, TeamStore} = this.props

        const sort = (controller, direction) => {
            const param = controller === "toal"? "total_views" : "unique_views"
            if(direction === "Oldest") {
            AccountStore.loadAnalyticData(AccountStore.analyticData_portal.slice().sort((a,b) => (a[param] > b[param])? 1 : -1))
            }
            else {
                AccountStore.loadAnalyticData(AccountStore.analyticData_portal.slice().sort((a,b) => (a[param] < b[param])? 1 : -1))
                }
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

        const searchFilter = (all) => {
            const UItoLogKey={"announcements": "announcement", "faqs": "policy", "files":"file"}
            const result = all.slice().filter(log => log.type === UItoLogKey[UIStore.menuItem.analyticsHeader])
            if(UIStore.search.analyticsSearchValue === "") return result
            else return result.filter(i => getLabel(i).toLowerCase().includes(UIStore.search.analyticsSearchValue.toLowerCase()))
        }

        const templateHeader = (vari=false) =>    
        <Table.Header>
        <Table.Row>
            <Table.HeaderCell rowSpan='2'>Label</Table.HeaderCell>
            {vari?
            <Table.HeaderCell textAlign="center" rowSpan='2'>Audience</Table.HeaderCell>: null}
            <Table.HeaderCell textAlign="center" rowSpan='2'>Total Views {vari? null : <span> <Icon size="small" name="arrow up" onClick={e => sort("total_views", "Newest")}/> <Icon size="small" name="arrow down" onClick={e => sort("total_views", "Oldest")}/></span>} </Table.HeaderCell>
            <Table.HeaderCell textAlign="center" rowSpan='2'>Unique Views {vari? null : <span> <Icon size="small" name="arrow up" onClick={e => sort("unique_views", "Newest")}/> <Icon size="small" name="arrow down" onClick={e => sort("unique_views", "Oldest")}/></span>} </Table.HeaderCell>
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
                               <Table.Cell textAlign="center">{vari.sentiment[0]}</Table.Cell>
                               <Table.Cell textAlign="center">{vari.sentiment[1]}</Table.Cell>
                               <Table.Cell textAlign="center">{vari.sentiment[2]}</Table.Cell>
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
        
        const displayResults = searchFilter(AccountStore.analyticData_portal.slice()) 
        // .filter(log => getLabel(log) !== "obsoleted data")
        .map(log => 
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
           <div style={UIStore.responsive.isMobile? null : {float: 'right', paddingRight: 10,display: "inline-block"}}>     <SearchBox value={UIStore.search.analyticsSearchValue} output={val => UIStore.set("search", "analyticsSearchValue", val)}/></div>
     
           
            <Table basic="very">
            {templateHeader()}
            
            <Table.Body>
            {displayResults}
            </Table.Body>
            </Table>
            </React.Fragment>
  
          
        )
    }
}