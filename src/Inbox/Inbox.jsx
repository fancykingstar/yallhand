import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Header } from "semantic-ui-react";
import { Container, Row, Col} from "reactstrap"
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

class Inbox extends React.Component {
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
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
        }
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
        subheader="Title"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          email phone location
        </Typography>
      </CardContent>
    </Card>

                  </Col>
                    <Col>
                    <h5>Activity</h5>

                    <Card style={{boxShadow: "none"}}>
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <Row>
                          <Col><strong>Opened</strong> by <strong>User</strong> </Col>
                          <Col>3d ago</Col>
                        </Row>
                        <Row>
                          <Col>Stage set to <strong>In progress</strong> by <strong> Another User</strong></Col>
                          <Col>3d ago</Col>
                        </Row>
                       
                      </Typography>
                    </CardContent>
                  </Card>
                    
                    
                    </Col>
                    <Col>
                    
                    <h5>Data</h5>

<Card style={{boxShadow: "none"}}>
<CardContent>
  <Typography variant="body2" color="textSecondary" component="p">
    <Row>
      <Col><strong>Description:</strong> the old brown dog jumped <strong>User</strong> </Col>
      <Col>3d ago</Col>
    </Row>
    <Row>
    <Col><strong>Description:</strong> the old brown dog jumped <strong>User</strong> </Col>
      <Col>3d ago</Col>
    </Row>
   
  </Typography>
</CardContent>
</Card>

                    
                    </Col>
                  </Row>
                  <Row>
                    <Col> 
                      <h5>Update</h5>
                    </Col>
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