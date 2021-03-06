import React from "react";
import { inject, observer } from "mobx-react";
import { Dropdown, Form, Segment } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect"
import { TagSelect } from "../SharedUI/TagSelect"
import { ContentSearch } from "../SharedUI/ContentSearch"
import { AssocLabelGroup } from "../SharedUI/AssocLabelGroup"

import "./style.css"

// const selectOptions = [
//   { text: "selected content", value: "content" },
//   { text: "general availability", value: "general" }
// ];

@inject("UIStore", "DataEntryStore")
@observer
export class UploadConfig extends React.Component {
  componentDidMount() {
    const { UIStore } = this.props;
    const { DataEntryStore } = this.props;
    if(DataEntryStore.fileForUpload.associations.policies.length === 0 && DataEntryStore.fileForUpload.associations.announcements.length === 0 ){
      UIStore.set("dropdown", "uploadConfig", "general")
    }
    else{
      UIStore.set("dropdown", "uploadConfig", "content")
    }
  }
  render() {
    const { UIStore } = this.props;
    const { DataEntryStore } = this.props;
    const config =
      UIStore.dropdown.uploadConfig === "general" ? (
        <React.Fragment>
            <Form.Group>
          <TeamSelect
            label={"Limit Access To Teams"}
            placeholder="choose team..."
            value={DataEntryStore.fileForUpload.teamID}
            outputVal={val => DataEntryStore.set("fileForUpload", "teamID", val.value)}
          />
          <TagSelect
            label={"Limit Access By Tag"}
            placeholder="choose tag..."
            value={DataEntryStore.fileForUpload.tagID}
            outputVal={val => DataEntryStore.set("fileForUpload", "tagID", val)}
          />
          </Form.Group>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Form.Group style={{paddingTop: 15}}>
            {/* <ContentSearch 
            styleOveride={true} 
            output={val => addContent(val)}/> */}
            <AssocLabelGroup
              assoc={DataEntryStore.fileForUpload.associations}
              remove={val => removeAssociation(val)}
              disableRemove
            />
          </Form.Group>
        </React.Fragment>
      );

    const removeAssociation = (obj) => {
        let allAssoc = Object.assign({}, DataEntryStore.fileForUpload.associations)
        const idKey = {"policy": "policyID", "announcement": "announcementID"}[obj.type]
        const assocKey = {"policy": "policies", "announcement": "announcements"}[obj.type]
            let assoc = obj.type === "policy" ? allAssoc.policies.slice() : allAssoc.announcements.slice()
            assoc.filter(assoc => assoc[idKey] === obj[idKey])[0].variations.length === 1 ?
            allAssoc[assocKey] = allAssoc[assocKey].filter(policy => policy[idKey] !== obj[idKey]) :
            allAssoc[assocKey][obj[idKey]] = allAssoc[assocKey][obj[idKey]].variations.filter(vari => vari !== obj.variationID)
            DataEntryStore.set("urlForUpload", "associations", allAssoc)
    }
    
    const addContent = (searchOutput) => {
      // const isValid = searchOutput.type === "policy" ? 
      // !DataEntryStore.urlForUpload.associations.policies :

    }
    
    return (
      <React.Fragment>
          <Segment secondary>
        <span>
          Associated with
          {/* <Dropdown
            inline
            value={UIStore.dropdown.uploadConfig}
            options={selectOptions}
            onChange={(e, val) =>
              UIStore.set("dropdown", "uploadConfig", val.value)
            }
          /> */}
          <div className="UploadConfig">
          {config}
          </div>
        </span>
        </Segment>
      </React.Fragment>
    );
  }
}
