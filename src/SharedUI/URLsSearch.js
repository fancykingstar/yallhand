import React from "react";
import { inject, observer } from "mobx-react";
import { Search } from "semantic-ui-react";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import _ from "lodash";

@inject("UIStore")
@observer
export class URLsSearch extends React.Component {
  constructor(props) {
    super(props);
    const { UIStore } = this.props;
    this.resetComponent = () => {
      UIStore.set("search", "URLResults", {});
      UIStore.set("search", "URLValue", "");
      UIStore.set("search", "URLSearchLoading", false);
    };
  }

  componentDidMount() {
    const { UIStore, ResourcesStore } = this.props;


    this.resetComponent();
    if (UIStore.search.searchUrlsData.length === 0) {
      UIStore.set(
        "search",
        "searchUrlsData",
        initSearchObj(ResourcesStore.urlResources, "resourceID")
      );
    }
}

  render() {
    const { UIStore, ResourcesStore } = this.props;


    const handleResultSelect = (e, { result }) => {
      this.props.output(result);
      this.resetComponent();
    }

    const handleSearchChange = (e, { value }) => {
      UIStore.set("search", "URLSearchLoading", true);
      UIStore.set("search", "URLValue", value);
      setTimeout(() => {
        if (UIStore.search.URLValue.length < 1) {
          return this.resetComponent();
        } else {
          const rawResults = stupidSearch(
            UIStore.search.searchUrlsData,
            UIStore.search.URLValue
          );
         
     

          const URLs = ResourcesStore.urlResources
            .filter(item => rawResults.includes(item.resourceID))
            .map(item => ({
              title: item.label,
              value: item.resourceID,
            }));
        

          UIStore.set(
            "search",
            "URLResults",
            {
              "Urls": { "name": "Urls", "results": URLs }
            }
          );
        }
        UIStore.set("search", "URLSearchLoading", false);
      }, 300);
    };

    return (
      <div className="fileSearchFrame">
        <p style={{ fontWeight: "800", color: "black"}}>Search and Add</p>
        <Search
          className="fileSearch"
          category
          loading={UIStore.search.URLSearchLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 800, {
            leading: true
          })}
          results={
            _.isEmpty(UIStore.search.URLResults)
              ? {}
              : _.isEmpty(UIStore.search.URLResults.Urls)? {} : UIStore.search.URLResults}
          value={UIStore.search.URLValue}

        />
        <br />
      </div>
    );
  }
}

