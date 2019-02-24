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
    return (
      <div>
        <DraftFormField
          includeURL={true}
          loadContent={DataEntryStore.content.contentRAW}
        />

        <div className="AMenu" style={{ paddingTop: 35, maxWidth: 450 }}>
          <Segment>
            <AttachedFiles mode={this.props.mode}  />
          </Segment>
          <br/>
        </div>
      </div>
    );
  }
}
