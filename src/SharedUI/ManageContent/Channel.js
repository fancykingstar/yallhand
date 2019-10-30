import React from "react";
import { inject, observer } from "mobx-react";
import { ChannelSelect } from "../ChannelSelect"
import { Segment, Form, Header } from "semantic-ui-react";
import { modifyPolicy, modifyAnnouncement } from "../../DataExchange/Up";

@inject("DataEntryStore", "UIStore", "AccountStore")
@observer
export class Channel extends React.Component {
    constructor(props){
      super(props);
      this.state={chanID: "all"};
    }
    render(){
        const {DataEntryStore, UIStore, AccountStore} = this.props;

        const echoState = (val) => {
          DataEntryStore.set("contentmgmt", "settingsChannel", val);
          if(this.props.output) this.props.output(val);
        }

        const updateContent = async () => {
          return this.mode === "policy"? await modifyPolicy({accountID:AccountStore.account.accountID, policyID: UIStore.content.policyID, chanID: DataEntryStore.contentmgmt.settingsChannel}) : modifyAnnouncement({accountID:AccountStore.account.accountID, announcementID: UIStore.content.announcementID, chanID: DataEntryStore.contentmgmt.settingsChannel});
        }

        return( 
            <Segment>
        <div> 
          <Header>Channel</Header>
          <ChannelSelect
              submitButton={this.props.submitButton}
              submit={()=>updateContent()}
              defaultVal={this.props.defaultChannel}
              label={"Select Channel"}
              placeholder="choose channel..."
              outputVal={val => echoState(val)}
            />
        </div>
      </Segment>
        )
    }
}