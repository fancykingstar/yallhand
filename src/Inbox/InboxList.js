import React from "react";
import { makeStyles,ListItem, List, Divider, ListItemText, ListItemAvatar, ListItemSecondaryAction, Checkbox, Avatar, Typography, MobileStepper } from "@material-ui/core";
import { Label } from "semantic-ui-react";
import { Row, Col } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";
import { TicketingStore } from "../Stores/TicketingStore";

import TimeAgo from 'react-timeago';
import moment from "moment";



const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline"
  }
}));




export default function InboxList(props) {
  const classes = useStyles();

  const filterSource = async (val) => {
    const {sourceOrig} = this.state;
    const newSource = {
      active: await sourceOrig.filter(ticket => !ticket._stage.includes("close")),
      closed: await sourceOrig.filter(ticket => ticket._stage.includes("close") || ticket.stage.includes("reject")),
      all: sourceOrig
    }[val]
    // this.setState({filter: val, source: newSource, selected: null})
  }

  const source = () => {
    if (props.filter === "closed") return TicketingStore.allTickets.filter(ticket => ticket._stage && ticket._stage.includes("close"));
    else if (props.filter === "active") return TicketingStore.allTickets.filter(ticket => ticket._stage && !ticket._stage.includes("close"));
    else if (props.filter === "pending") return TicketingStore.allTickets.filter(ticket => ticket._stage && ticket._stage === "open-pending");
    else if (props.filter === "all") return TicketingStore.allTickets;
    return TicketingStore.allTickets.filter(ticket => moment.duration(moment(new Date()).diff(moment(ticket._updated))).asDays() < 15 );
  }

  const sortdata = (data) => {
    return props.sort === "new" ?
          data
            .sort((a, b) => b["_updated"] - a["_updated"])
          : 
          data
          .sort((a, b) => a["_updated"] - b["_updated"]);       
  }

  return (
    <List className={classes.root}>
      {sortdata(source()).filter(i=>!i.isTemplate).map((ticket, i) => (

                <>
                <ListItem onClick={()=>props.handleClick(ticket.ticketID)} className={props.selected === ticket.ticketID? "InboxListItem InboxListItemActive": ticket._unread? "InboxListItemUnread" : "InboxListItem"}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Row>
                          <Col sm={8}>
                 
                          <Typography
                          style={{fontSize: "0.9em", color: ticket._stage.includes("close")? "#ABACAB": "#000"}}
                          color="textPrimary" >
                                       {/* {"content" + JSON.stringify(ticket._content)} */}
                          {ticket._content? ticket._content.label : ticket._parent? ticket._parent.label : ""}
                        </Typography>
                          </Col>
                          <Col className="text-right"><Typography style={{fontSize: "0.8em", color: "#ABACAB"}}>  <TimeAgo date={ticket._updated} /></Typography> 
                          </Col>
                        </Row>
                        <Row>
                        <Col sm={6}>
                          {!ticket._stage.includes("close") &&
                          <MobileStepper
                  
                            style={{paddingLeft: 0, paddingTop: 10,  backgroundColor: "transparent" }}
                            variant="progress"
                            steps={ticket._progress.steps}
                            position="static"
                            activeStep={ticket._progress.activeStep}
                            
                          />
          }
                        </Col>
                        {!ticket._stage.includes("close") &&
                        <Col className="text-right">
                        
                        <Label color={ticket._currentAssignee? "blue" : "red"} size="mini">
                                    {ticket._currentAssignee? AccountStore._getUser(ticket._currentAssignee).displayName : "Unassigned"}
                                </Label>
                        </Col>
                        } 
                      </Row>
                      </React.Fragment>
                    }
                  />
                </ListItem>
       
            {props.source.length && i !== props.source.length -1 ? 
            <Divider component="li" /> : ""}
       
              </>
      ))}
    </List>
  );
}
