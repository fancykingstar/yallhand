import React from "react";
import "./style.css";
import { inject, observer } from "mobx-react";
import { Form, Segment, Header} from "semantic-ui-react";
import { Tree } from "../SharedUI/Tree";
import { StdInputValidation } from "../SharedCalculations/StdInputValidation";
import { EditTeamTag } from "./EditTeamTag";
import { tag } from "../DataExchange/PayloadBuilder"
import { createTag } from "../DataExchange/Up";
import {debounce} from 'lodash'

@inject("TeamStore", "DataEntryStore", "UIStore", "AccountStore")
@observer
export class Tags extends React.Component {
  componentDidMount() {
    const { DataEntryStore } = this.props;
    DataEntryStore.set("teamEditFields", "tagsLabel", "");
    DataEntryStore.set("teamEditFields", "tagsDropdown", "self");
  }
  render() {
    const { TeamStore } = this.props;
    const { DataEntryStore } = this.props;
    const { UIStore } = this.props;


    const handleAdd = () => {
      if (!DataEntryStore.teamEditFields.tagsSaveDisabled) {
        createTag(tag()).then(() => {document.getElementById('tagInput').value = ""})
      }
    };
    const handleEdit = data => {
      const val = data.item
      DataEntryStore.set("teamEditFields", "selectedTag", val.tagID);
      DataEntryStore.set("teamEditFields", "_selectedTagLabel", val.label); //for UI title
      DataEntryStore.set("teamEditFields", "selectedTagLabel", val.label);
      DataEntryStore.set( "teamEditFields", "tagEditDropdownVal", TeamStore._getParent("tag", val.tagID) );
      DataEntryStore.set("teamEditFields", "preventDelete", data.assoc || data.children);
      UIStore.set("modal", "editTag", true);
    };
    const handleLabelInput = debounce(val => {
      const validInput = StdInputValidation(
        val,
        TeamStore._getTagsAsOptions.map(option => option.text)
      );
      if (validInput.valid) {
        DataEntryStore.set("teamEditFields", "tagsLabel", val);
        DataEntryStore.set("teamEditFields", "tagsSaveDisabled", false);
      } else {
        DataEntryStore.set("teamEditFields", "tagsLabel", val);
        DataEntryStore.set("teamEditFields", "tagsSaveDisabled", true);
      }
    }, 500)
    const handleTagChange = val => {
      DataEntryStore.set("teamEditFields", "tagsDropdown", val);
    };

    const showEditTeamTag = UIStore.modal.editTag ? (
      <EditTeamTag
        mode="tag"
        open={UIStore.modal.editTag}
        label={DataEntryStore.teamEditFields._selectedTagLabel}
        options={TeamStore._getTagsAsEditOptions}
      />
    ) : null;
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="User Tags"
          subheader="Create and manage user tags for tiered access to content"
        />
        <Segment>
          <Header as="h3" content="Add New" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Input
                fluid
                label="Label"
                error={DataEntryStore.teamEditFields.tagsSaveDisabled}
                placeholder="e.g. Employee or Manager"
                id="tagInput"
                onChange={(e, val) => handleLabelInput(val.value)}
              />
              {TeamStore.tagsSelect.length > 1 ?
                <Form.Select
                  fluid
                  options={TeamStore._getTagsAsEditOptions}
                  label="Extends Tag (optional)"
                  defaultValue={"self"}
                  onChange={(e, { value }) => handleTagChange(value)}
                />
                :
                null
              }

              <Form.Button
                disabled={
                  DataEntryStore.teamEditFields.tagsSaveDisabled ||
                  DataEntryStore.teamEditFields.tagsLabel.trim() === ""
                }
                onClick={e => handleAdd()}
                style={{ marginTop: 21 }}
                icon="plus"
              />
            </Form.Group>
          </Form>
          <span
            style={
              DataEntryStore.teamEditFields.tagsSaveDisabled
                ? null
                : { display: "none" }
            }
          >
            <p className="WarningStyle">
              Whoops, that label is already in use.
            </p>
          </span>
          <Tree data={TeamStore.tags} id="tagID" onClick={handleEdit} />
        </Segment>
        {showEditTeamTag}
      </div>
    );
  }
}
