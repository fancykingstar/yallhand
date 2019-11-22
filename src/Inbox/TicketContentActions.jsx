import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import { Button, Label } from "semantic-ui-react";
import { Paper, Card, CardHeader, CardContent,CardActionArea, CardMedia, CardActions, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import department_icon from "../Assets/Icons/department_icon.svg";
// import location_icon from "../Assets/Icons/location_icon.svg";
// import mobile_icon from "../Assets/Icons/mobile_icon.svg";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import {Label as RSLabel} from "reactstrap";
import { Container, Col, Row, Input, InputGroup,FormGroup } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";
import { TicketingStore } from "../Stores/TicketingStore";
import {getDisplayTags} from "../SharedCalculations/GetDisplayTags";
import {getDisplayTeams} from "../SharedCalculations/GetDisplayTeams";
import { TeamStore } from "../Stores/TeamStore";
import { UserStore } from "../Stores/UserStore";

import TimeAgo from 'react-timeago'
import {giveMeKey} from "../SharedCalculations/GiveMeKey";
import { ContentPreview } from "../SharedUI/ContentPreview";
import { modifyPolicy, modifyAnnouncement, modifyTicket } from "../DataExchange/Up";
import { contentEdit} from "../DataExchange/PayloadBuilder";



export class TicketContentActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contactExpanded: false, stage: "", addlFieldsSource: [], toggleContentPreview: false, contentPreview: "", vari: "", assignee: "", memo: "", memoAdmin: "", response: "" };
  }

//   async componentDidMount(){
//     const data = this.props.data.activity[0].data; 
//     const contentPreview = await Object.keys(data).includes("policyID")? PoliciesStore._getPolicy(data.policyID) : AnnouncementsStore._getAnnouncement(data.announcementID);
//     this.setState({contentPreview});

//   }

componentDidMount(){
    const vari = this.props.data._content.variations[0];
    this.setState({vari})


}

updateTicket = async () => {
  const {stage,  response, vari} = this.state;
  const { _content} = this.props.data;
  const userID = UserStore.user.userID;
  if (stage === "close") {
    const payload =  {qanda : [{
      q: this.props.data.activity[0].data.q,
      a: response,
      adminID: UserStore.user.userID,
      update: Date.now()
    }]};

    const mode = _content.policyID? "policy" : "announcement";
    const contentID = _content[`${mode}ID`]

    if (mode === "policy") await modifyPolicy(contentEdit(payload, mode, contentID, vari.variationID)) 
    else await modifyAnnouncement(contentEdit(payload, mode, contentID, vari.variationID))

    // contentEdit = (obj, mode, contentID, variID) let newVari = Object.assign({}, vari);
    
    const newActivity = [...this.props.data.activity, {userID, stage: this.state.stage, updated: Date.now(), data: {}}]
    const updateObj = {ticketID: this.props.data.ticketID, accountID: this.props.data.accountID, stage: this.state.stage, activity: newActivity};
    modifyTicket(updateObj);

  }

}

getPreviewContent = () => {

  return Object.assign(this.props.data._content, {variations: [this.state.vari]})
}

closePreview = () => {
  this.setState({toggleContentPreview: false})
}

toggleContactInfo() {
  this.setState({ contactExpanded: !this.state.contactExpanded });
}


  async changeStage(stage) {
    await this.setState({stage});
  }

  stagesOptions = () => {

    let baseStages = [
      // {text: "Re-open", value:"reopen"},
      {text: "Open", value: "open"},
      {text: "Close (Attach question & response to public content)", value: "close"},
      {text: "Close (Send a reponse to requester privately)", value: "close-cant"},
      {text: "Close (No decline to respond)", value: "reject"}
    ]

    return [ ...baseStages]
  }

//     getFormItemField(formItem) {
//       if(formItem.type === "text") return (
//       <InputGroup>
//           <Input placeholder="" type="text" name={formItem.label} id="description" onChange={() => console.log("fix")} />
//       </InputGroup> )

//       else if(formItem.type === "select") return (
//           <Input type="select" name={formItem.label} id="props_for" onChange={() => console.log("fix")}>
//               {formItem.options.map(opt => <option>{opt}</option>)}
//           </Input>
//       )

//       else if(formItem.type === "multi") return (
//           <FormGroup>
//           {formItem.options.map(opt =>  
          
//           <FormControlLabel
//               control={<Checkbox 
//               id={formItem.label}
//               name={opt}
//               onChange={() => console.log("fix")}
//               />}
//           label={opt}
//           />

//           )}
//         </FormGroup>
//       )
      
//   }

  

  render() {
    const {_requester, _userImg, _userInitials, _parent, activity, _content} = this.props.data;
    const {vari,toggleContentPreview} = this.state;
    return (
      <React.Fragment>
    
      
               
                    <Row style={{ padding: "5px 0 5px" }}>
                      <Col>
                        <h5>Respond/Update</h5>
                      </Col>
                    </Row>
                    <Row style={{ padding: "5px 0 5px" }}>
                      <Col md={5}>
                        <InputGroup>
                          <Input
                            placeholder="Change stage..."
                            type="select"
                            name="select"
                            id="exampleSelect"
                            onChange={(e) => this.changeStage(e.target.value)}
                          >
                            <option value="" disabled selected>
                              Change stage...
                            </option>
                            {this.stagesOptions().map(opt => 
                              <option value={opt.value}>{opt.text}</option>
                            )}
                          </Input>
                        </InputGroup>
                      </Col>
                      { !this.state.stage.includes('close') &&
                        <Col xs={3}>
                        <InputGroup>
                        <Input
                            onChange={(e)=> this.setState({assignee: e.target.value})}
                            type="select"
                            name="select"
                            id="exampleSelect"
                        >
                            <option value="" disabled selected>
                            Assign to...
                            </option>
                            {
                            AccountStore. _getAdminSelectOptions().map(user => <option key={giveMeKey() + user.text} value={user.value}>{user.text}</option>)
                            }
                        </Input>
                        </InputGroup>
                        </Col>
                      }
                     
                    </Row>

                   <Row>
                   </Row>

                    <Row style={{ padding: "8px 0 8px" }}>
                      <Col>
                        <InputGroup>
                          {
                              this.state.stage.includes('close')?
                              <Input 
                              type="textarea"
                              onChange={e=>this.setState({response: e.target.value})}
                              placeholder="Response"
                              name="response"
                              />
                          :
                          <>
                          <Input
                            placeholder="Memo (optional)"
                            onChange={e=>this.setState({memo: e.target.value})}
                            type="text"
                            name={"description"}
                            id="description"
                          />
                          <FormGroup style={{marginTop: 7, marginLeft: 5}} check>
                          <RSLabel check>
                            <Input onChange={e=>this.setState({memoAdmin:e.target.checked})} type="checkbox" id="checkbox2" />{' '}
                            Admin Only
                          </RSLabel>
                        </FormGroup>
                        </>
                          }
                        </InputGroup>
                      </Col>
                    </Row>
                    <Row style={{ padding: "8px 0 8px" }}>
                      <Col>
                        <Button onClick={()=>this.updateTicket()} primary>Update</Button>
                      </Col>
                    </Row>
                    </React.Fragment>
               
    );
  }
}


