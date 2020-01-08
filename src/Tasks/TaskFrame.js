import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import Chip from '@material-ui/core/Chip';
import { Button, Icon, Header } from 'semantic-ui-react';
import styled from 'styled-components';

import { AccountStore } from '../Stores/AccountStore';
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly';
import CustomToolbarSelect from '../SharedUI/CustomToolbarSelect';
import { modifySurvey } from '../DataExchange/Up';

@inject('TaskStore')
@observer
class TaskFrame extends React.Component {
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
    this.setState({ width: window.innerWidth });
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
            zIndex: '1 !important',
          },
        },
        MUIDataTableSelectCell: {
          fixedHeader: {
            zIndex: '1 !important',
          },
          headerCell: {
            zIndex: '1 !important',
          },
        },
        MUIDataTableHeadCell: {
          fixedHeader: {
            // position: "relative"
            zIndex: '1 !important',
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
      },
    });

  handleClick = task => {
    const { history } = this.props;
    history.push(`/panel/tasks/manage-task/${task ? task.surveyID : ''}`);
  };

  handleFeatured = async (action, tableinfo) => {
    const { TaskStore } = this.props;
    const {accountID} = AccountStore.account;
    tableinfo.data.forEach(async i => {
      const ID = TaskStore.allTasks[i.dataIndex].surveyID;
      await modifySurvey({
        accountID,
        surveyID: ID,
        type: 'task',
        featured: action === 'feature',
      });
    });
  };

  render() {
    const { TaskStore } = this.props;
    const MenuContainer = styled.div`
      display: flex;
      flex-wrap: wrap;
      paddingbottom: 30px;
      @media (max-width: 580px) {
        justify-content: center;
        flex-direction: column;
      }
    `;

    const columns = [
      {
        name: 'Task Title',
        options: {
          filter: false,
        },
      },
      {
        label: 'Featured',
        name: 'Featured',
        options: {
          filter: true,
          sort: false,
          customBodyRender: featured => {
            return (
              featured && <Chip icon={<StarRoundedIcon />} label="Featured" variant="outlined" />
            );
          },
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
        name: 'Stage',
        options: {
          filter: true,
          filterOptions: {
            names: ['Active', 'InActive'],
            logic(stage, filterVal) {
              const show =
                (filterVal.indexOf('Active') >= 0 && stage === 'Active') ||
                (filterVal.indexOf('InActive') >= 0 && stage !== 'Active');
              return !show;
            },
          },
        },
      },
    ];

    const data = TaskStore.allTasks.map(task => [
      task.label,
      task.featured,
      UTCtoFriendly(task.updated),
      AccountStore._getDisplayName(task.userID),
      task.active ? 'Active' : 'Inactive',
    ]);

    const mobileColumns = ['Task Title', 'Last Updated'];

    const mobileData = TaskStore.allTasks.map(task => [task.label, UTCtoFriendly(task.updated)]);

    const options = {
      elevation: 1,
      selectableRows: 'multiple',
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={TaskStore.allTasks}
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
        this.handleClick(TaskStore.allTasks[rowData.dataIndex]);
      },
    };

    const { width } = this.state;

    return (
      <>
        <Header
          as="h2"
          style={{
            padding: 0,
            margin: '10px 0 10px',
          }}
        >
          Tasks
          <Header.Subheader>Assign tasks to better track progress</Header.Subheader>
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
              Create New..
              {' '}
            </Button>
          </div>
        </MenuContainer>
        <span />
        <div style={{ marginTop: 15 }}>
          <MuiThemeProvider theme={this.getMuiTheme()}>
            {width > 380 ? (
              <MUIDataTable data={data} columns={columns} options={options} />
            ) : (
              <MUIDataTable data={mobileData} columns={mobileColumns} options={options} />
            )}
          </MuiThemeProvider>
        </div>
      </>
    );
  }
}

export default withRouter(TaskFrame);
