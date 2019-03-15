import React from "react";
import { inject, observer } from "mobx-react";
import { Header, Dropdown, Segment, Form } from "semantic-ui-react";
import { LabelGroup, validateAdd, labelsOneRemoved } from "../SharedUI/LabelGroup";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";

export const ChooseTargeting = inject("DataEntryStore", "AccountStore")(
  observer(props => {
    const { DataEntryStore, AccountStore } = props;

    const addUser = (user, allUsers, key) => {
      if (
        validateAdd(user, allUsers) !== null) {
        let newArry = DataEntryStore.emailCampaign.selectedUsers;
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
              value={DataEntryStore.emailCampaign.selectedTeamID}
              outputVal={val =>
                DataEntryStore.set("emailCampaign", "selectedTeamID", val)
              }
            />
            <TagSelect
              label={"Limit Access By Tag"}
              placeholder="choose tag..."
              value={DataEntryStore.emailCampaign.selectedTag}
              outputVal={val =>
                DataEntryStore.set("emailCampaign", "selectedTag", val)
              }
            />
          </Form.Group>
          {/* <p>
            <span>Targeting: </span>
            <span style={{ fontStyle: "italic" }}>
              <a href="">42 users</a>
            </span>
          </p> */}
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
              onChange={(e, val) =>
                DataEntryStore.set("emailCampaign", "selectedUser", val.value)
              }
              value={DataEntryStore.emailCampaign.selectedUser}
              options={AccountStore._getUsersSelectOptions()}
            />
            <Form.Button
              onClick={e =>
                addUser(
                  DataEntryStore.emailCampaign.selectedUser,
                  DataEntryStore.emailCampaign.selectedUsers,
                  "selectedUsers"
                )
              }
            >
              Add
            </Form.Button>
          </Form.Group>
          <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={DataEntryStore.emailCampaign.selectedUsers}
              onRemove={val =>
                DataEntryStore.set(
                  "emailCampaign",
                  "selectedUsers",
                  labelsOneRemoved(
                    val,
                    DataEntryStore.emailCampaign.selectedUsers
                  )
                )
              }
              labelprop={"displayName"}
              displayFilter={val => AccountStore._getUser(val)}
            />
          </div>
        </Form>
      );
    return (
      <Segment>
        <div style={{ minWidth: 400 }}>
          <Header>Choose Targeting</Header>
          <span>
            Target by{" "}
            <Dropdown
              inline
              onChange={(e, val) =>
                DataEntryStore.set("emailCampaign", "sendTargetType", val.value)
              }
              options={[
                { text: "Teams", value: "teams" },
                { text: "Users", value: "users" }
              ]}
              value={DataEntryStore.emailCampaign.sendTargetType}
            />
          </span>

          {targetOptions}
          {/* <p>
            <span>Email Variations Created: </span>
            <span style={{ marginTop: 5, fontStyle: "italic" }}> 3</span>
          </p> */}
        </div>
      </Segment>
    );
  })
);
