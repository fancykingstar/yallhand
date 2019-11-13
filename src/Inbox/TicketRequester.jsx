import React from "react";
import { Paper, Avatar, List, ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import {Row, Col, Container} from "reactstrap";
// import {department_icon} from "../Assets/Icons/department_icon";
// import {location_icon} from "../Assets/Icons/location_icon";
// import {mobile_icon }from "../Assets/Icons/mobile_icon";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import {AccountStore} from "../Stores/AccountStore";
// import SvgIcon from '@material-ui/core/SvgIcon';
import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import GroupIcon from '@material-ui/icons/Group';
import PhoneIcon from '@material-ui/icons/Phone';

export class TicketRequester extends React.Component {
    constructor(props){
        super(props);
        this.state={contactExpanded: false}
    }

    toggleContactInfo() {
        this.setState({ contactExpanded: !this.state.contactExpanded });
      }
    
      async addlFields() {
        const { stage } = this.state;
        const { _parent } = this.props.data;
        if (!stage) return [];
        else if (stage.includes("close"))
          return await _parent.ticketItems.filter(i => i.isClose);
        else if (stage === "open")
          return await _parent.ticketItems.filter(i => i.isOpen);
        else
          return await _parent.ticketItems.filter(
            i => i.label && i.label === stage
          );
      }

    render(){
    const {userImg, requester, userInitials} = this.props;
    const iconStyle ={fontSize: "1.2em", color: "rgb(65, 131, 196)" };
    return(<>
       
        <Row style={{ padding: "3px 0 3px" }}>
          <Col sm={1}>
            {userImg ? (
              <Avatar src={userImg}></Avatar>
            ) : (
              <Avatar>{userInitials}</Avatar>
            )}
          </Col>
          <Col sm={2}>
            <div style={{ paddingLeft: 8 }}>
              <span>
                {requester.displayName}
              </span>
              {requester.profile.Title && (
                <p style={{ fontSize: "0.9em", color: "rgba(0, 0, 0, 0.54)" }}>
                  {requester.profile.Title}
                </p>
              )}
            </div>
          </Col>
          {/* <Col style={{ paddingTop: 5 }}>
            <KeyboardArrowDownRoundedIcon
              onClick={this.toggleContactInfo.bind(this)}
              className="ActiveIfHover"
            />
          </Col> */}
          <Col sm={6}>
          <Container>
            <Row>
             
           
              {requester.email &&  <Col sm={6}> <span style={{whiteSpace: "nowrap"}}> <MailOutlineRoundedIcon style={iconStyle} /> {requester.email} </span>    </Col>}
              {requester.profile.Department &&  <Col  sm={6}> <span style={{whiteSpace: "nowrap"}}> <GroupIcon style={iconStyle} /> {requester.profile.Department}  </span>  </Col>}
   
      
             {requester.profile.Location &&  <Col  sm={6}> <span style={{whiteSpace: "nowrap"}}> <RoomRoundedIcon style={iconStyle} /> {requester.profile.Location}</span>  </Col> }
             {requester.profile.Mobile &&  <Col  sm={6}> <span style={{whiteSpace: "nowrap"}}>  <PhoneIcon style={iconStyle} />  {requester.profile.Mobile}</span>  </Col> }
             {/* {requester.profile.Mobile &&  <span> <SvgIcon style={{marginBottom: 5, marginRight: 4}}> {mobile_icon}</SvgIcon>   {requester.profile.Mobile} </span> } */}
             {/* </Col>  */}
             
   
            </Row>
          </Container>


          {/* <List component="div">
              {requester.email && (
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemIcon>
                    <MailOutlineRoundedIcon
                      style={{ color: "#4780F7" }}
                    />
                  </ListItemIcon>
                  <ListItemText secondary={requester.email} />
                </ListItem>
              )}

              {requester.Department && (
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemIcon>
                    <img src={departmenticon} alt="" />
                  </ListItemIcon>
                  <ListItemText
                    secondary={equester.profile.Department}
                  />
                </ListItem>
              )}

              {requester.Location && (
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemIcon>
                    <img src={locationicon} alt="" />
                  </ListItemIcon>
                  <ListItemText
                    secondary={requester.profile.Location}
                  />
                </ListItem>
              )}

              {requester.Mobile && (
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemIcon>
                    <img src={mobileicon} alt="" />
                  </ListItemIcon>
                  <ListItemText
                    secondary={requester.profile.Mobile}
                  />
                </ListItem>
              )}
            </List> */}
          </Col>
        </Row>

        {/* <Collapse
          in={this.state.contactExpanded}
          timeout="auto"
          unmountOnExit
        >
          <div>
            
          </div>
        </Collapse> */}
        </>
    )}};
