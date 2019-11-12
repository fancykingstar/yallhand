import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import { Button, Label } from "semantic-ui-react";
import { Paper, Card, CardHeader, CardContent, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import department_icon from "../Assets/Icons/department_icon.svg";
import location_icon from "../Assets/Icons/location_icon.svg";
import mobile_icon from "../Assets/Icons/mobile_icon.svg";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import {Label as RSLabel} from "reactstrap";
import { Container, Col, Row, Input, InputGroup,FormGroup } from "reactstrap";

import { AccountStore } from "../Stores/AccountStore";
import { TicketingStore } from "../Stores/TicketingStore";
import TimeAgo from 'react-timeago'
import {giveMeKey} from "../SharedCalculations/GiveMeKey";



class TicketDetailsFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contactExpanded: false, stage: "", addlFieldsSource: [] };
  }

toggleContactInfo() {
  this.setState({ contactExpanded: !this.state.contactExpanded });
}

async addlFields() {
  const {stage} = this.state;
  const {_parent} = this.props.data;
   if (!stage) return [];
    else if (stage.includes("close")) return await _parent.ticketItems.filter(i => i.isClose);
    else if (stage === "open") return await _parent.ticketItems.filter(i=>i.isOpen);
    else return await _parent.ticketItems.filter(i=>i.label && i.label === stage)
}

  async changeStage(stage) {
    await this.setState({stage});
    const checkFields = await this.addlFields();
    if (checkFields[0].data.length) this.setState({addlFieldsSource: checkFields[0].data})
  }

  stagesOptions = () => {
    const {_parent} = this.props.data;

    const parentStages = !_parent.ticketItems.length? [] : _parent.ticketItems.filter(ticketItem=>ticketItem.label).map(ticketItem => ({text: ticketItem.label, value: ticketItem.label}));
    // console.log(_parent.ticketItems.filter(ticketItem=>ticketItem.label).map(ticketItem => ({text: ticketItem.label, value: ticketItem.label})))
    let baseStages = [
      {text: "Re-open", value:"reopen"},
      {text: "Close (completed)", value: "closed"},
      {text: "Close (unable to fulfill)", value: "closed-cant"},
      {text: "Close (out of scope/declined)", value: "closed-wont"}
    ]

    return [...parentStages, ...baseStages]
  }

    getFormItemField(formItem) {
      if(formItem.type === "text") return (
      <InputGroup>
          <Input placeholder="" type="text" name={formItem.label} id="description" onChange={() => console.log("fix")} />
      </InputGroup> )

      else if(formItem.type === "select") return (
          <Input type="select" name={formItem.label} id="props_for" onChange={() => console.log("fix")}>
              {formItem.options.map(opt => <option>{opt}</option>)}
          </Input>
      )

      else if(formItem.type === "multi") return (
          <FormGroup>
          {formItem.options.map(opt =>  
          
          <FormControlLabel
              control={<Checkbox 
              id={formItem.label}
              name={opt}
              onChange={() => console.log("fix")}
              />}
          label={opt}
          />

          )}
        </FormGroup>
      )
      
  }

  

  render() {
    const {_requester, _userImg, _userInitials, _parent, _parentLabel, activity} = this.props.data;
    return (
      <React.Fragment>
        {JSON.stringify(this.state)}
        <Paper>
                <div className="section_title">
                  <div>
                    <h4 style={{ color: "#404040" }}>{_parentLabel}</h4>
                    <p style={{ color: "#abacab", fontSize: ".8em" }}>{"Service Desk"}</p>
                  </div>
                </div>
                <div style={{ padding: 15 }}>
                  <Container>
                    <Row>
                      <Col>
                        <h5>Requester</h5>

                        <Card style={{ boxShadow: "none" }}>
                          <CardHeader
                            action={
                              <IconButton
                                onClick={this.toggleContactInfo.bind(this)}
                                aria-label="show more"
                              >
                                {" "}
                                <ExpandMoreIcon />{" "}
                              </IconButton>
                            }
                            avatar= { _userImg ? <Avatar src={_userImg}></Avatar> : <Avatar>{_userInitials}</Avatar>}
                            title={_requester.displayName}
                            subheader={
                              <>
                                {_requester.profile.title}
                                {_parent.config.updateOpener && <> 
                                  <br />
                                <span style={{ fontSize: "0.7em" }}>
                                  Requester is subscribed to updates
                                </span>
                                </>
                                
                              }
                              </>
                            }
                          />

                          <Collapse
                            in={this.state.contactExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <CardContent>
                              <List component="div">
                              {_requester.email &&
                                <ListItem>
                                  <ListItemIcon>
                                    <MailOutlineRoundedIcon
                                      style={{ color: "#4780F7" }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.email} />
                                </ListItem>}

                                {_requester.Department &&
                                <ListItem>
                                  <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.profile.Department} />
                                </ListItem>
                                }

                                {_requester.Location &&
                                <ListItem>
                                  <ListItemIcon>
                                    <img src={location_icon} alt="" />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.profile.Location} />
                                </ListItem>}

                                {_requester.Mobile &&
                                <ListItem>
                                  <ListItemIcon>
                                    <img src={mobile_icon} alt="" />
                                  </ListItemIcon>
                                  <ListItemText secondary={_requester.profile.Mobile} />
                                </ListItem>}

                              </List>
                            </CardContent>
                          </Collapse>
                        </Card>
                      </Col>
                      <Col>
                        <h5>Activity</h5>
                        <Card style={{ boxShadow: "none" }}>
                          <CardContent style={{ padding: 0 }}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              {activity.reverse().map(act => 
                              <Row style={{ padding: "3px 0 3px" }}>
                              <Col xs={8}>Set as{" "}
                                <strong>{act.stage}</strong> by{" "}
                                <strong>{AccountStore._getUser(act.userID).displayName}</strong>{" "}
                              </Col>
                              <Col> <strong><TimeAgo date={act.updated} /></strong></Col>
                            </Row>
                              )}
                            
                            
                            </Typography>
                          </CardContent>
                        </Card>
                      </Col>
                      <Col>
                        <h5>Data</h5>

                        <Card style={{ boxShadow: "none" }}>
                          <CardContent style={{ padding: 0 }}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                               {activity.filter(act => Object.keys(act.data).length).map(act => 

                               {
                                const res = Object.keys(act.data).map(datapnt => 
                                <Row style={{ padding: "3px 0 3px" }}>
                                <Col xs={9}>
                                  <strong>{datapnt} </strong> 
                                  {act.data[datapnt]}{" "}
                                  <Label size="mini" >{AccountStore._getUser(act.userID).displayName}</Label>
                                </Col>
                                <Col>3d ago</Col>
                              </Row>
                                  );
                                return res;
                               }
                          
                               
                             
                                )}
                              
                            </Typography>
                          </CardContent>
                        </Card>
                      </Col>
                    </Row>
                    <Row style={{ padding: "5px 0 5px" }}>
                      <Col>
                        <h5>Update</h5>
                      </Col>
                    </Row>
                    <Row style={{ padding: "5px 0 5px" }}>
                      <Col xs={3}>
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
                      <Col xs={3}>
                        <InputGroup>
                          <Input
                            placeholder="Change stage..."
                            type="select"
                            name="select"
                            id="exampleSelect"
                          >
                            <option value="" disabled selected>
                              Assign to...
                            </option>
                            {
                              AccountStore._getUsersSelectOptions([..._parent.admins, ..._parent.collaborators]).map(user => <option key={giveMeKey() + user.text} value={user.value}>{user.text}</option>)
                            }
                          </Input>
                        </InputGroup>
                      </Col>
                    </Row>

                   <Row>
                   {this.state.addlFieldsSource.map(formItem => 
                        <Col md={6}>
                             <FormGroup>
                                        <RSLabel for="description">{formItem.label}</RSLabel>
                                        {this.getFormItemField(formItem)}
                                    </FormGroup>
                        </Col>

                    )
                    
                    }
                   </Row>

                    <Row style={{ padding: "8px 0 8px" }}>
                      <Col>
                        <InputGroup>
                          <Input
                            placeholder="Memo (optional)"
                            type="text"
                            name={"description"}
                            id="description"
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                    <Row style={{ padding: "8px 0 8px" }}>
                      <Col>
                        <Button primary>Update</Button>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Paper>
      </React.Fragment>
    );
  }
}

export default withRouter(TicketDetailsFrame);
