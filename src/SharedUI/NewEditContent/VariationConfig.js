import React from "react";
import { inject, observer } from "mobx-react";
import BackButton  from "../../SharedUI/BackButton";
import { Input, Header, Form, Accordion, Icon } from "semantic-ui-react";

import { TagSelect } from "../../SharedUI/TagSelect";
import { TeamSelect } from "../../SharedUI/TeamSelect";
import { InfoPopUp } from "../../SharedUI/InfoPopUp";
import TextField from '@material-ui/core/TextField';
import toast  from "../../YallToast"



@inject("DataEntryStore", "PoliciesStore", "AnnouncementsStore", "UIStore", "TeamStore")
@observer
export class VariationConfig extends React.Component {
  constructor(props){
    super(props);
    this.state={displayOptions: false}
  }



  toggleOptions(){this.setState({displayOptions: !this.state.displayOptions})};
  componentDidMount(){
    // const {DataEntryStore, UIStore} = this.props
    // if(DataEntryStore.content.isNew){
    //   DataEntryStore.set("content", "teamID", "global")
    //   DataEntryStore.set("content", "tagID", "none")
    // } 
    // DataEntryStore.set("content", "label", vari.isNew? DataEntryStore.contentmgmt.label : obj.label);
    // if(DataEntryStore.content.label !== ""){UIStore.set("dropdown", "altLabel", true)}
    // else{UIStore.set("dropdown", "altLabel", false)}
  }
  render() {
    const { DataEntryStore, PoliciesStore, AnnouncementsStore, UIStore, TeamStore } = this.props;

     const updateTitle = (val) => {
      DataEntryStore.content.isNew? DataEntryStore.set("contentmgmt", "label", val) : DataEntryStore.set("content", "label", val)
     }

    //  const validConfig = () => {
    //    if (!obj.variations) return;
    //   let invalidConfigs = obj.variations
    //   .slice()
    //   .filter(i => i.variationID !== vari.variationID )
    //   .map(i => i.teamID + (i.tags.length === 0? "none" : i.tags[0]))
      
    //   if(invalidConfigs.includes(DataEntryStore.content.teamID + DataEntryStore.content.tagID)){
    //     const resetVari = obj.variations.filter(i => i.variationID === DataEntryStore.content.variationID)[0]
    //     setTeam(resetVari === undefined? "" : resetVari.teamID)
    //     setTag(resetVari === undefined? "" : resetVari.tags.length === 0? "none" : resetVari.tags)
    //     toast.error("Whoops! You already have a variation for that team / tag combination.", {hideProgressBar: true})
    //   }
    //  }

     const setTeam = (val) => {
      DataEntryStore.set("content", "teamID",val)
      validConfig()
     }
     const setTag = (val) => {
      DataEntryStore.set("content", "tagID",val)
      validConfig()
     }

    //  const altLabel =   
    //  <div style={{paddingBottom: 5}}>
    //  <Accordion >
    //     <Accordion.Title active={UIStore.dropdown.altLabel} index={0} onClick={e => UIStore.set("dropdown", "altLabel", !UIStore.dropdown.altLabel)}>
    //       <Icon style={{color: "#565656"}} size="mini" name='dropdown' />
    //      <span style={{color: "#565656", fontSize: "0.8em"}}>Alternate Title For This Audience (optional)</span>
    //    <InfoPopUp content="Alter the title for this particular audience without effecting other teams. Not available for Global teams or when creating new content." />
    //     </Accordion.Title>
    //     <Accordion.Content active={UIStore.dropdown.altLabel}>
    //     <div className="VariableLabel">
    //     <Input
    //       size="mini"
    //       style={{width: "80%"}}
    //       value={DataEntryStore.content.label}
    //       onChange={(e, val) => DataEntryStore.set("content", "label", val.value)}
    //       value={DataEntryStore.content.label}
    //       placeholder={vari.label !== "" ? obj.label : null}
    //     />
    //     </div>
    //     </Accordion.Content>
    //  </Accordion>
    //  </div>

         const contentOptions =   
     <div style={{paddingBottom: 5}}>
     <Accordion >
        <Accordion.Title active={this.state.displayOptions} index={0} onClick={() => this.toggleOptions()}>
          <Icon style={{color: "#565656"}} size="mini" name='dropdown' />
         <span style={{color: "#565656", fontSize: "0.8em"}}>Options</span>
       {/* <InfoPopUp content="Alter the title for this particular audience without effecting other teams. Not available for Global teams or when creating new content." /> */}
        </Accordion.Title>
        <Accordion.Content active={this.state.displayOptions}>
        <div>
        
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
        </div>
        </Accordion.Content>
     </Accordion>
     </div>


 

  
    


    return (
      <div className="ManagePolicy">
        <BackButton />
        <Header as="h2" style={{padding: 0, marginBottom: 10}}>
          {DataEntryStore.content.isNew ? "Creating" : "Editing"} {this.props.mode.charAt(0).toUpperCase() + this.props.mode.slice(1)} 
        </Header>
       
        <div style={{paddingRight: 15, paddingBottom: 10}}>
            <TextField
            id="standard-full-width"
            label="Title"
            placeholder="Enter a title for this content..."
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e=>updateTitle(e.target.value)}
            InputProps={{disableUnderline: true, style: {fontSize: "1.4em"} }}
            
            value={DataEntryStore.content.label}
            />
           
        </div>
      </div>
    );
  }
}
