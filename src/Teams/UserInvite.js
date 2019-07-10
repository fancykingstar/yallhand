import React from 'react';
import {inject, observer} from 'mobx-react';
import { user } from "../DataExchange/PayloadBuilder"
import { Form, Segment, Header, Dropdown } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AccountStore } from "../Stores/AccountStore";
import { isValidEmail } from "../SharedValidations/InputValidations";

export const UserInvite = inject("AccountStore")(observer((props) => {
  const { teamID, tagID, email, isAdmin, boss } = props.info;
  const dropDownText = [{text: "today ⚡️", value: "today" }, { text: "in the future ⏳", value: "future"}]

  const getDataNewUser =  () => {
    const { AccountStore} = props;
    const userData = user()
    return {
      invitedBy: userData.invitedBy,
      email: email,
      teamID: teamID,
      teamName: AccountStore.account.label,
      accountID: userData.accountID,
      tags: tagID === "none" ? [] : [tagID],
      isAdmin,
      boss
    }
  }

  const checkMail =  () => {
    return !isValidEmail(props.email)
  }

  return( 
    <Segment>
      <Form widths="equal">
        <Form.Group > 
          <Form.Input label="Email" value={email} placeholder="jane@placethatwework.co" onChange={(e, v) => this.setState({email: v.value})}/>
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
        
        </Form.Group>
        <div style={{float:"left"}}> <span> start user{" "} <Dropdown options={dropDownText} value={"today"} inline /> </span></div>
        <div style={{paddingTop: 20}}>
          <Form.Group inline>
            <Form.Button size="small" onClick={e => this.onboard()} content="Onboard Now" icon="street view" primary disabled={checkMail()}/>
          </Form.Group>
        </div>
      </Form>
    </Segment>
  )
}))