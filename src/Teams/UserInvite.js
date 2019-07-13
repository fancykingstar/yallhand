import React from 'react';
import {inject, observer} from 'mobx-react';
import { Form, Icon } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AccountStore } from "../Stores/AccountStore";

export const UserInvite = inject("AccountStore")(observer((props) => {
  const { teamID, tagID, boss } = props.info;

  const setEmail = (emailInput) => {
    props.updateFields(emailInput, props.id)
  }

  const removeRow = () => {
    props.removeRow(props.id)
  }
  return( 
    <Form widths="equal">
      <Form.Group className="form-row" > 
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
        <Icon disabled name='times circle close-icon' onClick={removeRow}></Icon>
        
      </Form.Group>
    </Form>
  )
}))