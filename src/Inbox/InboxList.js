import React from "react";
import { makeStyles,ListItem, List, Divider, ListItemText, ListItemAvatar, ListItemSecondaryAction, Checkbox, Avatar, Typography, MobileStepper } from "@material-ui/core";
import { Label } from "semantic-ui-react";
import { Row, Col } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";

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
  return (
    <List className={classes.root}>
      {props.source.map((ticket, i) => (

                <>
                <ListItem onClick={()=>props.handleClick(i)} className={props.selected && props.selected.ticketID === ticket.ticketID? "InboxListItem InboxListItemActive":"InboxListItem"}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Row>
                          <Col sm={8}>
                          <Typography
                          style={{fontSize: "0.9em", color: ticket._stage.includes("close")? "#ABACAB": "#000"}}
                          color="textPrimary" >
                          {ticket._parentLabel}
                        </Typography>
                          </Col>
                          <Col className="text-right"><Typography style={{fontSize: "0.8em", color: "#ABACAB"}}>  <TimeAgo date={ticket.updated} /></Typography> 
                          </Col>
                        </Row>
                        <Row>
                        <Col sm={8}>
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
