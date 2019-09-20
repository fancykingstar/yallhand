import React from "react";
import { inject, observer } from "mobx-react";
import BackButton  from "../../SharedUI/BackButton";
import { Input, Header, Form, Accordion, Icon } from "semantic-ui-react";
import { TagSelect } from "../../SharedUI/TagSelect";
import { TeamSelect } from "../../SharedUI/TeamSelect";
import { InfoPopUp } from "../../SharedUI/InfoPopUp";
import toast  from "../../YallToast"



@inject("DataEntryStore", "PoliciesStore", "AnnouncementsStore", "UIStore", "TeamStore")
@observer
export class VariationConfig extends React.Component {
  componentDidMount(){
    const {DataEntryStore, UIStore} = this.props
    if(DataEntryStore.content.isNew){
      DataEntryStore.set("content", "teamID", "global")
      DataEntryStore.set("content", "tagID", "none")
    } 
    if(DataEntryStore.content.label !== ""){UIStore.set("dropdown", "altLabel", true)}
    else{UIStore.set("dropdown", "altLabel", false)}
  }
  render() {
    const { DataEntryStore, PoliciesStore, AnnouncementsStore, UIStore, TeamStore } = this.props;

    const obj = Object.assign({}, this.props.mode === "policy" ? 
      PoliciesStore._getPolicy(UIStore.content.policyID)
      : AnnouncementsStore._getAnnouncement(UIStore.content.announcementID))
     const vari = DataEntryStore.content

     const validConfig = () => {
       if (!obj.variations) return;
      let invalidConfigs = obj.variations
      .slice()
      .filter(i => i.variationID !== vari.variationID )
      .map(i => i.teamID + (i.tags.length === 0? "none" : i.tags[0]))
      
      if(invalidConfigs.includes(DataEntryStore.content.teamID + DataEntryStore.content.tagID)){
        const resetVari = obj.variations.filter(i => i.variationID === DataEntryStore.content.variationID)[0]
        setTeam(resetVari === undefined? "" : resetVari.teamID)
        setTag(resetVari === undefined? "" : resetVari.tags.length === 0? "none" : resetVari.tags)
        toast.error("Whoops! You already have a variation for that team / tag combination.", {hideProgressBar: true})
      }
     }

     const setTeam = (val) => {
      DataEntryStore.set("content", "teamID",val)
      validConfig()
     }
     const setTag = (val) => {
      DataEntryStore.set("content", "tagID",val)
      validConfig()
     }

     const altLabel =   
     <div style={{paddingBottom: 5}}>
     <Accordion >
        <Accordion.Title active={UIStore.dropdown.altLabel} index={0} onClick={e => UIStore.set("dropdown", "altLabel", !UIStore.dropdown.altLabel)}>
          <Icon style={{color: "#565656"}} size="mini" name='dropdown' />
         <span style={{color: "#565656", fontSize: "0.8em"}}>Alternate Title For This Audience (optional)</span>
       <InfoPopUp content="Alter the title for this particular audience without effecting other teams. Not available for Global teams or when creating new content." />
        </Accordion.Title>
        <Accordion.Content active={UIStore.dropdown.altLabel}>
        <div className="VariableLabel">
        <Input
          size="mini"
          style={{width: "80%"}}
          value={DataEntryStore.content.label}
          onChange={(e, val) => DataEntryStore.set("content", "label", val.value)}
          value={DataEntryStore.content.label}
          placeholder={vari.label !== "" ? obj.label : null}
        />
        </div>
        </Accordion.Content>
     </Accordion>
     </div>


 

  
    


    return (
      <div className="ManagePolicy">
        <BackButton />
        <Header as="h2" style={{padding: 0, margin: 0}}>
        {DataEntryStore.content.isNew ? "Creating First" : "Editing"} {this.props.mode.charAt(0).toUpperCase() + this.props.mode.slice(1)} Variation
          <Header.Subheader>
           {vari.isNew? DataEntryStore.contentmgmt.label : obj.label}
          </Header.Subheader>
        </Header>
        <div className="Form">
            {DataEntryStore.content.teamID === 'global' || vari.isNew? <div/> : altLabel}
        </div>
        <div style={{ marginTop: 0, paddingTop: 0, width: "100%" }} />
        <div className="Form">
          <div style={{ paddingBottom: 5, paddingTop: 10 }}>
            {TeamStore.tags.length !== 0 && TeamStore.structure.length !== 1? <h4>Audience</h4> : null}
          </div>
          <Form>
            <Form.Group>
            <TeamSelect
                label="Choose Team:"
                value={DataEntryStore.content.teamID}
                outputVal={e => setTeam(e.value)}
              />
              <TagSelect
                label="Choose Tag (optional):"
                value={DataEntryStore.content.tagID}
                outputVal={e => setTag(e)}
              />
    
            </Form.Group>
          </Form>
        </div>
        <div className="Form" style={{ maxWidth: 350 }} />
      </div>
    );
  }
}
