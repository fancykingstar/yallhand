import React from 'react';
import {inject, observer} from 'mobx-react';
import { Form, Icon } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AccountStore } from "../Stores/AccountStore";

export const InviteUser = inject("AccountStore")(observer((props) => {
  const { teamID, tagID, boss, isAdmin } = props.info;
  const setEmail = (emailInput) => {
    props.updateFields(emailInput, props.id)
  }

  const setField = (content) => {
    console.log('before', content)
    props.updateFields(content, props.id)
  }

  const removeRow = () => {
    props.removeRow(props.id)
  }
  return( 
    <Form widths="equal">
      <Form.Group className="form-row" > 
        <div className="close-field mobile">
          <Icon disabled name='times circle close-icon' onClick={removeRow}></Icon>
        </div>
        <Form.Input label="Email" placeholder="jane@placethatwework.co" onChange={(e, v) => setField({email: v.value})}/>
        <TeamSelect label="Choose Team:" outputVal={e => setField({teamID: e.value, teamName: e.text})}/>
        <TagSelect  label="Choose Tag (optional):" outputVal={e => setField({tagID: e})}/>
        <Form.Dropdown
          label="Reports to (optional):"
          search
          selection
          onChange={(e, val) => setField({boss:val.value})}
          options={AccountStore._getUsersSelectOptions()}
        />
        <div className="close-field desktop">
          <Icon disabled name='times circle close-icon' onClick={removeRow}></Icon>
        </div>
      </Form.Group>
    </Form>
  )
}))