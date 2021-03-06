import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import MUIDataTable from 'mui-datatables';
import Chip from '@material-ui/core/Chip';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import { Button, Icon, Header } from 'semantic-ui-react';
import styled from 'styled-components';

import { AccountStore } from '../Stores/AccountStore';
import { ChannelStore } from '../Stores/ChannelStore';
import CustomToolbarSelect from '../SharedUI/CustomToolbarSelect';
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly';
import { modifyTicket } from '../DataExchange/Up';
import '../SharedUI/style.css';

const MenuContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 30px;
  @media (max-width: 580px) {
    justify-content: center;
    flex-direction: column;
  }
`;

@inject('TicketingStore')
@observer
class TicketingFrame extends React.Component {
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            fontFamily: 'Lato',
            fontSize: '1em',
          },
        },
        MUIDataTableBodyRow: {
          root: {
            zIndex: '1',
          },
        },
        MUIDataTableSelectCell: {
          fixedHeader: {
            zIndex: '1',
          },
          headerCell: {
            zIndex: '1',
          },
        },
        MUIDataTableHeadCell: {
          fixedHeader: {
            zIndex: '1',
          },
        },
        MUIDataTable: {
          root: {
            backgroundColor: '#FF000',
          },
          paper: {
            boxShadow: 'none',
            border: '2px solid #e3e8ee',
            borderRadius: 8,
          },
        },
        MUIDataTableFilter: {
          title: {
            fontFamily: "Rubik"
          }
        },
        MuiButton: {
          label: {
            fontFamily: "Rubik"
          }
        },
        MuiInputLabel: {
          animated: {
            fontFamily: "Rubik"
          }
        },
        MuiInputBase: {
          root: {
            fontFamily: "Rubik"
          }
        },
        MuiChip: {
          label: {
            fontFamily: "Rubik"
          }
        },
        MuiTablePagination: {
          caption: {
            fontFamily: "Rubik"
          }
        }
      },
    });

  handleFeatured = async (action, tableinfo) => {
    const { TicketingStore } = this.props;
    const { accountID } = AccountStore.account;
    tableinfo.data.forEach(async i => {
      const ID = TicketingStore.allTickets[i.dataIndex].ticketID;
      await modifyTicket(
        {
          accountID,
          ticketID: ID,
          featured: action === 'feature',
        },
        true,
      );
    });
  };

  handleClick = ticket => {
    const { history } = this.props;
    history.push(`/panel/ticketing/manage-ticket${ticket ? `/${ticket.ticketID}` : ''}`);
  };

  render() {
    const { TicketingStore } = this.props;
    const columns = [
      {
        name: 'Featured',
        options: {
          filter: true,
          sort: false,
          customBodyRender: featured => featured && (
            <Chip
              icon={<StarRoundedIcon />}
              label="Featured"
              variant="outlined"
            />
          ),
          customHeadRender: () => (
            <th
              className="MuiTableCell-root"
            >
              {' '}
            </th>
          ),
          filterOptions: {
            names: ['Featured', 'Not Featured'],
            logic(featured, filterVal) {
              const show =
                (filterVal.indexOf('Featured') >= 0 && featured === true) ||
                (filterVal.indexOf('Not Featured') >= 0 && featured !== true);
              return !show;
            },
          },
        },
      },
      {
        name: 'Active',
        options: {
          customBodyRender: state => {
            if (state === "Active") {
              return (
                <div
                  className="ico-status"
                  style={{
                    backgroundColor: "#2FC7F8",
                    right: 0,
                  }}
                />
              );
            }
            return (
              <div
                className="ico-status"
                style={{
                  borderColor: "#585858",
                  borderWidth: 2,
                  borderStyle: "solid",
                }}
              />
            );
          },
          customHeadRender: () => (
            <th
              className="MuiTableCell-root"
            >
              {' '}
            </th>
          ),
          filter: true,
          filterOptions: {
            names: ['Active Only', 'Inactive Only'],
            logic(state, filterVal) {
              if (filterVal.indexOf('Active Only') >= 0 && state === 'Active') {
                return false;
              } if (filterVal.indexOf('Inactive Only') >= 0 && state !== 'Active') {
                return false;
              }
              return true;
            }
          }
        }
      },
      {
        name: 'Ticket Title',
        options: {
          filter: false,
        },
      },
      {
        name: 'Last Updated',
        options: {
          filter: false,
        },
      },
      {
        name: 'Created By',
        options: {
          filter: false,
        },
      },
      {
        name: 'Channel',
        options: {
          filter: true,
        },
      },
    ];

    const data = TicketingStore.allTickets
      .filter(ticket => ticket.isTemplate)
      .map(ticket => [
        ticket.featured,
        ticket.active ? 'Active' : 'Inactive',
        ticket.label,
        UTCtoFriendly(ticket.updated),
        AccountStore._getDisplayName(ticket.userID),
        ChannelStore._getLabel(ticket.chanID),
      ]);

    const options = {
      elevation: 1,
      selectableRows: 'multiple',
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={TicketingStore.allTickets}
          selectedRows={selectedRows}
          handleClick={(e, v) => {
            this.handleFeatured(e, v);
          }}
        />
      ),
      filter: true,
      filterType: 'dropdown',
      print: false,
      responsive: 'scrollMaxHeight',
      viewColumns: false,
      download: false,
      onRowClick: (i, rowData) => {
        this.handleClick(TicketingStore.allTickets[rowData.rowIndex]);
      },
    };

    return (
      <>
        <Header
          as="h2"
          style={{
            padding: 0,
            margin: '10px 0 10px',
          }}
        >
          Service Desk
          <Header.Subheader>Create ticketing workflows for common processes</Header.Subheader>
        </Header>
        <MenuContainer>
          <div style={{ textAlign: 'center' }}>
            <Button
              color="blue"
              onClick={() => {
                this.handleClick();
              }}
            >
              {' '}
              <Icon name="plus" />
              Create New...
              {' '}
            </Button>
          </div>
        </MenuContainer>
        <span />
        <div
          className="muidatatable-custom"
          style={{ marginTop: 15 }}
        >
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable data={data} columns={columns} options={options} />
          </MuiThemeProvider>
        </div>
      </>
    );
  }
}

export default withRouter(TicketingFrame);
