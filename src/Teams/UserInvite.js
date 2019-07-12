import React from 'react';
import {inject, observer} from 'mobx-react';
import { user } from "../DataExchange/PayloadBuilder"
import { Form, Dropdown, Button } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AccountStore } from "../Stores/AccountStore";
import { users } from "../DataExchange/Down";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";
import moment from "moment"

export const UserInvite = inject("AccountStore")(observer((props) => {
  const { teamID, tagID, email, isAdmin, boss } = props.info;
  const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]

  // const getDataNewUser =  () => {
  //   const { AccountStore} = props;
  //   const userData = user()
  //   return {
  //     invitedBy: userData.invitedBy,
  //     email: email,
  //     teamID: teamID,
  //     teamName: AccountStore.account.label,
  //     accountID: userData.accountID,
  //     tags: tagID === "none" ? [] : [tagID],
  //     isAdmin,
  //     boss
  //   }
  // }

  const setEmail = (emailInput) => {
    props.updateFields(emailInput, props.id)
  }

  const removeRow = () => {
    props.removeRow(props.id)
  }
  return( 
    <Form widths="equal">
      <Form.Group > 
        <Form.Input label="Email" placeholder="jane@placethatwework.co" onChange={(e, v) => setEmail({email: v.value})}/>
        <TeamSelect label="Choose Team:" value={teamID} outputVal={e => this.setState({teamID: e.value, teamName: e.text})}/>
        <TagSelect  label="Choose Tag (optional):" value={tagID} outputVal={e => this.setState({tagID: e})}/>
        <Form.Dropdown
          label="Reports to (optional):"
          search
          selection
          onChange={(e, val) => this.setState({boss:val.value})}
          value={boss}
          options={AccountStore._getUsersSelectOptions()}
        />
        <Button onClick={removeRow}> x </Button>
      </Form.Group>
      <div style={{float:"left"}}> <span> start user{" "} <Dropdown options={dropDownText} value={"today"} inline /> </span></div>
    </Form>
  )
}))