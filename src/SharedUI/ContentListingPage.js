import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Button, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { LazyImg } from "./LazyImg";
import MUIDataTable from "mui-datatables";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import CustomToolbarSelect from "./CustomToolbarSelect";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { modifyAnnouncement, modifyPolicy } from "../DataExchange/Up";
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import Chip from '@material-ui/core/Chip';
import styled from "styled-components";
import "./style.css";

@inject(
  "AnnouncementsStore",
  "PoliciesStore",
  "AccountStore",
  "UIStore",
  "DataEntryStore",
  "ChannelStore"
)
@observer
class ContentListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    const { DataEntryStore, UIStore } = this.props;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    DataEntryStore.reset("contentmgmt");
    UIStore.reset("content");
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

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
          },
          responsiveScrollMaxHeight: {
            maxHeight: '678px !important'
          }
        }
      }
    });

  render() {
    const {
      AnnouncementsStore,
      UIStore,
      PoliciesStore,
      DataEntryStore,
      ChannelStore,
      AccountStore
    } = this.props;
    const mode = this.props.mode;
    const source = mode === "announcement" ? AnnouncementsStore : PoliciesStore;
    const all =
      mode === "announcement"
        ? AnnouncementsStore.allAnnouncements
        : PoliciesStore.allPolicies;
    const id = `${mode}ID`;

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

    const handleClick = val => {
      UIStore.set("content", id, val[id]);
      const content = Object.assign({}, val);
      UIStore.set(
        "content",
        "variationID",
        source._toggleGlobalVariation(content[id])
      );
      DataEntryStore.set("contentmgmt", "label", content.label);
      DataEntryStore.set("contentmgmt", "img", content.img);
      DataEntryStore.set("contentmgmt", "bundle", "queue");
      DataEntryStore.set("contentmgmt", "keywords", content.keywords);
      DataEntryStore.set("contentmgmt", "reviewAlert", content.reviewAlert);
      this.props.history.push(
        `/panel/${mode === "announcement" ? "announcements" : "faqs"}/${
        UIStore.content[id]
        }`
      );
      {/*this.props.history.push({pathname: `/panel/content/${UIStore.content[id]}`, state: {mode: mode}});*/}
    };

    const createContent = () => {
      this.props.history.push(
              mode === "policy"
                ? "/panel/faqs/content/new"
                : `/panel/announcements/content/new`
            );
      {/*this.props.history.push({pathname: '/panel/content', state: {mode: mode}});*/}
    };

    const handleFeatured = async (action, tableinfo) => {
      const accountID = AccountStore.account.accountID;
      tableinfo.data.forEach(async i => {
        const ID = mode === "announcement" ? AnnouncementsStore.allAnnouncements[i.dataIndex].announcementID : PoliciesStore.allPolicies[i.dataIndex].policyID;
        if (mode === "announcement") await modifyAnnouncement({ accountID, announcementID: ID, featured: action === "feature" }, false);
        else await modifyPolicy({ accountID, policyID: ID, featured: action === "feature" }, false)
      });
    };

   
    const columns = [
      {
        name: "images",
        options: {
          customBodyRender: img => { return  <LazyImg style={{ height: 75, width: 120, objectFit: img ? "cover" : "contain" }} alt="" height={75} width={120} img={img} src={ img ? img : "https://yallhandsgeneral.s3.amazonaws.com/no-image-icon.png" } /> ; },
          filter: false,
        },
      }, 
      {
        label: "Featured",
        name: "Featured",
        options: {
          filter: true,
          sort: false,
          customBodyRender: featured => { return  featured && <Chip icon={<StarRoundedIcon />} label="Featured" variant="outlined" />},
          filterOptions: {
            names: ['Featured', "Not Featured"],
            logic(featured, filterVal) {
              const show = (filterVal.indexOf("Featured") >= 0 && featured == true) || (filterVal.indexOf("Not Featured") >= 0 && featured != true);
              return !show
            }
          },
        }
      }, 
      {name:  "Title", options: { filter: false }},
      {name:  "Last Updated", options: { filter: false }},
      {name:  "Channel", options: { filter: true }},
      {name:  "Stage", options: { filter: true }}
    ];

    const mobileColumns = [ 
      {name:  "Title"},
      {name:  "Last Updated"},
    ];

    const data = all.map(item => [
      item.img,
      item.featured,
      item.label,
      UTCtoFriendly(item.updated),
      ChannelStore._getLabel(item.chanID),
      item.state === "ok" ? "published" : item.state
    ]);

    const mobileData = all.map(item => [
      item.label,
      UTCtoFriendly(item.updated),
    ]);

    const options = {
      elevation: 1,
      selectableRows: "multiple",
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          data={all}
          selectedRows={selectedRows}
          handleClick={(e, v) => handleFeatured(e, v)}
        />
      ),
      filter: true,
      filterType: "dropdown",
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,
      onRowClick: (i, data) => handleClick(all[data.dataIndex])
    };

    const { width } = this.state;

    return (
      <React.Fragment>
        <div>
          <Header as="h2" style={{ padding: 0, margin: 0 }}>
            {mode === "announcement" ? "Announcements Feed" : "FAQs"}
            <Header.Subheader>
              {mode === "announcement"
                ? "Post relevant content for news and other updates"
                : "Add frequently asked questions and answers"}
            </Header.Subheader>
          </Header>
          <MenuContainer>
            <div style={{ textAlign: "center" }}>
              <Button color="blue" onClick={() => createContent()}>
                {" "}
                <Icon name="plus" /> Create New...{" "}
              </Button>
            </div>
          </MenuContainer>
          <div className="muidatatable-custom" style={{ marginTop: 15 }}>
            <MuiThemeProvider theme={this.getMuiTheme()}>
              {
                width > 767?  <MUIDataTable
                                // title={"Employee List"}
                                data={data}
                                columns={columns}
                                options={options}
                              />
                            :
                              <MUIDataTable
                                data={mobileData}
                                columns={mobileColumns}
                                options={options}
                              />
              }
            </MuiThemeProvider>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(ContentListingPage);
