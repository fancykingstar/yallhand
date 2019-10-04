import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Image} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { LazyImg } from "../SharedUI/LazyImg"; 

import MUIDataTable from "mui-datatables";
import "./style.css";
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly";


@inject("PoliciesStore", "AccountStore", "UIStore", "DataEntryStore", "ChannelStore")
@observer
export class CardFrame extends React.Component {
  render() {
    const { PoliciesStore, UIStore, DataEntryStore, ChannelStore } = this.props;

    const handleClick = val => {
      UIStore.set("content", "policyID", val.policyID)
      const policy = Object.assign({}, val)
      UIStore.set("content", "variationID",PoliciesStore._toggleGlobalVariation(policy.policyID))
      DataEntryStore.set("contentmgmt", "label",  policy.label)
      DataEntryStore.set("contentmgmt", "img",  policy.img)
      DataEntryStore.set("contentmgmt", "bundle", "queue")
      DataEntryStore.set("contentmgmt", "keywords",  policy.keywords)
      DataEntryStore.set("contentmgmt", "reviewAlert",  policy.reviewAlert)
      this.props.history.push(
        "/panel/faqs/manage-policy/" + UIStore.content.policyID
      );
    };

    // const filteredByChannel =
    //   UIStore.sideNav.activeChannel === "All"
    //     ? filteredByStatus()
    //     : filteredByStatus().filter(
    //         policy => policy.chanID === UIStore.sideNav.activeChannel
    //       );
    // const contentFeed = sortByUTC(filteredBySearch(), UIStore.dropdown.policySort)
    //   .map(policy => (
    //   <FeedItem key={"policy" + giveMeKey()} data={policy} clicked={handleClick} />
    // ));

    
      
    const columns = ["","Title", "Last Updated", "Channel","State"];

    const data = PoliciesStore.allPolicies.map(pol => [<LazyImg style={{height: 75, width: 120, objectFit: pol.img? "cover":"contain" }} src={pol.img? pol.img : "https://yallhandsgeneral.s3.amazonaws.com/no-image-icon.png"} size="tiny"/>,pol.label, UTCtoFriendly(pol.updated), ChannelStore._getLabel(pol.chanID), pol.state])
    
    const options = {
      elevation: 1,
      selectableRows: "none",
      filter:true,
      filterType: 'dropdown',
      filterList: [["active"]],
      print: false,
      responsive: "scrollMaxHeight",
      viewColumns: false,
      download: false,
      onRowClick: (i, data) => handleClick(PoliciesStore.allPolicies[data.rowIndex])
    };
    
    return (
        <React.Fragment>
        <div>
        
        <Header as="h2"
        style={{padding: 0, margin: 0}}
        >
          FAQs
          <Header.Subheader>
            Add frequently asked questions and answers
          </Header.Subheader>
        </Header>

          <div style={{ marginTop: 15 }}>
      <MUIDataTable
        // title={"Employee List"}
        data={data}
        columns={columns}
        options={options}
      />
  
    </div>
   
  </div>
  </React.Fragment>
    );
  }
}
export default withRouter(CardFrame);
