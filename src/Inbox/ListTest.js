import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Label } from "semantic-ui-react";
import {TicketingStore} from "../Stores/TicketingStore"
import MobileStepper from '@material-ui/core/MobileStepper';
import {Row, Col} from "reactstrap";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));




export default function ListTest() {
  const classes = useStyles();
  const source = TicketingStore.allTickets.filter(i=>!i.isTemplate)
  return (
    <List className={classes.root}>
        {source.map(ticket => 
        <>
            <Row>
                <Col>

                <ListItem alignItems="flex-start">
             <ListItemAvatar>
               <Avatar>M</Avatar>
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
                  {  TicketingStore._getTicket(ticket.parent).label}
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
                     Assigned to <Label color="blue" size="mini">You</Label> <strong>4 days ago</strong>
                   </Typography>
                   
                 </React.Fragment>
               }
             />
           
           </ListItem>

                </Col>
            </Row>
             <Row>
                 <Col>

                 <MobileStepper
             style={{paddingLeft: 20}}
              variant="progress"
              steps={6}
              position="static"
              activeStep={3}
              className={classes.root}
              />

                 </Col>
             </Row>
           
              
              </>
            )}
     
      {/* <Divider variant="inset" component="li" /> */}

    </List>
  );
}