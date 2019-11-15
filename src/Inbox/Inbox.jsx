import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer} from "mobx-react";
import { Header, Dropdown, Menu, DropdownMenu } from "semantic-ui-react";
import { Paper, 
  // Card, CardHeader, CardContent, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton 
} from "@material-ui/core";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import department_icon from "../Assets/Icons/department_icon.svg";
// import location_icon from "../Assets/Icons/location_icon.svg";
// import mobile_icon from "../Assets/Icons/mobile_icon.svg";
// import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import { 
  // Container, 
  Col, Row, 
  // Input, InputGroup 
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


@inject("TicketingStore")
@observer
class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: null, filter: "all" };
  }

 updateState(obj) {
   this.setState(obj);
 }

  selectInboxItem(ticketID) {
    this.setState({selected: ticketID});
  }



  getDetails() {
    const {TicketingStore} = this.props;
    if (!this.state.selected) return null;
    else {
      if (this.state.selected.parent !== "QandA") return  <TicketDetailsFrame id={this.state.selected} data={TicketingStore._getTicket(this.state.selected)} />;
    //   else {return <QnADetailsFrame data={this.state.selected}/> 
    // }
    }
  }

  // getCurrentAssignee = ticket => {
  //   if (!ticket._currentAssignee) return "";
  //   else {
  //     const me = UserStore.user.userID;
  //     const assignee = AccountStore._getUser(ticket._currentAssignee);
  //     return me === assignee.userID ? "Me" : assignee.displayName;
  //   }
  // };

  // getProgress = async ticket => {
  //   const {TicketingStore} = this.props;
  //   if (ticket.parent === "QandA") return {steps: 20, activeStep: 10}
  //   const parent = await TicketingStore._getTicket(ticket.parent);
  //   const uniqSteps = await uniq(ticket.activity.map(act => act.stage));
  //   return {
  //     steps: parent.ticketItems.length * 10,
  //     activeStep: uniqSteps.length * 10
  //   };
  // };




  async componentDidMount() {
    // const {TicketingStore} = this.props;
    // const source = async () => {
    //   let newSource = [];
    //   TicketingStore.allTickets.forEach(i => newSource.push(i));
    //   newSource = newSource.filter(i => !i.isTemplate);
     
    //   for await (const i of newSource) {
        // console.log("vari search", Object.keys(i.activity[0].data).includes("policyID")? PoliciesStore._getPolicy(i.activity[0].data.policyID) : AnnouncementsStore._getAnnouncement(i.activity[0].data.announcementID))

        // i["_currentAssignee"] = this.getCurrentAssignee(i);
        // i["_progress"] = await this.getProgress(i);
        // i["_userImg"] = AccountStore._getUser(i.userID).img;
        // i["_requester"] = AccountStore._getUser(i.userID);
        // i["_parent"] = TicketingStore._getTicket(i.parent);
        // i["_userInitials"] = getInitials(
        //   AccountStore._getUser(i.userID).displayName
        // );
        // i["_parentLabel"] = i.parent === "QandA"? this.getContentLabel(i) : TicketingStore._getTicket(i.parent).label;
        // i["_contentPreview"] = Object.keys(i.activity[0].data).includes("policyID")? PoliciesStore._getPolicy(i.activity[0].data.policyID) : AnnouncementsStore._getAnnouncement(i.activity[0].data.announcementID)
        // i["_contentData"] = Object.keys(i.activity[0].data).includes("policyID")? PoliciesStore._getPolicy(i.activity[0].data.policyID) : AnnouncementsStore._getAnnouncement(i.activity[0].data.announcementID)
      // }
      // await this.setState({ source: newSource, sourceOrig: newSource, selected: newSource[0] });

    // };
    // source();
  }

  render() {
    const {TicketingStore} = this.props; 
    return (
      <React.Fragment>
        
        <Header as="h2" style={{ padding: 0, margin: "10px 0 10px" }}>
          Inbox
        </Header>
        <Row>
          <Col>

          <div> 
  <span>
    Sort by{' '}
    <Dropdown inline options={[
      {text: "active", value: "active" },{text: "closed", value: "closed"},{text: "all", value: "all"}
    ]} value={this.state.filter} onChange= {(e, {value}) => this.updateState({filter: value})} />
   
    </span>
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
                }}
              >
                <InboxList filter={this.state.filter} selected={this.state.selected} handleClick={i => this.selectInboxItem(i)} source={TicketingStore.allTickets} />
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
