import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Input, Icon } from "semantic-ui-react";
import { QLogo } from "../../../Assets/Graphics/QLogo";
import search_icon from "../../assets/images/search_icon.svg";
import { AppBar, Tabs, Tab } from '@material-ui/core';
import Layout from '../../layouts/DefaultLayout';
import {
  initSearchObj,
  stupidSearch
} from "../../../SharedCalculations/StupidSearch";
// import "./style.css";

@inject(
  "UIStore",
  "AnnouncementsStore",
  "PoliciesStore",
  "ResourcesStore",
  "AccountStore"
)
@observer
class SearchFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchFocused: false };
  }
  componentDidMount() {
    const {
      AnnouncementsStore,
      PoliciesStore,
      ResourcesStore,
      UIStore,
      AccountStore
    } = this.props;
    if (UIStore.search.searchAnnouncementsData.length === 0) {
      UIStore.set(
        "search",
        "searchAnnouncementsData",
        initSearchObj(AnnouncementsStore.allAnnouncements, "announcementID")
      );
    }
    if (UIStore.search.searchPoliciesData.length === 0) {
      UIStore.set(
        "search",
        "searchPoliciesData",
        initSearchObj(PoliciesStore.allPolicies, "policyID")
      );
    }
    if (UIStore.search.searchUrlsData.length === 0) {
      UIStore.set(
        "search",
        "searchUrlsData",
        initSearchObj(ResourcesStore.urlResources, "resourceID")
      );
    }
    if (UIStore.search.searchFilesData.length === 0) {
      UIStore.set(
        "search",
        "searchFilesData",
        initSearchObj(ResourcesStore.fileResources, "resourceID")
      );
    }
    if (UIStore.search.searchPeopleData.length === 0) {
      UIStore.set(
        "search",
        "searchPeopleData",
        initSearchObj(AccountStore.allUsers, "userID")
      );
    }
  }
  render() {
    const { UIStore } = this.props;

    const invisiButton = {
      border: 0,
      backgroundColor: "Transparent",
      outline: "none"
    };

    const searchOrClear = () =>
      this.props.location.pathname.includes("search") ||
      UIStore.search.portalSearchValue !== "" ? (
        <button
          style={invisiButton}
          onClick={e => {
            UIStore.set("search", "portalSearchValue", "");
            this.props.history.goBack();
          }}
        >
          <Icon style={{ color: "#2dbffe" }} name="remove circle" />
        </button>
      ) : (
        <button style={invisiButton} onClick={e => submitSearch(e)}>
          <Icon style={{ color: "#2dbffe" }} name="search" />{" "}
        </button>
      );

    const submitSearch = e => {
      e.preventDefault();
      this.props.history.push("/portal/search");
    };

    return (


            <form>
              <div className="search_div">
                <input
                  onFocus={() => this.setState({ searchFocused: true })}
                  onBlur={() => this.setState({ searchFocused: false })}
                  onKeyDown={e => {
                    if (e.key === "Enter") submitSearch(e);
                  }}
                  onChange={e =>
                    UIStore.set("search", "portalSearchValue", e.target.value)
                  }
                  value={UIStore.search.portalSearchValue}
                  type="text"
                  name="search"
                  placeholder="Search"
                ></input>

                <button>
                  <img src={search_icon} alt="" />
                </button>
              </div>
            </form>
   

      // <div className="PortalSearchContainer">
      //   <div className="PortalSearchForm" style={{backgroundColor: this.state.searchFocused? "rgba(185, 185, 185, 0.37)":"rgba(129, 129, 129, 0.37)"}}>
      // <Input
      //   value={UIStore.search.portalSearchValue}
      //   onChange={(e, val) => UIStore.set("search", "portalSearchValue", val.value)}
      //   fluid icon
      //   placeholder="Search...">
      //     <input
      //     onFocus={() => this.setState({searchFocused: true})}
      //     onBlur={() => this.setState({searchFocused: false})}
      //     onKeyDown={e => {if(e.key === "Enter") submitSearch(e)}}
      //     style={{background: "transparent", border: "none", color: "#FFFFFF"}}
      //     />
      //     {searchOrClear()}
      //   </Input>
      // </div></div>
    );
  }
}

export default withRouter(SearchFrame);
