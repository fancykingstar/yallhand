import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import {  Icon, Header, Button } from "semantic-ui-react";
// import { Container, Row, Col} from "reactstrap"

import {Dropdown, Form} from "semantic-ui-react";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";
import { TicketingStore } from "../Stores/TicketingStore";
import { AccountStore} from "../Stores/AccountStore";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import ListTest from "./ListTest";
import ConfirmationNumberRoundedIcon from '@material-ui/icons/ConfirmationNumberRounded';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import department_icon from "../Assets/Icons/department_icon.svg";
import location_icon from "../Assets/Icons/location_icon.svg";
import mobile_icon from "../Assets/Icons/mobile_icon.svg";
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import Star from '../Assets/Icons/star.svg';

import { Svg } from "../UserPortal/helpers/Helpers";

import { Container, Col, Row, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Label  as BSLabel} from "reactstrap";


class Inbox extends React.Component {
  constructor(props){
    super(props);
    this.state={contactExpanded: false};
  }

  toggleContactInfo() {
    this.setState({contactExpanded: !this.state.contactExpanded})
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiCardContent: {
          root: {
            fontFamily: "Lato",
            fontSize: "3em"
          }
        },
        MUIDataTableBodyCell: {
          root: {
            fontFamily: "Lato",
            fontSize: "1em"
          }
        },
        MUIDataTableBodyRow: {
          root: {
            zIndex: "1 !important"
          }
        },
        MUIDataTableSelectCell: {
            fixedHeader: {
              zIndex: "1 !important"
            },
            headerCell: {
              zIndex: "1 !important"
            }
          },
          MUIDataTableHeadCell: {
            fixedHeader: {
              // position: "relative"
              zIndex: "1 !important"
            }
        },
        MUIDataTable: {
          root: {
            backgroundColor: "#FF000"
          },
          paper: {
            boxShadow: "none",
            border: "2px solid #e3e8ee",
            borderRadius: 8
          }
        },
      }
    });
  
  render() {
    const MenuContainer = styled.div`
      display: flex;
      flex-wrap: wrap;
      paddingbottom: 30px;
      @media (max-width: 580px) {
        justify-content: center;
        flex-direction: column;
      }
    `;

    const handleClick = (ticket) => {
      this.props.history.push(`/panel/ticketing/manage-ticket${ticket? "/" + ticket.ticketID : ""}`);

    }
    
    const columns = ["Ticket Title", "Last Updated", "Created By", "Stage"];

    const data = TicketingStore.allTickets.filter(ticket=>!ticket.isTemplate).map(ticket => [ticket.label, UTCtoFriendly(ticket.updated), AccountStore._getDisplayName(ticket.userID), ticket.active? "Active":"Inactive"])
    


    const options = {
      elevation: 1,
      selectableRows: "none",
      filter:true,
      filterType: 'dropdown',
      filterList: [["active"]],
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,

      onRowClick: (i, data) => handleClick(TicketingStore.allTickets[data.rowIndex])
    };

    return (
      <React.Fragment>       

        <Header as="h2" style={{ padding: 0, margin: "10px 0 10px" }}>
          Inbox
          {/* <Header.Subheader>
            Create ticketing workflows for common processes
          </Header.Subheader> */}
        </Header>    
        <div style={{ marginTop: 15 }}>
          <Row>
            <Col xl={3}>
              <Paper style={{maxHeight: "85vh", overflowY: "auto", overflowX: "hidden"}}>
              <ListTest/>
              </Paper>
    
            </Col>
            <Col>
              <Paper>
              <div className="section_title">
                    <h4 style={{color: "#abacab"}}>
                        {"Service Desk"}</h4>
                </div>
                <div style={{padding: 15}}>
                    {/* <Col>
                    <Header>Details:</Header>
                    </Col> */}
                <Container>
              
                  <Row>
                    
                  <Col>
                  <h5>Requester</h5>

                  <Card style={{boxShadow: "none"}}>
      <CardHeader
        action={
          <IconButton onClick={this.toggleContactInfo.bind(this)} aria-label="show more" > <ExpandMoreIcon /> </IconButton>
        }
        avatar={
          <Avatar aria-label="recipe">
            R
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title="User Name"
        subheader={<>Title<br/><span style={{fontSize: "0.7em"}}>Requester is subscribed to updates</span></>}
      />
       
          {/* <CardActions disableSpacing>
  
        <IconButton
    
          onClick={this.toggleContactInfo.bind(this)}
      
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions> */}
       <Collapse in={this.state.contactExpanded} timeout="auto" unmountOnExit>
        <CardContent>
      <List component="div">
      <ListItem>
                                <ListItemIcon>
                                    <MailOutlineRoundedIcon style={{color:"#4780F7"}} />
                                </ListItemIcon>
                                <ListItemText secondary={"email"} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText 
                                secondary={"dept"} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <img src={location_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText ssecondary={"location"} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <img src={mobile_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={"phone"} />
                            </ListItem>
                        </List>
      </CardContent>
      </Collapse>
    </Card>

                  </Col>
                    <Col>
                    <h5>Activity</h5>

                    <Card style={{boxShadow: "none"}}>
                    <CardContent style={{padding: 0}}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <Row style={{padding: "3px 0 3px"}}>
                          <Col xs={9}><strong>Opened</strong> by <strong>User</strong> </Col>
                          <Col>3d ago</Col>
                        </Row>
                        <Row style={{padding: "3px 0 3px"}}>
                          <Col xs={9}>Stage set to <strong>In progress</strong> by <strong> Another User</strong></Col>
                          <Col>3d ago</Col>
                        </Row>
                       
                      </Typography>
                    </CardContent>
                  </Card>
                    
                    
                    </Col>
                    <Col>
                    
                    <h5>Data</h5>

<Card style={{boxShadow: "none"}}>
<CardContent style={{padding: 0}}>
  <Typography variant="body2" color="textSecondary" component="p">
    <Row style={{padding: "3px 0 3px"}}>
      <Col xs={9}><strong>Description:</strong> the old brown dog jumped <strong>User</strong> </Col>
      <Col>3d ago</Col>
    </Row>
    <Row style={{padding: "3px 0 3px"}}>
    <Col xs={9}><strong>Description:</strong> the old brown dog jumped <strong>User</strong> </Col>
      <Col>3d ago</Col>
    </Row>
   
  </Typography>
</CardContent>
</Card>

                    
                    </Col>
                  </Row>
                  <Row style={{padding: "5px 0 5px"}}>
                    <Col> 
                      <h5>Update</h5>
                    </Col>
                  </Row>
                  <Row  style={{padding: "5px 0 5px"}}>
                    <Col xs={3}> 
                
        <InputGroup>
        <Input placeholder="Change stage..." type="select" name="select" id="exampleSelect">
        <option value="" disabled selected>Change stage...</option>
     
        </Input>
        </InputGroup>
 
                 
                     
                    </Col>
                    <Col xs={9}>
                     
                      {/* <Form>
                        <Form.Dropdown label="fields" selection defaultValue={"open"} options={[{"text":"open"}]} />
                        </Form>
                      */}
                    </Col>

                  </Row>
                  <Row style={{padding: "8px 0 8px"}}>
                    <Col>
                    <InputGroup>
                        <Input placeholder="Memo (optional)" type="text" name={"description"} id="description"  />
                    </InputGroup> 
                      {/* <Form>
                        <Form.Input label="Memo (optional)"/>
                        <Form.Button>Submit</Form.Button>
                      </Form> */}
                    </Col>
                  </Row>
                  <Row style={{padding: "8px 0 8px"}}>
                    <Col>
                    <Button color="primary">Submit</Button></Col>
                  </Row>
                </Container>
                </div>
            
              </Paper>
            </Col>
          </Row>
       
        </div>
        
      </React.Fragment>
    );
  }
}

export default withRouter(Inbox);