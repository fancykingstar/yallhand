import React from "react";
import { inject, observer } from "mobx-react";
import { Dropdown, Form } from "semantic-ui-react";
import { LabelGroup, validateAdd, labelsOneRemoved } from "../SharedUI/LabelGroup";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";

@inject("DataEntryStore", "AccountStore", "TeamStore")
@observer
export class ChooseTargeting extends React.Component {
    constructor(props){
        super(props);
        this.state={sendToTeamID: "", sendToTagID: "", selectedUser: "", sendTargetType: "all", sendToUsers: []}
    }
  render(){
    const { DataEntryStore, AccountStore, TeamStore } = this.props;

    const updateState = async (val) => {
        await this.setState(val);
        // await updateState({valid: Boolean(this.state.q.trim() && this.state.resType 
        //   && (this.state.resConfig === "custom"? this.state.resChoices.length > 1 : true))});
        this.props.echostate(this.state);
      }

    const addUser = (user, allUsers, key) => {
      if (
        validateAdd(user, allUsers) !== null) {
        let newArry = this.state.sendToUsers;
        newArry.push(this.state.selectedUser);
        updateState({key:newArry});
      }
    };

    const options =
      TeamStore.structure.length !== 1 || TeamStore.tags.length !== 0 ? ([
        { text: "To Everyone", value: "all" },
        { text: "To Selected Teams/Tags", value: "teams" },
        { text: "To Select Users", value: "users" }
      ])
      :
      ([
        { text: "To Everyone", value: "all" },
        { text: "To Select Users", value: "users" }
      ]);


    const targetOptions =
      this.state.sendTargetType === "teams" ? (
        <Form style={{ paddingTop: 5 }}>
          <Form.Group>
            <TeamSelect
              label={"Limit Access To Teams"}
              placeholder="choose team..."
              defaultVal="global"
              outputVal={val =>
                updateState({ "sendToTeamID":val.value})
              }
            />
            <TagSelect
              label={"Limit Access By Tag"}
              placeholder="choose tag..."
              defaultVal={[]}
              outputVal={val =>
                updateState({ "sendToTagID":val})
              }
            />
          </Form.Group>
        </Form>
      ) : (
        <Form
          style={{ paddingTop: 5, minWidth: 400 }}
        >
          <Form.Group inline>
            <Form.Dropdown
              placeholder="Select User"
              search
              selection
              onChange={(e, val) => updateState({ "selectedUser": val.value})}
              value={this.state.selectedUser}
              options={AccountStore._getUsersSelectOptions()}
            />
            <Form.Button
              onClick={e =>
                addUser(
                  this.state.selectedUser,
                  this.state.sendToUsers,
                  "sendToUsers"
                )
              }
            >
              Add
            </Form.Button>
          </Form.Group>
          <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={this.state.sendToUsers}
              onRemove={val =>
                DataEntryStore.set(
                  "emailCampaign",
                  "sendToUsers",
                  labelsOneRemoved(
                    val,
                    this.state.sendToUsers
                  )
                )
              }
              labelprop={"displayName_full"}
              displayFilter={val => AccountStore._getUser(val)}
            />
          </div>
        </Form>
      );
    return (
        <div style={{ minWidth: 400 }}>
          <span style={{fontSize: ".9em"}}>
          Send {this.props.label? this.props.label: "Email"}{" "}
            <Dropdown
              inline
              onChange={(e, val) =>  updateState({ "sendTargetType":val.value})}
              options={options}
              value={this.state.sendTargetType}
            />
          </span>

          {this.state.sendTargetType === "all"? <div/> : targetOptions}
        </div>
    );

  }
}
