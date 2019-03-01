import React from "react";
import { inject, observer } from "mobx-react";
import BackButton  from "../../SharedUI/BackButton";
import { Input, Header, Form } from "semantic-ui-react";
import { TagSelect } from "../../SharedUI/TagSelect";
import { TeamSelect } from "../../SharedUI/TeamSelect";
import { InfoPopUp } from "../../SharedUI/InfoPopUp";


@inject("DataEntryStore", "PoliciesStore", "AnnouncementsStore", "UIStore")
@observer
export class VariationConfig extends React.Component {
  componentDidMount(){
    const {DataEntryStore} = this.props
    if(DataEntryStore.content.isNew){
      DataEntryStore.set("content", "teamID", "global")
      DataEntryStore.set("content", "tagID", "none")
    } 
  }
  render() {
    const { DataEntryStore, PoliciesStore, AnnouncementsStore, UIStore } = this.props;

    const teamChange = (val) => {
      DataEntryStore.set("content", "teamID", val)
    }
    const tagChange = (val) => {
      DataEntryStore.set("content", "tagID", val)
    }

    const obj = Object.assign({}, this.props.mode === "policy" ? 
      PoliciesStore._getPolicy(UIStore.content.policyID)
      : AnnouncementsStore._getAnnouncement(UIStore.content.anncID))
     const vari = DataEntryStore.content

    return (
      <div className="ManagePolicy">
        <BackButton />
        <Header as="h2">
        {DataEntryStore.content.isNew ? "Creating First" : "Editing"} {this.props.mode.charAt(0).toUpperCase() + this.props.mode.slice(1)} Variation
          <Header.Subheader>
           {vari.isNew? DataEntryStore.contentmgmt.label : obj.label}
          </Header.Subheader>
        </Header>
        <div className="Form">
          <div style={{ paddingBottom: 2 }}>
  
                  <span>
                    Alternate Title For Audience (optional)
                    <InfoPopUp content="Alter the title for this particular audience without effecting other teams." />
                  </span>
              
        
            <div className="VariableLabel">
              <Input
                fluid
                value={DataEntryStore.content.label}
                onChange={(e, val) => DataEntryStore.set("content", "label", val.value)}
                value={DataEntryStore.content.label}
                placeholder={vari.label !== "" ? obj.label : null}
                disabled={DataEntryStore.content.teamID === 'global' || vari.isNew}
      
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 0, paddingTop: 0, width: "100%" }} />
        <div className="Form">
          <div style={{ paddingBottom: 5 }}>
            <h4>Configure Audience</h4>
          </div>
          <Form>
            <Form.Group>
            <TeamSelect
                label="Choose Team:"
                value={DataEntryStore.content.teamID}
                outputVal={val => teamChange(val)}
              />
              <TagSelect
                label="Choose Tag (optional):"
                value={DataEntryStore.content.tagID}
                outputVal={val => tagChange(val)}
              />
    
            </Form.Group>
          </Form>
        </div>
        <div className="Form" style={{ maxWidth: 350 }} />
      </div>
    );
  }
}
