import React from "react";
import { inject, observer } from "mobx-react";
import { Search } from "semantic-ui-react";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import _ from "lodash";

@inject("UIStore", "PoliciesStore", "AnnouncementsStore")
@observer
export class ContentSearch extends React.Component {
  constructor(props) {
    super(props);
    const { UIStore } = this.props;
    this.resetComponent = () => {
      UIStore.set("search", "contentResults", {});
      UIStore.set("search", "contentValue", "");
      UIStore.set("search", "contentSearchLoading", false);
    };
  }

  componentDidMount() {
    const { UIStore, PoliciesStore, AnnouncementsStore } = this.props;
    this.resetComponent();
    //Policies
    if (UIStore.search.searchPoliciesData.length === 0) {
      UIStore.set(
        "search",
        "searchPoliciesData",
        initSearchObj(PoliciesStore.allPolicies.filter(i => i.state !== "archived"), "policyID")
      );
    }
    //Announcements
    if (UIStore.search.searchAnnouncementsData.length === 0) {
      UIStore.set(
        "search",
        "searchAnnouncementsData",
        initSearchObj(AnnouncementsStore.allAnnouncements.filter(i => i.state !== "archived"), "announcementID")
      );
    }
  }

  render() {
    const { UIStore } = this.props;
    const { AnnouncementsStore } = this.props;
    const { PoliciesStore } = this.props;

    const handleResultSelect = (e, { result }) => {
      this.props.output(result);
      this.resetComponent();
    }

    const handleSearchChange = (e, { value }) => {
      UIStore.set("search", "contentSearchLoading", true);
      UIStore.set("search", "contentValue", value);
      setTimeout(() => {
        if (UIStore.search.contentValue.length < 1) {
          return this.resetComponent();
        } else {
          const policyRawResults = stupidSearch(
            UIStore.search.searchPoliciesData,
            UIStore.search.contentValue
          );
          const announcementRawResults = stupidSearch(
            UIStore.search.searchAnnouncementsData,
            UIStore.search.contentValue
          );
          const policies = PoliciesStore.allPolicies
            .filter(item => policyRawResults.includes(item.policyID))
            .map(policy => ({
              title: policy.label,
              image: policy.img,
              value: policy.policyID,
              type: "policy"
            }));
          const announcements = AnnouncementsStore.allAnnouncements
            .filter(item =>
              announcementRawResults.includes(item.announcementID)
            )
            .map(announcement => ({
              title: announcement.label,
              image: announcement.img,
              value: announcement.announcementID,
              type: "announcement"
            }));
          UIStore.set(
            "search",
            "contentResults",
            {
              "FAQs": { "name": "FAQs", "results": policies },
              "Announcements": { "name": "Announcements", "results": announcements }
            }
          );
        }
        UIStore.set("search", "contentSearchLoading", false);
      }, 300);
    };

    return (
      <div className="ContentSearchFrame">
        <p style={{ fontWeight: "800", color: "black" }}>Search and Add Content</p>
        <Search
          className="ContentSearch"
          // fluid
          category
          loading={UIStore.search.contentSearchLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 800, {
            leading: true
          })}
          results={
            _.isEmpty(UIStore.search.contentResults)
              ? {}
              : _.isEmpty(UIStore.search.contentResults.FAQs.results) && _.isEmpty(UIStore.search.contentResults.Announcements.results) ? {} : UIStore.search.contentResults}
          value={UIStore.search.contentValue}

        />
        <br />
      </div>
    );
  }
}

