import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, Checkbox, Dropdown, Menu, Icon, Header } from "semantic-ui-react";
import { Paper } from "@material-ui/core";

import { Container, Col, Row } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";
import { UserStore } from "../Stores/UserStore";
import { modifyTicket } from "../DataExchange/Up";
import { TicketData } from "./TicketData";
import { TicketActivity } from "./TicketActivity";
import { TicketRequester } from "./TicketRequester";
import { TicketActions } from "./TicketActions";
import { TicketDetailsMessage} from "./TicketDetailsMessage";



import FadeIn from 'react-fade-in';

class TicketDetailsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "activity",
      messageType: "",
      message: "",

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


  // static getDerivedStateFromProps(props, state) {
  //   if (props.id !== state.id) {
  //     const base = AccountStore._getUsersSelectOptions([ ...props.data._parent.admins, ...props.data._parent.collaborators ]); 
  //     console.log("DATA", props.data)
  //     return {
  //       id: props.id,
  //       showMemo: false,
  //       memo: "",
  //       stage: props.data._stage,
  //       selectedAssignee: props.data._currentAssignee || false ,
  //       memoAdmin: "",
  //       addlFieldsSource: [],
  //       addlFieldsRes: {},
  //       assigneeOptions: [...base, {text: "Unassigned", value: false}]
  //     };

  //   }
  //   else return null;
  // }

  // setAddlFieldRes = obj => {
  //   const newVal = Object.assign(this.state.addlFieldsRes, obj);
  //   this.setState({ addlFieldsRes: newVal });
  // };

  handleMenuClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  handleSubmit = async () => {
     const userID = UserStore.user.userID;
     const newData = this.state.messageType === "internal"? {memo: this.state.message} : {}

     const newActivity = [
        {
          userID,
          stage: "",
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
      await this.setState({messageType : ""})
  }

  // async addlFields() {
  //   const { stage } = this.state;
  //   const { _parent } = this.props.data;
  //   if (!stage) return [];
  //   else if (stage.includes("close"))
  //     return await _parent.ticketItems.filter(i => i.isClose);
  //   else if (stage === "open")
  //     return await _parent.ticketItems.filter(i => i.isOpen);
  //   else
  //     return await _parent.ticketItems.filter(
  //       i => i.label && i.label === stage
  //     );
  // }

  // updateTicket = async () => {
  //   const { stage } = this.state;
  //   const userID = UserStore.user.userID;
  //   if (stage.includes("close")) {
  //     const newActivity = [
  //       ...this.props.data.activity,
  //       {
  //         userID,
  //         stage: this.state.stage,
  //         updated: Date.now(),
  //         data: this.state.memo ? { memo: this.state.memo } : {}
  //       }
  //     ];
  //     const updateObj = {
  //       ticketID: this.props.data.ticketID,
  //       accountID: this.props.data.accountID,
  //       stage: this.state.stage,
  //       activity: newActivity
  //     };
  //     modifyTicket(updateObj);
  //   }
  // };

  // async changeStage(stage) {
  //   await this.setState({ stage });
  //   const checkFields = await this.addlFields();

  //   if (checkFields.length && checkFields[0].data.length)
  //     this.setState({ addlFieldsSource: checkFields[0].data });
  // }

  // stagesOptions = () => {
  //   const { _parent } = this.props.data;

  //   const parentStages = !_parent.ticketItems.length
  //     ? []
  //     : _parent.ticketItems
  //         .filter(ticketItem => ticketItem.label)
  //         .map(ticketItem => ({
  //           text: ticketItem.label,
  //           value: ticketItem.label
  //         }));

  //   let baseStages = [
  //     { text: "Open", value: "open" },
  //     { text: "Close (completed)", value: "closed" },
  //     { text: "Close (unable to fulfill)", value: "closed-cant" },
  //     { text: "Close (out of scope/declined)", value: "closed-wont" }
  //   ];
  //   return [...parentStages, ...baseStages];
  // };

  // getFormItemField(formItem) {
  //   if (formItem.type === "text")
  //     return (
  //       <Form className="FixSemanticLabel">
  //         <Form.Input
  //           label={formItem.label}
  //           onChange={(e, value) => {
  //             let newVal = {};
  //             newVal[formItem.label] = value;
  //             this.setAddlFieldRes(newVal);
  //           }}
  //         />
  //       </Form>
  //     );
  //   else if (formItem.type === "select")
  //     return (
  //       <Form className="FixSemanticLabel">
  //         <Form.Select
  //           label={formItem.label}
  //           onChange={(e, { value }) => {
  //             let newVal = {};
  //             newVal[formItem.label] = value;
  //             this.setAddlFieldRes(newVal);
  //           }}
  //           options={formItem.options.map(opt => ({ text: opt, value: opt }))}
  //         />
  //       </Form>
  //     );
  //   else if (formItem.type === "multi")
  //     return (
  //       <>
  //         <span>{formItem.label}</span>
  //         <Form>
  //           <Form.Group grouped>
  //             {formItem.options.map(opt => (
  //               <Form.Field
  //                 control={Checkbox}
  //                 label={<label>{opt}</label>}
  //                 onChange={(e, value) => {
  //                   let newVal = {};
  //                   newVal[opt] = value.checked;
  //                   this.setAddlFieldRes(newVal);
  //                 }}
  //               />
  //             ))}
  //           </Form.Group>
  //         </Form>
  //       </>
  //     );
  // }

  render() {
    const { _requester, _userImg, _userInitials, _parent, _parentLabel, activity } = this.props.data;
    const { activeItem, messageType, message } = this.state;

   
    return (
      <React.Fragment>
        <FadeIn>
         
   
        <Paper>
        
          <div className="section_title">
            <div>
              <h4 style={{ color: "#404040" }}>{_parentLabel}</h4>
              <p style={{ color: "#abacab", fontSize: ".8em" }}>
                {"Service Desk"}
              </p>
            </div>
          </div>
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
                    />
                    <Menu.Item
                      name="data"
                      active={activeItem === "data"}
                      onClick={this.handleMenuClick}
                    />
                    <Menu.Item
                      name="requester"
                      active={activeItem === "requester"}
                      onClick={this.handleMenuClick}
                    />
                  </Menu>
                </Col>
              </Row>
              <Row>
                <Col>
                  {activeItem === "requester" ? (
                    <TicketRequester
                      requester={_requester}
                      userImg={_userImg}
                      userInitials={_userInitials}
                    />
                  ) : activeItem === "activity" ? (
                    <TicketActivity activity={activity} />
                  ) : (
                    <TicketData activity={activity} />
                  )}
                </Col>
              </Row>
              { messageType?  <TicketDetailsMessage  data={this.props.data} action={messageType==="requester"? "Send" : "Add"} label={messageType==="requester"? "Send message to requester" : "Add internal memo"} handleSubmit={this.handleSubmit} output={this.updateState}  /> :   <TicketActions data={this.props.data} output={this.updateState} id={this.props.id}/> }
                   
            </Container>
          </div>
        </Paper>
        </FadeIn>
      </React.Fragment>
    );
  }
}

export default withRouter(TicketDetailsFrame);
