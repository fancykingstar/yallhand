import React from "react"
import {inject, observer} from "mobx-react"
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { ChannelSelect } from "../SharedUI/ChannelSelect";
import { Form } from "semantic-ui-react";
import {
    LabelGroup,
    validateAdd,
    labelsOneRemoved
  } from "../SharedUI/LabelGroup";

@inject("DataEntryStore", "TeamStore", "ChannelStore")
@observer
export class AdminConfig extends React.Component {
    render() {
        const {DataEntryStore} = this.props
        const {TeamStore} = this.props
        const {ChannelStore} = this.props
        const add = (type, val) => {
            const key = {
              team: {
                valid: DataEntryStore[this.props.storeTarget].adminTeams,
                set: "adminTeams"
              },
              tag: {
                valid: DataEntryStore[this.props.storeTarget].adminTags,
                set: "adminTags"
              },
              channel: {
                valid: DataEntryStore[this.props.storeTarget].adminChannels,
                set: "adminChannels"
              }
            };
            const newData = validateAdd(val, key[type].valid);
            newData === null
              ? null
              : DataEntryStore.set("userEditFields", key[type]["set"], newData);
          };
        
        return(
            <React.Fragment>
          <Form.Group style={{ paddingTop: 10 }}>
            <TeamSelect
              label={"Grant View/Edit Access To Teams"}
              placeholder="choose team..."
              outputVal={val =>
                DataEntryStore.set(this.props.storeTarget, "adminSelectedTeam", val)
              }
            />
            <Form.Button
              style={{ marginTop: 21 }}
              icon="plus"
              disabled={DataEntryStore[this.props.storeTarget].adminSelectedTeam === ""}
              onClick={e =>
                add("team", DataEntryStore[this.props.storeTarget].adminSelectedTeam)
              }
            />
          <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={DataEntryStore[this.props.storeTarget].adminTeams}
              onRemove={val =>
                DataEntryStore.set(
                  this.props.storeTarget,
                  "adminTeams",
                  labelsOneRemoved(
                    val,
                    DataEntryStore[this.props.storeTarget].adminTeams
                  )
                )
              }
              displayFilter={val => TeamStore._getTeam(val)}
            />
          </div>
          </Form.Group>

         

          <Form.Group style={{ paddingTop: 10 }}>
            <TagSelect
              label={"Grant View/Edit Access To Tags"}
              placeholder="choose tag..."
              outputVal={val =>
                DataEntryStore.set(this.props.storeTarget, "adminSelectedTag", val)
              }
            />
            <Form.Button
              style={{ marginTop: 21 }}
              icon="plus"
              disabled={DataEntryStore[this.props.storeTarget].adminSelectedTag === ""}
              onClick={e =>
                add("tag", DataEntryStore[this.props.storeTarget].adminSelectedTag)
              }
            /> <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
                currentArray={DataEntryStore[this.props.storeTarget].adminTags}
                onRemove={val =>
                  DataEntryStore.set(
                    this.props.storeTarget,
                    "adminTags",
                    labelsOneRemoved(
                      val,
                      DataEntryStore[this.props.storeTarget].adminTags
                    )
                  )
                }
                displayFilter={val => TeamStore._getTag(val)}
              />
            </div>
          </Form.Group>

         

          <Form.Group style={{ paddingTop: 10 }}>
            <ChannelSelect
              label={"Grant View/Edit Access To Channels"}
              placeholder="choose channel..."
              outputVal={val =>
                DataEntryStore.set(
                  this.props.storeTarget,
                  "adminSelectedChannel",
                  val
                )
              }
            />
            <Form.Button
              style={{ marginTop: 21 }}
              icon="plus"
              disabled={DataEntryStore[this.props.storeTarget].adminSelectedChannel === ""}
              onClick={e =>
                add(
                  "channel",
                  DataEntryStore[this.props.storeTarget].adminSelectedChannel
                )
              }
            />
            <div style={{ marginTop: 20, paddingBottom: 20 }}>
            <LabelGroup
              currentArray={DataEntryStore[this.props.storeTarget].adminChannels}
              onRemove={val =>
                DataEntryStore.set(
                  this.props.storeTarget,
                  "adminChannels",
                  labelsOneRemoved(
                    val,
                    DataEntryStore[this.props.storeTarget].adminChannels
                  )
                )
              }
              displayFilter={val => ChannelStore._getChannel(val)}
            />
          </div>
          </Form.Group>

          
        </React.Fragment>
        )
    }
}