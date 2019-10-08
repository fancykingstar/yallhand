import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Icon } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";


export const TaskItem = inject("DataEntryStore")(observer((props) => {
  const { task_label, _id} = props.info;

  const setField = (content) => {
    const isValid = 
    Object.values({
      task_label: Boolean(task_label.trim().length !== 0),
    }).filter(i => !i).length === 0;
    const obj = Object.assign(content, {valid: isValid})
    props.updateFields(obj, props.index) 
  } 

  const removeRow = () => {
    props.removeRow(_id)
  }

  const shiftRow = (direction) => {
    props.shiftRow(direction, props.index)
  }

    return (
      <Segment 
      // color={this.props.error? "red": null}
      >
        <Avatar>{props.index + 1}</Avatar>
        <TextField
          required
          fullWidth
          label="Task Description"
          placeholder="Enter a task question here"
          value={task_label}
          onChange={e => setField({ task_label: e.target.value }) }
          margin="normal"
        />
    
        <br />
       <div style={{ padding: "20px 0 20px", width: "100%" }}>

          <div style={{display: "inline-block", float: "right", display: props.index === 0? "none":"content"}}>
        <Icon color="grey" name="arrow up" 
        onClick={()=>shiftRow("up")} 
        />
        <Icon color="grey" name="arrow down" 
        onClick={()=>shiftRow("down")} 
        />
        <Icon color="grey" name="remove" 
        onClick={removeRow} 
        />

        </div>
       
        </div>

      </Segment>)
 }));

