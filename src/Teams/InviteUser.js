import React from 'react';
import {inject, observer} from 'mobx-react';
import { Form, Icon } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AccountStore } from "../Stores/AccountStore";

export const InviteUser = inject("AccountStore")(observer((props) => {
  const { teamID, tagID, boss, isAdmin } = props.info;
  const { multipleRows } = props
  const setEmail = (emailInput) => {
    props.updateFields(emailInput, props.id)
  }

  const setField = (content) => {
    console.log(content, 'this riunsdf')
    props.updateFields(content, props.id)

  }

  const removeRow = () => {
    props.removeRow(props.id)
  }

  console.log('isAdmin', isAdmin)
  debugger
  return( 
    <Form widths="equal">
      <Form.Group className="form-row" > 
        {
          multipleRows && 
            <div className="close-field mobile">
              <Icon disabled name='times circle close-icon' onClick={removeRow}></Icon>
            </div>
          }
        <Form.Input label="Email"  placeholder="jane@placethatwework.co" onChange={(e, v) => setField({email: v.value})}/>
        <TeamSelect label="Choose Team:" value={teamID} outputVal={e => setField({teamID: e.value, teamName: e.text})}/>
        <TagSelect  label="Choose Tag (optional):" value={tagID} outputVal={e => setField({tagID: e})}/>
        <Form.Dropdown
          label="Reports to (optional):"
          search
          selection
          value={boss}
          onChange={(e, val) => setField({boss:val.value})}
          options={AccountStore._getUsersSelectOptions()}
        />
        {
          multipleRows && 
            <div className="close-field desktop">
              <Icon disabled name='times circle close-icon' onClick={removeRow}></Icon>
            </div>
          }
      </Form.Group>
      {
        !multipleRows && 
          <div style={{float: "right"}}>
            <Form.Checkbox checked={isAdmin} 
            onChange={() => setField({isAdmin: !isAdmin})} 
            label="Admin"/>
          </div>
      }
      
    </Form>
  )
}))