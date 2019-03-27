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
      UIStore.set("search", "searchBundlesData", initSearchObj(EmailStore.allBundles, "bundleID"));
    }
  }

  filteredDisplay() {
    const { EmailStore, UIStore } = this.props;
    const { allBundles } = EmailStore;
    const { search } = UIStore;
    if (search.searchBundles !== "") {
      const results = stupidSearch(search.searchBundlesData, search.searchBundles);
      return allBundles.filter(item => results.includes(item.bundleID));
    } else {
      return allBundles;
    }
  }

  render() {
    const options = [{text: "Active Bundles", value: "active"}, {text: "Archived Bundles", value: "archived"}];
    const { EmailStore, UIStore, DataEntryStore, history } = this.props;
    const { allBundles } = EmailStore;
    const { dropdown, search } = UIStore;
    const { bundles } = dropdown;
    const editBundle = (bundle) => {
      DataEntryStore.set("emailCampaign","editBundleLabel",bundle.label)
      DataEntryStore.set("emailCampaign","editBundleSubject",bundle.subject)
      DataEntryStore.set("emailCampaign","editBundleContentRAW",bundle.bodyContentRAW)
      DataEntryStore.set("emailCampaign","editBundleBundle",bundle.bundle)
      DataEntryStore.set("emailCampaign","editBundleLastUsed",bundle.lastUsed)
      DataEntryStore.set("emailCampaign","editBundleID", bundle.bundleID)
      DataEntryStore.set("emailCampaign","editBundleStage", bundle.stage)
      history.push("/panel/email/edit-bundle");
    };

    const bundleSource = search.searchBundles === "" ? 
      allBundles.filter(bundle => bundle.bundleID !== "queue").filter(bundle => bundle.stage === bundles)
        :
      this.filteredDisplay().filter(bundle => bundle.bundleID !== "queue")

    return (
      <div className="Segment">
        <Header as="h2" content="Bundles" subheader="View and edit packages of content"/>
        <div style={{display: "inline-block", width: "100%"}}>
          <span>
            Display 
            <Dropdown onChange={(e, val) => UIStore.set("dropdown", "bundles", val.value)} options={options} value={bundles} inline />
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
              {bundleSource.map(bundle => <Table.Row key={"bundle" + giveMeKey()} onClick={e => editBundle(bundle)}>
                <Table.Cell style={{paddingLeft: 5}}>{bundle.label}</Table.Cell>
                <Table.Cell>{bundle.subject}</Table.Cell>
                <Table.Cell>{bundle.lastUsed === 0 ? "Never Used" : `Last Used ${UTCtoFriendly(bundle.lastUsed)}`}</Table.Cell>
                <Table.Cell>{UTCtoFriendly(bundle.updated)}</Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table>
        </Segment>
      </div>
    );
  }
}
export default withRouter(Bundles);