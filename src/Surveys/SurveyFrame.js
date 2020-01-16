import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import Chip from '@material-ui/core/Chip';
import { Button, Icon, Header } from 'semantic-ui-react';
import styled from 'styled-components';

import CustomToolbarSelect from '../SharedUI/CustomToolbarSelect';
import { AccountStore } from '../Stores/AccountStore';
import { ChannelStore } from '../Stores/ChannelStore';
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly';
import { modifySurvey } from '../DataExchange/Up';
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

@inject(
  'SurveyStore',
  'TaskStore',
  'PollStore'
)
@observer
class SurveyFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0 };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
    });
  };

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
          root: { zIndex: '1' },
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

  handleClick = survey => {
    const { history, mode } = this.props;
    if (mode === 'survey') {
      history.push(`/panel/surveys/manage-survey/${survey ? survey.surveyID : ''}`);
    } else if (mode === 'task') {
      history.push(`/panel/tasks/manage-task/${survey ? survey.surveyID : ''}`);
    } else {
      history.push(`/panel/polls/manage-poll/${survey ? survey.surveyID : ''}`);
    }
  };

  handleFeatured = async (action, tableinfo) => {
    const { SurveyStore, TaskStore, PollStore, mode } = this.props;
    const {accountID} = AccountStore.account;
    tableinfo.data.forEach(async i => {
      let ID = null;
      
      if (mode === 'survey') {
        ID = SurveyStore.allSurveys[i.dataIndex].surveyID
      } else if (mode === 'task') {
        ID = TaskStore.allTasks[i.dataIndex].surveyID;
      } else {
        ID = PollStore.allPolls[i.dataIndex].surveyID;
      }

      await modifySurvey({
        accountID,
        surveyID: ID,
        type: mode,
        featured: action === 'feature',
      });
    });
  };

  render() {
    const { SurveyStore, TaskStore, PollStore, mode } = this.props;
    let title = '';
    if (mode === 'survey') {
      title = 'Survey Title';
    } else if (mode === 'task') {
      title = 'Task Title';
    } else {
      title = 'Poll Title';
    }
    const columns = [
      {
        name: 'Feature',
        options: {
          filter: true,
          sort: false,
          customBodyRender: featured => {
            return (
              featured && <Chip icon={<StarRoundedIcon />} label="Featured" variant="outlined" />
            );
          },
          customHeadRender: () => (
            <th className="MuiTableCell-root">{' '}</th>
          ),
          filterOptions: {
            title: 'Featured',
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
            <th className="MuiTableCell-root">{' '}</th>
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
        name: title,
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
    let mobileColumns = null;
    if (mode === 'survey') {
      mobileColumns = ['Survey Title', 'Last Updated'];
    } else if (mode === 'task') {
      mobileColumns = ['Task Title', 'Last Updated'];
    } else {
      mobileColumns = ['Poll Title', 'Last Updated'];
    }
    let data = null;
    let mobileData = null;

    if (mode === 'survey') {
      data = SurveyStore.allSurveys.map(survey => [
        survey.featured,
        survey.active ? 'Active' : 'Inactive',
        survey.label,
        UTCtoFriendly(survey.updated),
        AccountStore._getDisplayName(survey.userID),
        ChannelStore._getLabel(survey.chanID),
      ]);
      mobileData = SurveyStore.allSurveys.map(survey => [
        survey.label,
        UTCtoFriendly(survey.updated),
      ]);
    } else if (mode === 'task') {
      data = TaskStore.allTasks.map(task => [
        task.featured,
        task.active ? 'Active' : 'Inactive',
        task.label,
        UTCtoFriendly(task.updated),
        AccountStore._getDisplayName(task.userID),
        ChannelStore._getLabel(task.chanID),
      ]);
      mobileData = TaskStore.allTasks.map(task => [
        task.label,
        UTCtoFriendly(task.updated),
      ]);
    } else {
      data = PollStore.allPolls.map(poll => [
        poll.featured,
        poll.active ? 'Active' : 'Inactive',
        poll.label,
        UTCtoFriendly(poll.updated),
        AccountStore._getDisplayName(poll.userID),
        ChannelStore._getLabel(poll.chanID)
      ]);
      mobileData = PollStore.allPolls.map(poll => [
        poll.label,
        UTCtoFriendly(poll.updated),
      ]);
    }

    let toolbarData = null;
    if (mode === 'survey') {
      toolbarData = SurveyStore.allSurveys;
    } else if (mode === 'task') {
      toolbarData = TaskStore.allTasks;
    } else {
      toolbarData = PollStore.allPolls;
    }
    const options = {
      elevation: 1,
      selectableRows: 'multiple',
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={toolbarData}
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
        let selectedData = null;
        if (mode === 'survey') {
          selectedData = SurveyStore.allSurveys[rowData.dataIndex];
        } else if (mode === 'task') {
          selectedData = TaskStore.allTasks[rowData.dataIndex];
        } else {
          selectedData = PollStore.allPolls[rowData.dataIndex];
        }
        this.handleClick(selectedData);
      },
    };

    const { width } = this.state;

    let header = '';
    let desc = '';
    if (mode === 'survey') {
      header = 'Surveys';
      desc = 'Get valuable feedback with custom surveys';
    } else if (mode === 'task') {
      header = 'Tasks';
      desc = 'Assign tasks to better track progress';
    } else {
      header = 'Polls';
      desc = 'Get valuable feedback with custom polls';
    }
    return (
      <>
        <Header
          as="h2"
          style={{
            padding: 0,
            margin: '10px 0 10px',
          }}
        >
          {header}
          <Header.Subheader>
            {desc}
          </Header.Subheader>
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
            {width > 767 ? (
              <MUIDataTable
                data={data}
                columns={columns}
                options={options}
              />
            ) : (
              <MUIDataTable
                data={mobileData}
                columns={mobileColumns}
                options={options}
              />
            )}
          </MuiThemeProvider>
        </div>
      </>
    );
  }
}

export default withRouter(SurveyFrame);
