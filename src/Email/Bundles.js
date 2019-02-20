import React from "react";
import { 
  Table, Segment, Header, Dropdown } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";
import {
  initSearchObj,
  stupidSearch
} from "../SharedCalculations/StupidSearch";
import {giveMeKey} from "../SharedCalculations/GiveMeKey"


@inject("UIStore", "EmailStore", "DataEntryStore")
@observer
class Bundles extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    const { EmailStore} = this.props;
    if (UIStore.search.searchBundlesData.length === 0) {
      UIStore.set("search",
        "searchBundlesData",
        initSearchObj(
          EmailStore.allBundles,
          "bundleID"
        ) 
      );
    }
  }
  render() {
    const {EmailStore, UIStore, DataEntryStore} = this.props
      const editBundle = (bundle) => {
          DataEntryStore.set("emailCampaign","editBundleLabel",bundle.label)
          DataEntryStore.set("emailCampaign","editBundleSubject",bundle.subject)
          DataEntryStore.set("emailCampaign","editBundleDraft",bundle.draft)
          DataEntryStore.set("emailCampaign","editBundleBundle",bundle.bundle)
          DataEntryStore.set("emailCampaign","editBundleLastUsed",bundle.lastUsed)
          DataEntryStore.set("emailCampaign","editBundleID", bundle.bundleID)
          DataEntryStore.set("emailCampaign","editBundleStage", bundle.stage)
        this.props.history.push(
            "/panel/email/edit-bundle"
          );
      }
  
      const filteredDisplay = () => {
        if (UIStore.search.searchBundles !== "") {
          const results = stupidSearch(
            UIStore.search.searchBundlesData,
            UIStore.search.searchBundles
          );
          return EmailStore.allBundles.filter(item => results.includes(item.bundleID));
        } else {
          return EmailStore.allBundles;
        }
      };

    const bundleSource = UIStore.search.searchBundles === "" ? EmailStore.allBundles
      .filter(bundle => bundle.bundleID !== "queue")
      .filter(bundle => bundle.stage === UIStore.dropdown.bundles) : filteredDisplay().filter(bundle => bundle.bundleID !== "queue")

    const bundles = bundleSource.map(bundle => 
      <Table.Row key={"bundle" + giveMeKey()}
      onClick={e => editBundle(bundle)}
      >
      <Table.Cell style={{paddingLeft: 5}}>{bundle.label}</Table.Cell>
      <Table.Cell>{bundle.subject}</Table.Cell>
      <Table.Cell>{bundle.lastUsed === "" ? "Never Used" : "Last Used " + UTCtoFriendly(bundle.lastUsed)}</Table.Cell>
      <Table.Cell>{UTCtoFriendly(bundle.updated)}</Table.Cell>

    </Table.Row>
    )
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Bundles"
          subheader="View and edit packages of content"
        />
        <div style={{display: "inline-block", width: "100%"}}>
  
             <span>
              Display {" "}
              <Dropdown
                inline
                options={[
                  { text: "Active Bundles", value: "active" },
                  { text: "Archived Bundles", value: "archived" }
                ]}
                onChange={(e, val) => UIStore.set("dropdown", "bundles", val.value)}
                value={UIStore.dropdown.bundles}
              />
            </span>

        </div>
          
        <Segment>
          <Table padded="very" selectable basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{paddingLeft: 5}}>Title</Table.HeaderCell>
                <Table.HeaderCell>Subject</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Last Updated</Table.HeaderCell>
               
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
             {bundles}
             </Table.Body>
          </Table>

        </Segment>
      </div>
    );
  }
}
export default withRouter(Bundles);