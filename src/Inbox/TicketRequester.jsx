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

    return(
      <React.Fragment>
 
        <Row style={{ padding: "3px 0 3px",color: "rgba(0, 0, 0, 0.54)", fontSize: "0.9em" }}>
          <Col style={{minWidth: "40px"}} sm={1}>
            {userImg ? ( <Avatar style={{height: 30, width: 30}} src={userImg}></Avatar> ) : ( <Avatar  style={{height: 30, width: 30}}>{userInitials}</Avatar> )}
          </Col>
          <Col>
            <div>
              <span style={{fontSize: "1.1em"}}>
                {requester.displayName}
              </span>
              {requester.profile.Title && (
                <p style={{ fontSize: "0.9em", color: "rgba(0, 0, 0, 0.54)" }}>
                  {requester.profile.Title}
                </p>
              )}
            </div>
       
        
             
           
              {requester.email && <> <span style={{whiteSpace: "nowrap"}}> <MailOutlineRoundedIcon style={iconStyle} /> {requester.email} </span></>}
              {requester.profile.Department && <> <span> <GroupIcon style={iconStyle} /> {requester.profile.Department}  </span></>}
   
      
             {requester.profile.Location && <>  <span>   <RoomRoundedIcon style={iconStyle} /> {requester.profile.Location}</span></>}
             {requester.profile.Mobile && <>  <span>  <PhoneIcon style={iconStyle} />  {requester.profile.Mobile} </span> </>}
 
            </Col>
            </Row>
            </React.Fragment>

)}};
    
    
