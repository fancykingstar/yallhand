import React from "react";
import { inject, observer } from "mobx-react";
import { Segment } from "semantic-ui-react";
import { AttachedFiles } from "./AttachedFiles";
import { DraftFormField } from "../../SharedUI/DraftFormField";
import _ from "lodash";

@inject("DataEntryStore")
@observer
export class VariationContent extends React.Component {
  render() {
    const { DataEntryStore } = this.props;
    let attachedStyle = {paddingTop: 35, maxWidth: 450}
    if (DataEntryStore.content.isNew) attachedStyle.pointerEvents = "none";

    return (
      <div>
        <DraftFormField
          includeURL={true}
          loadContent={DataEntryStore.content.contentRAW}
        />

        <div className="AMenu" style={attachedStyle}>
          <Segment disabled={DataEntryStore.content.isNew}>
            <AttachedFiles mode={this.props.mode}  />
          </Segment>
          <br/>
        </div>
      </div>
    );
  }
}
