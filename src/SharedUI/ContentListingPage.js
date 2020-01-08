/* eslint-disable no-unused-vars */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import Chip from '@material-ui/core/Chip';
import styled from 'styled-components';

import { LazyImg } from './LazyImg';
import UTCtoFriendly from '../SharedCalculations/UTCtoFriendly';
import CustomToolbarSelect from './CustomToolbarSelect';
import { modifyAnnouncement, modifyPolicy } from '../DataExchange/Up';
import './style.css';

const MenuContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  paddingbottom: 30px;
  @media (max-width: 580px) {
    justify-content: center;
    flex-direction: column;
  }
`;

@inject(
  'AnnouncementsStore',
  'PoliciesStore',
  'AccountStore',
  'UIStore',
  'DataEntryStore',
  'ChannelStore',
)
@observer
class ContentListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0 };
  }

  componentDidMount() {
    const { DataEntryStore, UIStore, } = this.props;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    // DataEntryStore.reset("contentmgmt");
    // UIStore.reset("content");
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  }

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
          responsiveScrollMaxHeight: {
            maxHeight: '678px !important',
          },
        },
      },
    });

  handleClick = val => {
    const {
      AnnouncementsStore,
      UIStore,
      DataEntryStore,
      PoliciesStore,
    } = this.props;
    const { mode, history } = this.props;
    const id = `${mode}ID`;
    const source = mode === 'announcement' ? AnnouncementsStore : PoliciesStore;
    const content = { ...val };

    UIStore.set('content', id, val[id]);
    UIStore.set(
      'content',
      'variationID',
      source._toggleGlobalVariation(content[id])
    );
    DataEntryStore.set('contentmgmt', 'label', content.label);
    DataEntryStore.set('contentmgmt', 'img', content.img);
    DataEntryStore.set('contentmgmt', 'bundle', 'queue');
    DataEntryStore.set(
      'contentmgmt',
      'qanda',
      content.variations.filter(
        i => i.variationID === UIStore.content.variationID
      )[0].qanda
    );
    DataEntryStore.set('contentmgmt', 'keywords', content.keywords);
    DataEntryStore.set('contentmgmt', 'reviewAlert', content.reviewAlert);
    history.push(
      `/panel/${mode === 'announcement' ? 'announcements' : 'faqs'}/${
      UIStore.content[id]
      }`
    );
  };

  createContent = () => {
    const { mode, history } = this.props;
    history.push(
      mode === 'policy'
        ? '/panel/faqs/content/new'
        : '/panel/announcements/content/new'
    );
  };

  handleFeatured = async (action, tableinfo) => {
    const {
      AnnouncementsStore,
      PoliciesStore,
      AccountStore,
    } = this.props;
    const { mode } = this.props;
    const { accountID } = AccountStore.account;

    tableinfo.data.forEach(async i => {
      const ID = mode === 'announcement'
        ? AnnouncementsStore.allAnnouncements[i.dataIndex].announcementID
        : PoliciesStore.allPolicies[i.dataIndex].policyID;

      if (mode === 'announcement') {
        await modifyAnnouncement({
          accountID,
          announcementID: ID,
          featured: action === 'feature',
        }, false);
      }
      else {
        await modifyPolicy({
          accountID,
          policyID: ID,
          featured: action === 'feature',
        }, false);
      }
    });
  };

  render() {
    const {
      AnnouncementsStore,
      PoliciesStore,
      ChannelStore,
    } = this.props;
    const { mode, } = this.props;
    const all =
      mode === 'announcement'
        ? AnnouncementsStore.allAnnouncements
        : PoliciesStore.allPolicies;

    const columns = [
      {
        options: {
          customBodyRender: img => (
            <LazyImg
              style={{
                height: 75,
                width: 120,
                objectFit: img ? 'cover' : 'contain',
              }}
              alt=""
              height={75}
              width={120}
              img={img}
              src={
                img || 'https://yallhandsgeneral.s3.amazonaws.com/no-image-icon.png'
              }
            />
          ),
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
            return featured && (
              <Chip
                icon={<StarRoundedIcon />}
                label="Featured"
                variant="outlined"
              />
            );
          },
          filterOptions: {
            names: [
              'Featured',
              'Not Featured',
            ],
            logic(featured, filterVal) {
              const show = (
                filterVal.indexOf('Featured') >= 0 && featured === true
              ) || (
                  filterVal.indexOf('Not Featured') >= 0 && featured !== true
                );
              return !show;
            },
          },
        },
      },
      { name: 'Title', options: { filter: false, }, },
      { name: 'Last Updated', options: { filter: false, }, },
      { name: 'Channel', options: { filter: true, }, },
      { name: 'Stage', options: { filter: true, }, },
    ];

    const mobileColumns = [
      { name: 'Title', },
      { name: 'Last Updated', },
    ];

    const data = all.map(item => [
      item.img,
      item.featured,
      item.label,
      UTCtoFriendly(item.updated),
      ChannelStore._getLabel(item.chanID),
      item.state === 'ok' ? 'published' : item.state,
    ]);

    const mobileData = all.map(item => [
      item.label,
      UTCtoFriendly(item.updated),
    ]);

    const options = {
      elevation: 1,
      selectableRows: 'multiple',
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={all}
          selectedRows={selectedRows}
          handleClick={(e, v) => { this.handleFeatured(e, v); }}
        />
      ),
      filter: true,
      filterType: 'dropdown',
      print: false,
      responsive: 'scrollMaxHeight',
      viewColumns: false,
      download: false,
      onRowClick: (i, rowData) => { this.handleClick(all[rowData.dataIndex]); },
    };

    const { width, } = this.state;

    return (
      <>
        <div>
          <Header
            as="h2"
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            {mode === 'announcement' ? 'Announcements Feed' : 'FAQs'}
            <Header.Subheader>
              {mode === 'announcement'
                ? 'Post relevant content for news and other updates'
                : 'Add frequently asked questions and answers'}
            </Header.Subheader>
          </Header>
          <MenuContainer>
            <div style={{ textAlign: 'center', }}>
              <Button
                color="blue"
                onClick={this.createContent}
              >
                {' '}
                <Icon name="plus" />
                Create New...
                {' '}
              </Button>
            </div>
          </MenuContainer>
          <div
            className="muidatatable-custom"
            style={{ marginTop: 15, }}
          >
            <MuiThemeProvider theme={this.getMuiTheme()}>
              {
                width > 767 ? (
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
                )
              }
            </MuiThemeProvider>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ContentListingPage);
