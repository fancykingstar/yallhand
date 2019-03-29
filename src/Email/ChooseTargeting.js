import React from "react";
import { inject, observer } from "mobx-react";
import { Dropdown, Form } from "semantic-ui-react";
import { LabelGroup, validateAdd, labelsOneRemoved } from "../SharedUI/LabelGroup";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";

@inject("DataEntryStore", "AccountStore")
@observer
export class ChooseTargeting extends React.Component {
  render(){
    const { DataEntryStore, AccountStore } = this.props;

    const addUser = (user, allUsers, key) => {
      if (
        validateAdd(user, allUsers) !== null) {
        let newArry = DataEntryStore.emailCampaign.sendToUsers;
        newArry.push(DataEntryStore.emailCampaign.selectedUser);
        DataEntryStore.set("emailCampaign", key, newArry);
      }
    };


    const targetOptions =
      DataEntryStore.emailCampaign.sendTargetType === "teams" ? (
        <Form style={{ paddingTop: 5 }}>
          <Form.Group>
            <TeamSelect
              label={"Limit Access To Teams"}
              placeholder="choose team..."
              defaultVal="global"
              outputVal={val =>
                DataEntryStore.set("emailCampaign", "sendToTeamID", val.value)
              }
            />
            <TagSelect
              label={"Limit Access By Tag"}
              placeholder="choose tag..."
              defaultVal={[]}
              outputVal={val =>
                DataEntryStore.set("emailCampaign", "sendToTagID", val.value)
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
              onChange={(e, val) => DataEntryStore.set("emailCampaign", "selectedUser", val.value)}
              value={DataEntryStore.emailCampaign.selectedUser}
              options={AccountStore._getUsersSelectOptions()}
            />
            <Form.Button
              onClick={e =>
                addUser(
                  DataEntryStore.emailCampaign.selectedUser,
                  DataEntryStore.emailCampaign.sendToUsers,
                  "sendToUsers"
                )
              }
            >
              Add
            </Form.Button>
          </Form.Group>
          <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={DataEntryStore.emailCampaign.sendToUsers}
              onRemove={val =>
                DataEntryStore.set(
                  "emailCampaign",
                  "sendToUsers",
                  labelsOneRemoved(
                    val,
                    DataEntryStore.emailCampaign.sendToUsers
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
          Send Email{" "}
            <Dropdown
              inline
              onChange={(e, val) =>  DataEntryStore.set("emailCampaign", "sendTargetType", val.value)}
              options={[
                { text: "To Everyone", value: "all" },
                { text: "To Selected Teams/Tags", value: "teams" },
                { text: "To Select Users", value: "users" }
              ]}
              value={DataEntryStore.emailCampaign.sendTargetType}
            />
          </span>

          {DataEntryStore.emailCampaign.sendTargetType === "all"? <div/> : targetOptions}
        </div>
    );

  }
}

