/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Segment, Icon } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";

const PollItem = inject('DataEntryStore')(
  observer(props => {
    const {
      q,
      _id,
    } = props.info;

    const setField = content => {
      const isValid =
        Object.values({
          q: Boolean(q.trim().length !== 0),
        }).filter(i => !i).length === 0;
      const obj = Object.assign(content, { valid: isValid });
      props.updateFields(obj, props.index);
    };

    const removeRow = () => {
      props.removeRow(_id);
    };

    const shiftRow = direction => {
      props.shiftRow(direction, props.index);
    };

    return (
      <Segment
        ref={props.itemRef}
      >
        <TextField
          required
          fullWidth
          label="Question"
          placeholder="Enter a survey question here"
          value={q}
          onChange={e => setField({ q: e.target.value })}
          margin="normal"
        />
        <div style={{ padding: '20px 0 20px', width: '100%' }}>
          <div
            style={{
              float: 'right',
              display: props.index === 0 ? 'none' : 'content',
            }}
          >
            <Icon color="grey" name="arrow up" onClick={() => shiftRow('up')} />
            <Icon color="grey" name="arrow down" onClick={() => shiftRow('down')} />
            <Icon color="grey" name="remove" onClick={removeRow} />
          </div>
        </div>
      </Segment>
    );
  }),
);

export default PollItem;
