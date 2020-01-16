/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Segment, Icon } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const PollItem = inject('DataEntryStore')(
  observer(props => {
    const {
      q,
      _id,
      multiConfig,
      resChoices=[],
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

    const MultiChoiceResponses = () =>
      resChoices.map((choice, i) => (
        <TextField
          // eslint-disable-next-line react/no-array-index-key
          key={`survey-q${i}`}
          required
          value={choice}
          onBlur={()=> {
            if (!resChoices[i].trim()) {
              setField({
                resChoices: resChoices.filter(x => x !== resChoices[i])
              });
            }
          }}
          onKeyDown={(e)=> {
            if(e.keyCode === 13 && resChoices.length < 5) {
              setField({resChoices: [...resChoices, ""]});
            }
          }}
          onChange={e=>{
            const updated = resChoices.slice()
            updated[i] = e.target.value;
            setField({resChoices: updated});
          }}
          placeholder="Enter a response choice..."
          margin="normal"
        />
      )
    );

    const addMultiChoice = resChoices.length < 5 ? (
      <span
        onClick={() => setField({
          resChoices: [...resChoices, ""]
        })}
        style={{ color:"#2185d0" }}
      >
        Create Choice...
      </span>
    ) : null

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
        <FormControl required>
          <InputLabel htmlFor="res-type">
            Options
          </InputLabel>
          <Select
            value={multiConfig}
            onChange={(e, val) => setField({ multiConfig: val.props.value })}
            name="res-type"
            inputProps={{ id: "res-type" }}
            style={{ width: 200 }}
          >
            <MenuItem value="custom">Custom...</MenuItem>
            <MenuItem value="truefalse">True/False</MenuItem>
            <MenuItem value="yesno">Yes/No</MenuItem>
            <MenuItem value="thumbsupdown">👍/👎</MenuItem>
          </Select>
          {multiConfig!== "custom"? null : MultiChoiceResponses()}
          {multiConfig!== "custom"? null : addMultiChoice}
  
        </FormControl>
        <br />
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
