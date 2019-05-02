import React from "react";
import { inject, observer } from "mobx-react";
import { FormCharMax } from "../SharedValidations/FormCharMax";
import { Modal, Form, Message } from "semantic-ui-react";
import { StdInputValidation } from "../SharedCalculations/StdInputValidation";
import { ConfirmDelete } from "../SharedUI/ConfirmDelete";
import {
  modifyTag,
  modifyTeam,
  deleteTag,
  deleteTeam
} from "../DataExchange/Up";
import { teamUpdate, tagUpdate } from "../DataExchange/PayloadBuilder"

@inject("UIStore", "DataEntryStore", "TeamStore", "AccountStore")
@observer
export class EditTeamTag extends React.Component {
  constructor(props) {
    super(props);
    const { DataEntryStore } = this.props;
    DataEntryStore.set("teamEditFields", "tagEditSaveDisabled", false);
    DataEntryStore.set("teamEditFields", "teamEditSaveDisabled", false);
  }

  componentWillUnmount() {
    const { DataEntryStore } = this.props;
    DataEntryStore.set("teamEditFields", "tagEditSaveDisabled", false);
    DataEntryStore.set("teamEditFields", "teamEditSaveDisabled", false);
  }
  render() {
    const { DataEntryStore } = this.props;
    const { UIStore } = this.props;
    const { TeamStore } = this.props;
    const newLabelStatus = FormCharMax(
      this.props.mode === "team"
        ? DataEntryStore.teamEditFields.selectedTeamLabel
        : DataEntryStore.teamEditFields.selectedTagLabel,
      24
    ); 
    const handleUpdate = val => {
      this.props.mode === "team"
        ? modifyTeam(teamUpdate())
        : modifyTag(tagUpdate());
      this.props.mode === "team"
        ? UIStore.set("modal", "editTeam", false)
        : UIStore.set("modal", "editTag", false);
    };
    const handleDelete = () => {
      this.props.mode === "team"
        ? deleteTeam(DataEntryStore.teamEditFields.selectedTeam)
        : deleteTag(DataEntryStore.teamEditFields.selectedTag);
      UIStore.set("modal", "confirmDelete", false);
      this.props.mode === "team"
        ? UIStore.set("modal", "editTeam", false)
        : UIStore.set("modal", "editTag", false);
    };
    const handleLabelInput = val => {
      const validInput = StdInputValidation(
        val,
        this.props.options.map(option => option.text),
        this.props.mode === "team"
          ? DataEntryStore.teamEditFields._selectedTeamLabel.toLowerCase()
          : DataEntryStore.teamEditFields._selectedTagLabel.toLowerCase()
      );
      if (validInput.valid) {
        DataEntryStore.set(
          "teamEditFields",
          this.props.mode === "team" ? "selectedTeamLabel" : "selectedTagLabel",
          val
        );
        this.props.mode === "team"
          ? DataEntryStore.set("teamEditFields", "teamEditSaveDisabled", false)
          : DataEntryStore.set("teamEditFields", "tagEditSaveDisabled", false);
      } else {
        this.props.mode === "team"
          ? DataEntryStore.set("teamEditFields", "teamEditSaveDisabled", true)
          : DataEntryStore.set("teamEditFields", "tagEditSaveDisabled", true);
      }
    };
    const handleTagChange = val => {
      DataEntryStore.set("teamEditFields", "tagEditDropdownVal", val);
    };

    const handleTeamChange = val => {
      DataEntryStore.set("teamEditFields", "teamEditDropdownVal", val);
    };
    const selectField =
      this.props.mode === "tag" ? (
        <Form.Select
          options={this.props.options}
          label="Extends Tag (optional)"
          defaultValue={DataEntryStore.teamEditFields.tagEditDropdownVal}
          onChange={(e, { value }) => handleTagChange(value)}
        />
      ) : (
        <Form.Select
          fluid
          label="Subteam Of (optional)"
          defaultValue={DataEntryStore.teamEditFields.teamEditDropdownVal}
          options={this.props.options}
          onChange={(e, { value }) => handleTeamChange(value)}
        />
      );
    return (
      <React.Fragment>
        <Modal
          size="small"
          closeIcon
          open={this.props.open}
          onClose={e =>
            this.props.mode === "team"
              ? UIStore.set("modal", "editTeam", false)
              : UIStore.set("modal", "editTag", false)
          }
        >
          <Modal.Header>
            Editing{" "}
            {this.props.mode.charAt(0).toUpperCase() + this.props.mode.slice(1)}{" "}
            {this.props.mode === "team"
              ? DataEntryStore.teamEditFields.selectedTeamLabel.toLowerCase()
              : DataEntryStore.teamEditFields.selectedTagLabel.toLowerCase()}
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Group>
                  <Form.Input
                    error={DataEntryStore.isSaveDisabled.tagteamedit}
                    defaultValue={
                      this.props.mode === "team"
                        ? DataEntryStore.teamEditFields.selectedTeamLabel
                        : DataEntryStore.teamEditFields.selectedTagLabel
                    }
                    label="Descriptive Title (required):"
                    style={{ maxWidth: 300 }}
                    onChange={(e, val) => handleLabelInput(val.value)}
                  >
                    <input maxLength="48" />
                  </Form.Input>
                  {selectField}
                </Form.Group>
                <span
                  style={
                    DataEntryStore.teamEditFields.teamEditSaveDisabled ||
                    DataEntryStore.teamEditFields.tagEditSaveDisabled
                      ? null
                      : { display: "none" }
                  }
                >
                  <p className="WarningStyle">
                    Whoops, that label is already in use.
                  </p>
                </span>
                <Form.Group>
                  <Form.Button
                    onClick={e => handleUpdate()}
                    primary
                    disabled={
                      this.props.mode === "team"
                        ? DataEntryStore.teamEditFields.selectedTeamLabel.trim() ===
                            "" ||
                          DataEntryStore.teamEditFields.teamEditSaveDisabled
                        : DataEntryStore.teamEditFields.selectedTagLabel.trim() ===
                            "" ||
                          DataEntryStore.teamEditFields.tagEditSaveDisabled
                    }
                  >
                    Update
                  </Form.Button>
                  <ConfirmDelete
                    disabled={
                      this.props.mode === "tag"
                        ? TeamStore._getTag(
                            DataEntryStore.teamEditFields.selectedTag
                          ).count !== 0 || TeamStore.tags
                          .filter(tag => tag.parent === DataEntryStore.teamEditFields.selectedTag)
                          .length !== 0 
                        : TeamStore._getTeam(
                            DataEntryStore.teamEditFields.selectedTeam
                          ).count !== 0 || TeamStore.structure
                            .filter(team => team.parent === DataEntryStore.teamEditFields.selectedTeam)
                            .length !== 0 
                    }
                    label={
                      this.props.mode === "team"
                        ? DataEntryStore.teamEditFields.selectedTeamLabel.toLowerCase()
                        : DataEntryStore.teamEditFields.selectedTagLabel.toLowerCase()
                    }
                    confirm={e => handleDelete()}
                  />
                </Form.Group>
              </Form>

              <Message error attached hidden={newLabelStatus.messageHide}>
                {newLabelStatus.message}
              </Message>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}
