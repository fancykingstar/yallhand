import React from "react";
import { inject, observer } from "mobx-react";
import { Search, Icon } from "semantic-ui-react";
import { initSearchObj, stupidSearch } from "../SharedCalculations/StupidSearch";
import _ from "lodash";

@inject("UIStore", "ResourcesStore")
@observer
export class FilesSearch extends React.Component {
  constructor(props) {
    super(props);
    const { UIStore, ResourcesStore } = this.props;
    this.resetComponent = () => {
      UIStore.set("search", "fileResults", {});
      UIStore.set("search", "fileValue", "");
      UIStore.set("search", "fileSearchLoading", false);
    };
  }

  componentDidMount() {
    const { UIStore, ResourcesStore } = this.props;


    this.resetComponent();
    if (UIStore.search.searchFilesData.length === 0) {
      UIStore.set(
        "search",
        "searchFilesData",
        initSearchObj(ResourcesStore.fileResources, "resourceID")
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
      UIStore.set("search", "fileSearchLoading", true);
      UIStore.set("search", "fileValue", value);
      setTimeout(() => {
        if (UIStore.search.fileValue.length < 1) {
          return this.resetComponent();
        } else {
          const rawResults = stupidSearch(
            UIStore.search.searchFilesData,
            UIStore.search.fileValue
          );
         
          const files = ResourcesStore.fileResources
            .filter(item => rawResults.includes(item.resourceID))
            .map(policy => ({
              title: policy.label,
              value: policy.resourceID,
            }));
          
          UIStore.set(
            "search",
            "fileResults",
            {
              "Files": { "name": "Files", "results": files }
            }
          );
        }
        UIStore.set("search", "fileSearchLoading", false);
      }, 300);
    };

    return (
      <div className="fileSearchFrame">
        <p style={{ fontWeight: "800", color: "black"}}><Icon name="cubes"/>Add From Resources</p>
        <Search
          className="fileSearch"
          category
          loading={UIStore.search.fileSearchLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 800, {
            leading: true
          })}
          results={
            _.isEmpty(UIStore.search.fileResults)
              ? {}
              : _.isEmpty(UIStore.search.fileResults.Files)? {} : UIStore.search.fileResults}
          value={UIStore.search.fileValue}

        />
        <br />
      </div>
    );
  }
}

