import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer} from "mobx-react";
import { Header, Dropdown, Menu, DropdownMenu, Search, Icon } from "semantic-ui-react";
import { Paper, 
} from "@material-ui/core";
import { 
  Col, Row, 
} from "reactstrap";



import { uniq, isEmpty } from "lodash";
import { getInitials } from "../SharedCalculations/GetInitials";
import TicketDetailsFrame from "./TicketDetailsFrame";
import QnADetailsFrame from "./QnADetailsFrame";

import { UserStore } from "../Stores/UserStore";
// import { TicketingStore } from "../Stores/TicketingStore";
import { AccountStore } from "../Stores/AccountStore";
import { PoliciesStore } from "../Stores/PoliciesStore";
import { AnnouncementsStore } from "../Stores/AnnouncementsStore";

import InboxList from "./InboxList";

import {debounce} from "lodash";


@inject("TicketingStore")
@observer
class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: null, filter: "recent", sort: "new", searchBy: "", searching: false, search_results: {}, search_val: ""} ;
    this.filterRef = React.createRef();
    this.openFilter = this.openFilter.bind(this);
  }

handleResultSelect(e, {result}){
  const searchBy = Object.assign({}, result);
    this.setState({searchBy})
}

openFilter(){
  this.filterRef.current.open();
}

 updateState(obj) {
   this.setState(obj);
 }

  selectInboxItem(ticketID) {
    this.setState({selected: ticketID});

  }

 async handleSearchChange(e, { value }) {
    const {TicketingStore} = this.props;
    this.setState({search_value: value, searching: true, searchBy: ""});
    const titles = await TicketingStore._allTitles.filter(i => i.toLowerCase().includes(value.toLowerCase()));
    const assignees = TicketingStore._currentAssignees.filter(i => i.name.toLowerCase().includes(value.toLowerCase()));
    const stages = TicketingStore._allStages.filter(i => i.toLowerCase().includes(value.toLowerCase()));
    let search_results = {};
    if (titles.length) search_results.title =  {name: "Title", results: titles.map(i => ({title: i, source: "title", className: "SearchResultCompact"}))};
    if (assignees.length) search_results.assignee = {name: "Assignee", results: assignees.map(i => ({title: i.name, source: "assignee", id: i.id, className: "SearchResultCompact"}))};
    if (stages.length) search_results.stage = {name: "Stage", results: stages.map(i => ({title: i, source: "stage", className: "SearchResultCompact"}))};
    this.setState({searching: false
      , search_results
    })
  }

  getDetails() {
    const {TicketingStore} = this.props;
    const {selected} = this.state;
    if (!selected) return null;
    else {
      return <TicketDetailsFrame unSelect={() => this.selectInboxItem(null)} id={this.state.selected} data={TicketingStore._getTicket(this.state.selected)} />;

    }
  }

  

  render() {
    const {TicketingStore} = this.props; 
    const {filter,sort, searching, search_results, search_value} = this.state;
    return (
      <React.Fragment>
        {!this.props.hideHeading &&
        <Header as="h2" style={{ padding: 0, margin: "10px 0 10px" }}>
          Inbox
        </Header>
        }
        <Row>
          <Col>

          <div> 
         

            <Row style={{paddingBottom: 5}}>
              <Col sm={3}>
              <span style={{whiteSpace: "nowrap"}}>
                  Show{' '}
                  <span onClick={this.openFilter} style={{fontWeight: "bold"}}>{filter}</span>
                  <Dropdown inline 
                      ref={this.filterRef}
  
                  value={this.state.filter} 
                
                  >
                        <Dropdown.Menu>
                        <Dropdown.Item active={filter === "recent"} onClick={(e, {value}) => this.updateState({filter: value})} value={"recent"}>recent </Dropdown.Item>
                        <Dropdown.Item  active={filter === "active"} onClick={(e, {value}) => this.updateState({filter: value})} value={"active"}>active </Dropdown.Item>
                        <Dropdown.Item  active={filter === "closed"} onClick={(e, {value}) => this.updateState({filter: value})} value={"closed"}>closed </Dropdown.Item>
                        <Dropdown.Item  active={filter === "pending"} onClick={(e, {value}) => this.updateState({filter: value})} value={"pending"}>pending approval </Dropdown.Item>
                        <Dropdown.Item  active={filter === "all"} onClick={(e, {value}) => this.updateState({filter: value})} value={"all"}>all</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Header icon='sort' content='Sort' />
                        <Dropdown.Divider />
                        <Dropdown.Item active={sort === "new"} onClick={(e, {value}) => this.updateState({sort: value})} value={"new"} >newest </Dropdown.Item>
                        <Dropdown.Item active={sort === "old"} onClick={(e, {value}) => this.updateState({sort: value})} value={"old"}>oldest </Dropdown.Item>
                     
                      </Dropdown.Menu>
                    </Dropdown>
                
                  </span>
              </Col>
            </Row>
            <Row>
            <Col xl={3}>
                  
       
               
                    <Search placeholder="Title, Assignee, Stage..." size="mini" fluid className="InboxSearchBox"
                    category
                    loading={searching}
                    onResultSelect={this.handleResultSelect.bind(this)}
                    onSearchChange={debounce(this.handleSearchChange.bind(this), 800, {
                      leading: true,
                    })}
                    results={search_results}
                    value={search_value}
  
                    />
            
      
                  </Col>
            </Row>

    </div>

          </Col>
        </Row>
      
   
          <Row style={{ marginTop: 15 }}>
            <Col xl={3}>
              {!TicketingStore.allTickets.filter(i=>!i.isTemplate).length? <Header>Your inbox is empty </Header> :
              <Paper
                style={{
            
                  maxHeight: "85vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  marginBottom: "20px",
                }}
              >
                <InboxList sort={this.state.sort} filter={this.state.filter} searchBy={this.state.searchBy} selected={this.state.selected} handleClick={i => this.selectInboxItem(i)} source={TicketingStore.allTickets} />
              </Paper>}
            </Col>
            <Col>
                {this.getDetails()}
            </Col>
          </Row>

      </React.Fragment>
    );
  }
}

export default withRouter(Inbox);
