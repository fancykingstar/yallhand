import React from "react";
import { Paper, Avatar, List, ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import {Row, Col, Container} from "reactstrap";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
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
    const pTags = {
      fontSize: "0.9em",
      marginLeft: "2px"
    }
    const divTags = {
      padding: "1px 5px 1px 5px",
      display: "flex",
      wordBreak: "break-all"
    }

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
              {requester.profile && requester.profile.Title && (
                <p style={{ fontSize: "0.9em", color: "rgba(0, 0, 0, 0.54)" }}>
                  {requester.profile.Title}
                </p>
              )}
            </div>
 
          </Col>
        </Row>
        <Row style={{ padding: "3px 0 3px",color: "rgba(0, 0, 0, 0.54)", fontSize: "0.9em" }}>
          <Col>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              { requester.profile && requester.email && <> <div style={divTags}> <MailOutlineRoundedIcon style={iconStyle} /><p style={pTags}>{requester.email}</p> </div></>}
              { requester.profile && requester.profile.Department && <> <div style={divTags}> <GroupIcon style={iconStyle} /><p style={pTags}>{requester.profile.Department}</p>  </div></>}
              { requester.profile && requester.profile.Location && <>  <div style={divTags}><RoomRoundedIcon style={iconStyle} /><p style={pTags}>{requester.profile.Location}</p></div></>}
              { requester.profile && requester.profile.Mobile && <>  <div style={divTags}>  <PhoneIcon style={iconStyle} /> <p style={pTags}>{requester.profile.Mobile}</p> </div> </>}
            </div>
          </Col>
        </Row>
      </React.Fragment>
)}};