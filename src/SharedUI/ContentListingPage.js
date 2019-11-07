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
    };

    const createContent = () => {
      this.props.history.push(
        mode === "policy"
          ? "/panel/faqs/content/new"
          : `/panel/announcements/content/new`
      );
    };

    const handleFeatured = async (action, tableinfo) => {
      const accountID = AccountStore.account.accountID;
      tableinfo.data.forEach(async i => {
        const ID = mode === "announcement" ? AnnouncementsStore.allAnnouncements[i.dataIndex].announcementID : PoliciesStore.allPolicies[i.dataIndex].policyID;
        if (mode === "announcement") await modifyAnnouncement({ accountID, announcementID: ID, featured: action === "feature" }, false);
        else await modifyPolicy({ accountID, policyID: ID, featured: action === "feature" }, false)
      });
    };

    const columns = [{
      options: {
        filter: false,
        sort: false,
      }
    }, {
      label: "Featured",
      name: "Featured",
      options: {
        filter: false,
        sort: false,
      }
    }, "Title", "Last Updated", "Channel", "State"];

    const data = all.map(item => [
      <LazyImg
        style={{
          height: 75,
          width: 120,
          objectFit: item.img ? "cover" : "contain"
        }}
        alt=""
        height={75}
        width={120}
        img={item.img}
        src={
          item.img
            ? item.img
            : "https://yallhandsgeneral.s3.amazonaws.com/no-image-icon.png"
        }
      />,
      item.featured && <Chip icon={<StarRoundedIcon />} label="Featured" variant="outlined" />,
      item.label,
      UTCtoFriendly(item.updated),
      ChannelStore._getLabel(item.chanID),
      item.state === "ok" ? "published" : item.state
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
      filterList: [["active"]],
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,
      onRowClick: (i, data) => handleClick(all[data.dataIndex])
    };

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
              <MUIDataTable
                // title={"Employee List"}
                data={data}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(ContentListingPage);
