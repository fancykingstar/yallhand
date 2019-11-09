import React from "react";
import { makeStyles,ListItem, List, Divider, ListItemText, ListItemAvatar, ListItemSecondaryAction, Checkbox, Avatar, Typography, MobileStepper } from "@material-ui/core";
import { Label } from "semantic-ui-react";
import { Row, Col } from "reactstrap";

import { TicketingStore } from "../Stores/TicketingStore";

import TimeAgo from 'react-timeago'


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
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
          <div onClick={()=>props.handleClick(i)} className={props.selected.ticketID === ticket.ticketID? "InboxListItem InboxListItemActive":"InboxListItem"}>
            <Row>
              <Col>
                <ListItem alignItems="flex-start">
              
                  <ListItemAvatar>
                    { ticket._userImg ? <Avatar src={ticket._userImg}></Avatar> : <Avatar>{ticket._userInitials}</Avatar>}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body1"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {ticket.parent === "QandA"? "Content Q & A" : ticket._parentLabel}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {ticket.stage === "open"? `Opened ${ticket._currentAssignee? "and assigned to " : "and currently "}` : "Assigned to "}
                          <Label color={ticket._currentAssignee? "blue" : "red"} size="mini">
                            {ticket._currentAssignee? ticket._currentAssignee: "Unassigned"}
                          </Label><br/>
                          <strong><TimeAgo date={ticket.updated} /></strong>
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
          
                <MobileStepper
                  style={{ paddingLeft: 20 }}
                  variant="progress"
                  steps={ticket._progress.steps}
                  position="static"
                  activeStep={ticket._progress.activeStep}
                  className={classes.root}
                />
              </Col>
              <Col/>
            </Row>
            {props.source.length && i !== props.source.length -1 ? 
            <Divider style={{ marginTop: 10 }} component="li" /> : ""}
          </div>
        </>
      ))}
    </List>
  );
}
