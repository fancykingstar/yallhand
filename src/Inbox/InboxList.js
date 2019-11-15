import React from "react";
import { makeStyles,ListItem, List, Divider, ListItemText, ListItemAvatar, ListItemSecondaryAction, Checkbox, Avatar, Typography, MobileStepper } from "@material-ui/core";
import { Label } from "semantic-ui-react";
import { Row, Col } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";
import { TicketingStore } from "../Stores/TicketingStore";

import TimeAgo from 'react-timeago'



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

  return (
    <List className={classes.root}>
      {TicketingStore.allTickets.filter(i=>!i.isTemplate).map((ticket, i) => (

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
                          {ticket._parent && ticket._parent.label}
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
