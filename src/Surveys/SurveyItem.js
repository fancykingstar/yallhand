import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Message, Checkbox, Icon } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import _ from "lodash";


export const SurveyItem = inject("DataEntryStore")(observer((props) => {
  const { q, _id, multiConfig, scaleConfig, resType, scaleLabels_hi, scaleLabels_lo, resChoices, resRequired, valid} = props.info;

  const setField = (content) => {
    const isValid = 
    Object.values({
      q: Boolean(q.trim().length !== 0),
      // multi: Boolean((multiConfig === "custom"? resChoices.length > 1 : true) && resType === "multichoice")
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

  const addMultiChoice = resChoices.length < 5?  <span onClick={()=>setField({resChoices: [...resChoices, ""]})} style={{color:"#2185d0"}}>Create Choice...</span> : null


    const MultiChoiceResponses = () =>
        resChoices.map((choice, i) => (
          <TextField
            key={`survey-q${i}`}
            required
            value={choice}
            onBlur={()=> {if(!resChoices[i].trim()) setField({resChoices: resChoices.filter(x => x !== resChoices[i])}); }}
            onKeyDown={(e)=> {if(e.keyCode ==13 && resChoices.length < 5) setField({resChoices: [...resChoices, ""]})}}
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
    


    const ScaleLabels = !resType==="scale"? null :
    <React.Fragment>
      <TextField
      required
      onBlur={()=> {if(!scaleLabels_lo.trim()) setField({scaleLabels_lo: "Least Favorable"}); }}
      label="Lowest Label"
      value={scaleLabels_lo}
      onChange={e=>setField({scaleLabels_lo: e.target.value})}
      placeholder="Enter a response choice..."
      margin="normal"
    />
      <TextField
      required
      onBlur={()=> {if(!scaleLabels_hi.trim()) setField({scaleLabels_hi: "Most Favorable"}); }}
      label="Highest Label"
      value={scaleLabels_hi}
      onChange={e=>setField({scaleLabels_hi: e.target.value})}
      placeholder="Enter a response choice..."
      margin="normal"
    />
  </React.Fragment>
    const MultiChoiceOptions = (
      <FormControl style={{ paddingLeft: 10 }} required>
        <InputLabel style={{ paddingLeft: 10 }} htmlFor="res-type">
          Options
        </InputLabel>
        <Select
          value={multiConfig}
          onChange={(e, val) => setField({ multiConfig: val.props.value })}
          name="res-type"
          inputProps={{ id: "res-type" }} style={{ width: 200 }}
        >
          <MenuItem value="custom">Custom...</MenuItem>
          <MenuItem value="truefalse">True/False</MenuItem>
          <MenuItem value="yesno">Yes/No</MenuItem>
          <MenuItem value="thumbsupdown">👍/👎</MenuItem>
        </Select>
        {multiConfig!== "custom"? null : MultiChoiceResponses()}
        {multiConfig!== "custom"? null : addMultiChoice}

      </FormControl>
    );

    const ScaleOptions =
    <FormControl style={{ paddingLeft: 10 }} required>
        <InputLabel style={{ paddingLeft: 10 }} htmlFor="res-type">
          Options
        </InputLabel>
        <Select
          value={scaleConfig}
          onChange={(e, val) => setField({ scaleConfig: val.props.value })}
          name="res-type"
          inputProps={{
            id: "res-type"
          }}
          style={{ width: 200 }}
        >
          <MenuItem value="scale10">Scale on 1-10</MenuItem>
          <MenuItem value="scale5">Scale on 1-5</MenuItem>
          <MenuItem value="star">5-Star Rating ⭐️</MenuItem>
        </Select>
        {scaleConfig === "scale10" || scaleConfig === "scale5"?  ScaleLabels : null}
      </FormControl>
    
    const ResponseConfig =
      resType === "multichoice" ? MultiChoiceOptions : resType === "scale"? ScaleOptions : null;
    return (
      <Segment 
      ref={props.itemRef}
      // color={this.props.error? "red": null}
      >
        <TextField
          required
          fullWidth
          label="Question"
          placeholder="Enter a survey question here"
          value={q}
          onChange={e => setField({ q: e.target.value }) }
          margin="normal"
        />
         <FormControl required>
          <InputLabel htmlFor="res-type">Response Type</InputLabel>
          <Select
            value={resType}
            onChange={(e, val) => setField({ resType: val.props.value })}
            name="res-type"
            inputProps={{ id: "res-type" }} style={{ width: 200 }} >
            <MenuItem value="multichoice">Multiple-Choice</MenuItem>
            <MenuItem value="text">Short Answer</MenuItem>
            <MenuItem value="scale">Scale or Rating</MenuItem>
          </Select>
        </FormControl>
        {ResponseConfig}
    
        <br />
       <div style={{ padding: "20px 0 20px", width: "100%" }}>
          <div style={{float: "left"}}>
            <Checkbox
              checked={resRequired}
              onChange={e => setField({ resRequired: !resRequired })}
              label="Required"
            />
          </div>

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
       

        {/* {!this.props.error? null :
          <Message negative>
          <p>Please ensure all fields are completed properly</p>
        </Message>
        } */}
      </Segment>)
 }));

