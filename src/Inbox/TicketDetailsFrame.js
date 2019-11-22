import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, Checkbox, Dropdown, Menu, Icon, Header } from "semantic-ui-react";
import { Paper } from "@material-ui/core";

import { Container, Col, Row } from "reactstrap";
import { UserStore } from "../Stores/UserStore";
import { modifyPolicy, modifyAnnouncement, modifyTicket } from "../DataExchange/Up";
import { contentEdit} from "../DataExchange/PayloadBuilder";
import { TicketData } from "./TicketData";
import { TicketActivity } from "./TicketActivity";
import { TicketRequester } from "./TicketRequester";
import { TicketActions } from "./TicketActions";
import { TicketDetailsMessage} from "./TicketDetailsMessage";
import { TicketDetailsQandAMessage} from "./TicketDetailsQandAMessage";
import { TicketContentSource } from "./TicketContentSource";
import { addView } from "../DataExchange/PayloadBuilder";





import FadeIn from 'react-fade-in';

class TicketDetailsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "activity",
      messageType: "",
      message: "",
      ticketID: "",
      // addView: false,
      // showMemo: false,
      // stage: "",
      // addlFieldsSource: [],
      // selectedAssignee: "", //NOTE: False is unassigned for dropdown functionality
      // memo: "",
      // memoAdmin: "",
      // id: "",
      // addlFieldsRes: {},
      // assigneeOptions: [],
    };
  }

  updateState = (obj) => {
    this.setState(obj);
  }

  markAsRead = async () => {
   if (this.props.data._unread) await modifyTicket(addView(this.props.data));
  }

  async componentDidUpdate() {
    this.markAsRead();
  }


  async componentDidMount() {
    this.markAsRead();
  }


 static getDerivedStateFromProps(props, state) {
    if (props.data.ticketID !== state.ticketID) {
      return {
       message: "",
       messageType: "",
       activeItem: props.data._stage === "open-pending"? "data" : "activity",
       ticketID: props.data.ticketID
      };
    }
    else return null;
  }

  setAddlFieldRes = obj => {
    const newVal = Object.assign(this.state.addlFieldsRes, obj);
    this.setState({ addlFieldsRes: newVal });
  };

  handleMenuClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };


  updateContent = async () => {
    const { _content} = this.props.data;
    const {activity} = this.props.data;
    const vari = _content.variations[0];
    const payload =  {qanda : [{
      q: activity[activity.length - 1].data.q,
      a: this.state.message,
      adminID: UserStore.user.userID,
      update: Date.now()
    }]};

    const mode = _content.policyID? "policy" : "announcement";
    const contentID = _content[`${mode}ID`]

    if (mode === "policy") await modifyPolicy(contentEdit(payload, mode, contentID, vari.variationID), false) 
    else await modifyAnnouncement(contentEdit(payload, mode, contentID, vari.variationID), false)
    
  }

  handleSubmit = async () => {
     const userID = UserStore.user.userID;
     const newData = this.state.messageType === "internal"? {memo: this.state.message} : !this.state.messageType.includes('reply')? {} : this.state.messageType.includes('public')? {"replied pubicly": this.state.message}: {"replied privately": this.state.message};

     const newActivity = [
        {
          userID,
          stage: "closed",
          views: [userID],
          updated: Date.now(),
          data: newData,
          assignee: this.props.data._currentAssignee
        },    ...this.props.data.activity
      ];
      const updateObj = {
        ticketID: this.props.data.ticketID,
        accountID: this.props.data.accountID,
        activity: newActivity,
      };  
      await modifyTicket(updateObj);
      if (this.state.messageType.includes('reply')) {
        if(this.state.messageType.includes('public')) await this.updateContent();
        //nofity
      };
      await this.setState({messageType : ""})
  }

  displayDetail = () => {
    const { _requester, _userImg, _userInitials, _parent, _content, activity } = this.props.data;
    const { activeItem, messageType, message } = this.state;
    
    return {
    "requester":  <TicketRequester requester={_requester} userImg={_userImg} userInitials={_userInitials} />,
    "activity":  <TicketActivity activity={activity} />,
    "data" : <TicketData activity={activity} content={this.props.data._content} />,
    }
  };

  render() {
    const { _requester, _userImg, _userInitials, _parent, _content, activity, _stage } = this.props.data;
    const { activeItem, messageType, message } = this.state;
    const QandA = this.props.data.parent === "QandA";
    const firstActivity = activity[activity.length - 1];

    const featuredData = QandA ? 
      <>
        <Col> <span style={{fontWeight: 800}}>Question</span><br/> <span>{firstActivity.data.q}</span> </Col>
        <Col> <span style={{fontWeight: 800}}>Source</span><br/> <TicketContentSource content={this.props.data._content} data={this.props.data} /> </Col>
      </> 
      :
      Object.keys(firstActivity.data).filter(datapoint => datapoint !== "id").map(datapoint => 
      <Col> <span style={{fontWeight: 800}}>{datapoint}</span><br/> <span>{firstActivity.data[datapoint]}</span> </Col>
        )

   
    return (
      <React.Fragment>
        <FadeIn>
         
   
        <Paper>
          <div className="section_title" style={{backgroundColor: _stage === "open-pending"? "#da17b1":"#39b6f8"}}>
            <div>
              <h4 style={{ color: "#FFFFFF" }}>{QandA? _content.label :_parent.label}</h4>
              <p style={{ color: "#e3e8ee", fontSize: ".8em" }}>
                {QandA? "Content Q & A": "Service Desk"}
              </p>
            </div>
          </div>
        
            <Container style={{padding: "15px", borderBottom: "1px solid #ABACAB"}}>
              <Row  style={{padding: "15px", fontSize: "0.9em", color: "rgba(0, 0, 0, 0.54)"}}>
                {featuredData}
                 <Col> <span style={{fontWeight: 800}}>Requester</span><br/> <TicketRequester requester={_requester} userImg={_userImg} userInitials={_userInitials} />  </Col>
              </Row>
         
            </Container>
            <div style={{ padding: 15 }}>
            <Container>
       

         
          

              <Row>
                <Col>
           
                  <Menu
                    text
                    style={{ fontSize: "0.9em", marginTop: 0 }}
                    secondary
                  >
                    <Menu.Item
                      name="activity"
                      active={activeItem === "activity"}
                      onClick={this.handleMenuClick}
                      color={activeItem === "activity" && "blue"}
                    />
                    {/* {_content && 
                        <Menu.Item
                        name="source"
                        active={activeItem === "source"}
                        onClick={this.handleMenuClick}
                      />
                    } */}
                    {/* {!_content && */}
                    <Menu.Item
                      name="data"
                      active={activeItem === "data"}
                      onClick={this.handleMenuClick}
                      color={activeItem === "data" && "blue"}
                    />
                    {/* } */}
                    {/* <Menu.Item
                      name="requester"
                      active={activeItem === "requester"}
                      onClick={this.handleMenuClick}
                    /> */}
                  </Menu>
                </Col>
              </Row>
              <Row>
                <Col>

                {this.displayDetail()[activeItem]}
                  
                </Col>
              
              </Row>
              {
              !messageType?   <TicketActions data={this.props.data} output={this.updateState} id={this.props.id}/>  :
              messageType.includes('reply')? 
              <TicketDetailsQandAMessage data={this.props.data} handleSubmit={this.handleSubmit} output={this.updateState}  /> :
              <TicketDetailsMessage  data={this.props.data} action={messageType==="requester"? "Send" : "Add"} label={messageType==="requester"? "Send message to requester" : "Add internal memo"} handleSubmit={this.handleSubmit} output={this.updateState}  /> 
              
              }
                   
            </Container>
          </div>
        </Paper>
        </FadeIn>
      </React.Fragment>
    );
  }
}

export default withRouter(TicketDetailsFrame);
