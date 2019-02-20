import React from "react";
import { inject, observer } from "mobx-react";
// import "./style.css";
import { Segment } from "semantic-ui-react";
// import { AttachedURLs } from "./AttachedURLs";
import { AttachedFiles } from "./AttachedFiles";
import { DraftFormField } from "../../SharedUI/DraftFormField";
// import { LinkEditorExample } from "../../SharedUI/LinkEditorExample";
import _ from "lodash";

@inject("DataEntryStore")
@observer
export class VariationContent extends React.Component {
 
  render() {
    const { DataEntryStore } = this.props;
    return (
      <div>
        {/* <LinkEditorExample/> */}
        <DraftFormField
          includeURL={true}
          loadContent={DataEntryStore.content.contentRAW}
        />
        <div className="AMenu">
          <Segment attached="bottom">
          <div style={{ paddingBottom: 5 }}>
            <h4>Attach Resources</h4>
          </div>
            {/* <AttachedFiles mode={this.props.mode} currentObj={this.props.currentObj} currentObjVariation={this.props.currentObjVariation} isNew={DataEntryStore.isNewVariation}/> */}
          </Segment>
          <br/>
        </div>
      </div>
    );
  }
}
