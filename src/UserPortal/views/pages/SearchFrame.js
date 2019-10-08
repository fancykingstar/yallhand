import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { Event as EventIcon, Close as CloseIcon, Search as SearchIcon, } from '@material-ui/icons';
import { initSearchObj, stupidSearch } from "../../../SharedCalculations/StupidSearch";

@inject( "UIStore", "AnnouncementsStore", "PoliciesStore", "ResourcesStore", "AccountStore" )
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

    const submitSearch = e => {
      e.preventDefault();
      this.props.history.push("/portal/search");
    };

    const clearSearch = () => {
      UIStore.set("search", "portalSearchValue", "");
      this.props.history.goBack();
    }

    return (

      <form className="menu-search">
      <div className="search_div">
          <input 
              value={UIStore.search.portalSearchValue}
              type="text"
              name="search"
              placeholder="Search"
              onChange={e => UIStore.set("search", "portalSearchValue", e.target.value) }
              onFocus={() => this.setState({ searchFocused: true })}
              onBlur={() => this.setState({ searchFocused: false })}
              onKeyDown={e => {
                if (e.key === "Enter") submitSearch(e);
              }}
              />
          <button type="button" onClick={()=>submitSearch(e)}><SearchIcon /></button>
          {(UIStore.portalSearchValue !== '') ? (
              <button className="clearInput" type="button" onClick={()=>clearSearch()}><CloseIcon /></button>
          ) : ('')}
      </div>
  </form>


    );
  }
}

export default withRouter(SearchFrame);
