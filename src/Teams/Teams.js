import React from "react";
import { inject, observer } from "mobx-react";
import { Form, Segment, Header } from "semantic-ui-react";
import { Tree } from "../SharedUI/Tree";
import { StdInputValidation } from "../SharedCalculations/StdInputValidation";
import { EditTeamTag } from "./EditTeamTag";
import { team } from "../DataExchange/PayloadBuilder"
import { createTeam } from "../DataExchange/Up";
import {debounce} from 'lodash'
import "./style.css";

@inject("TeamStore", "DataEntryStore", "UIStore")
@observer
export class Teams extends React.Component {
  componentDidMount() {
    const { DataEntryStore } = this.props;
    DataEntryStore.set("teamEditFields", "teamsLabel", "");
    DataEntryStore.set("teamEditFields", "teamsDropdown", "global");
  }
  render() {
    const { TeamStore } = this.props;
    const { DataEntryStore } = this.props;
    const { UIStore } = this.props;
    const handleAdd = () => { 
      if (!DataEntryStore.teamEditFields.tagsSaveDisabled) {
        createTeam(team()).then(() => {document.getElementById('teamInput').value = ""})

       
      }
    };
    const handleEdit = data => {
      const val = data.item
      DataEntryStore.set("teamEditFields", "selectedTeam", val.teamID);
      DataEntryStore.set("teamEditFields", "_selectedTeamLabel", val.label);
      DataEntryStore.set("teamEditFields", "selectedTeamLabel", val.label);
      DataEntryStore.set( "teamEditFields", "teamEditDropdownVal", TeamStore._getParent("team", val.teamID) );
      DataEntryStore.set("teamEditFields", "preventDelete", data.assoc || data.children)
      UIStore.set("modal", "editTeam", true);
    };
    const handleLabelInput = debounce(val => {
      const validInput = StdInputValidation(
        val,
        TeamStore._getTeamsAsOptions.map(option => option.text)
      );
      if (validInput.valid) {
        DataEntryStore.set("teamEditFields", "teamsLabel", val);
        DataEntryStore.set("teamEditFields", "teamsSaveDisabled", false);
      } else {
        DataEntryStore.set("teamEditFields", "teamsLabel", val);
        DataEntryStore.set("teamEditFields", "teamsSaveDisabled", true);
      }
    }, 500)
    const handleTeamChange = val => {
      DataEntryStore.set("teamEditFields", "teamsDropdown", val);
    };
    const showEditTeamTag = UIStore.modal.editTeam ? (
      <EditTeamTag
        mode="team"
        open={UIStore.modal.editTeam}
        label={DataEntryStore.teamEditFields._selectedTeamLabel}
        options={TeamStore._getTeamsAsOptions}
      />
    ) : null;
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Team Structure"
          subheader="Design your teams and subteams"
        />
        <Segment>
          <Header as="h3" content="Add New" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Input
                fluid
                error={DataEntryStore.teamEditFields.teamsSaveDisabled}
                label="Label"
                onChange={(e, val) => handleLabelInput(val.value)}
                id="teamInput"
                placeholder="e.g. New York or Warehouse"
              />
              <Form.Select
                fluid
                label="Subteam Of (optional)"
                defaultValue={"global"}
                options={TeamStore._getTeamsAsOptions}
                onChange={(e, { value }) => handleTeamChange(value)}
              />
              <Form.Button
                disabled={
                  DataEntryStore.teamEditFields.teamsSaveDisabled ||
                  DataEntryStore.teamEditFields.teamsLabel.trim() === ""
                }
                style={{ marginTop: 21 }}
                icon="plus"
                onClick={e => handleAdd()}
              />
            </Form.Group>
            <Form.Group />
          </Form>
          <span
            style={
              DataEntryStore.teamEditFields.teamsSaveDisabled
                ? null
                : { display: "none" }
            }
          >
            <p className="WarningStyle MoreHigh">
              Whoops, that label is already in use.
            </p>
          </span>
          <Tree data={TeamStore.structure} id="teamID" onClick={handleEdit} />
        </Segment>
        {showEditTeamTag}
      </div>
    );
  }
}
