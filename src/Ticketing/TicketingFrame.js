import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Header } from "semantic-ui-react";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";
import { TicketingStore } from "../Stores/TicketingStore";
import { AccountStore} from "../Stores/AccountStore";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

class TicketingFrame extends React.Component {
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

    const data = TicketingStore.allTickets.map(ticket => [ticket.label, UTCtoFriendly(ticket.updated), AccountStore._getDisplayName(ticket.userID), ticket.active? "Active":"Inactive"])
    


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
          Ticketing
          <Header.Subheader>
            Create ticketing workflows for common processes
          </Header.Subheader>
        </Header>
        <MenuContainer>
          <div style={{ textAlign: "center" }}>
            <Button color="blue" onClick={()=>handleClick()}>
              {" "}
              <Icon name="plus" /> Create New...{" "}
            </Button>
          </div>
        </MenuContainer>
        <span>
  </span>      
        <div style={{ marginTop: 15 }}>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            data={data}
            columns={columns}
            options={options}
          />
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(TicketingFrame);