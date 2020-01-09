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
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly';
import { modifySurvey } from '../DataExchange/Up';

@inject('SurveyStore')
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
          root: { zIndex: '1 !important' },
          fixedHeader: {
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

  handleClick = survey => {
    const { history } = this.props;
    history.push(`/panel/surveys/manage-survey/${survey ? survey.surveyID : ''}`);
  };

  handleFeatured = async (action, tableinfo) => {
    const { SurveyStore } = this.props;
    const {accountID} = AccountStore.account;
    tableinfo.data.forEach(async i => {
      const ID = SurveyStore.allSurveys[i.dataIndex].surveyID;
      await modifySurvey({
        accountID,
        surveyID: ID,
        type: 'survey',
        featured: action === 'feature',
      });
    });
  };

  render() {
    const { SurveyStore } = this.props;
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
        name: 'Survey Title',
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
    const mobileColumns = ['Survey Title', 'Last Updated'];

    const data = SurveyStore.allSurveys.map(survey => [
      survey.label,
      survey.featured,
      UTCtoFriendly(survey.updated),
      AccountStore._getDisplayName(survey.userID),
      survey.active ? 'Active' : 'Inactive',
    ]);
    const mobileData = SurveyStore.allSurveys.map(survey => [
      survey.label,
      UTCtoFriendly(survey.updated),
    ]);

    const options = {
      elevation: 1,
      selectableRows: 'multiple',
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={SurveyStore.allSurveys}
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
        this.handleClick(SurveyStore.allSurveys[rowData.dataIndex]);
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
          Surveys
          <Header.Subheader>Get valuable feedback with custom surveys and polls</Header.Subheader>
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

export default withRouter(SurveyFrame);
