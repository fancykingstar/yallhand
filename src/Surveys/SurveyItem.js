import React from "react";
import { Segment, Message, Checkbox, Icon } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";


export class SurveyItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: "",
      resType: "",
      resRequired: false,
      resConfig: "custom",
      resChoices: [],
      valid: false,
      scaleLabels_lo: "Least Favorable",
      scaleLabels_hi: "Most Favorable"
    };
  }
  render() {
    // const { q, resType, resRequired, resConfig, resChoices } = this.state;
    const replaceArray = (arr, i, val) => {
      const newArr = arr.slice(0);
      newArr[i] = val;
      return newArr;
    };

    const updateState = async (val) => {
      await this.setState(val);
      await this.setState({valid: Boolean(this.state.q.trim() && this.state.resType 
        && (this.state.resConfig === "custom"? this.state.resChoices.length > 1 : true))});
      this.props.echostate(this.state);
    }



    const Add = this.state.resChoices.slice(-1)[0] && this.state.resChoices.length < 5?  <span onClick={()=>this.setState({resChoices: [...this.state.resChoices, ""]})} style={{color:"#2185d0"}}>Create Choice...</span> : null

    const MultiChoiceResponses =
      this.state.resChoices.length < 2 ? (
        <TextField
          required
          onKeyDown={(e)=> {if(e.keyCode ==13) updateState({resChoices: [...this.state.resChoices, ""]})}}
          onChange={e => updateState({ resChoices: [e.target.value] })}
          placeholder="Enter a response choice..."
          // className={classes.textField}
          margin="normal"
        />
      ) : (
        this.state.resChoices.map((choice, i) => (
          <TextField
            key={`survey-q${i}`}
            required
            value={choice}
            onBlur={()=> {if(!this.state.resChoices[i].trim()) updateState({resChoices: this.state.resChoices.filter(x => x !== this.state.resChoices[i])}); }}
            onKeyDown={(e)=> {if(e.keyCode ==13 && this.state.resChoices.length < 5) updateState({resChoices: [...this.state.resChoices, ""]})}}
            onChange={e =>
              updateState({
                resChoices: replaceArray(this.state.resChoices, i, e.target.value)
              })
            }
            placeholder="Enter a response choice..."
            margin="normal"
          />
        ))
      );

    const ScaleLabels = !this.state.resType==="scale"? null :
    <React.Fragment>
      <TextField
      required
    
      onBlur={()=> {if(!this.state.scaleLabels_lo.trim()) updateState({scaleLabels_lo: "Least Favorable"}); }}
    
      label="Lowest Label"
      value={this.state.scaleLabels_lo}
      onChange={e=>updateState({scaleLabels_lo: e.target.value})}
      placeholder="Enter a response choice..."
      margin="normal"
    />
    <TextField
    required

    onBlur={()=> {if(!this.state.scaleLabels_hi.trim()) updateState({scaleLabels_hi: "Most Favorable"}); }}
    label="Highest Label"
    value={this.state.scaleLabels_hi}
    onChange={e=>updateState({scaleLabels_hi: e.target.value})}
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
          value={this.state.resConfig}
          onChange={(e, val) => updateState({ resConfig: val.props.value })}
          name="res-type"
          inputProps={{
            id: "res-type"
          }}
          style={{ width: 200 }}
        >
          <MenuItem value="custom">Custom...</MenuItem>
          <MenuItem value="multichoice">True/False</MenuItem>
          <MenuItem value="text">Yes/No</MenuItem>
          <MenuItem value="scale">👍/👎</MenuItem>
        </Select>
        {this.state.resConfig !== "custom"? null : MultiChoiceResponses}
        {this.state.resConfig !== "custom"? null : Add}

      </FormControl>
    );

    const ScaleOptions =
    <FormControl style={{ paddingLeft: 10 }} required>
        <InputLabel style={{ paddingLeft: 10 }} htmlFor="res-type">
          Options
        </InputLabel>
        <Select
          value={this.state.resConfig}
          onChange={(e, val) => updateState({ resConfig: val.props.value })}
          name="res-type"
          inputProps={{
            id: "res-type"
          }}
          style={{ width: 200 }}
        >
          <MenuItem value="Scale10">Scale on 1-10</MenuItem>
          <MenuItem value="Scale5">Scale on 1-5</MenuItem>
          <MenuItem value="star">Star Rating ⭐️⭐️⭐️</MenuItem>
        </Select>
        {this.state.resConfig === "Scale10" || this.state.resConfig === "Scale5"?  ScaleLabels : null}
      </FormControl>
    
    const ResponseConfig =
      this.state.resType === "multichoice" ? MultiChoiceOptions : this.state.resType === "scale"? ScaleOptions : null;
    return (
      <Segment color={this.props.error? "red": null}>
        <TextField
          required
          fullWidth
          label="Question"
          placeholder="Enter a survey question here"
          onChange={e =>
            updateState({
              q: e.target.value
            })
          }
          margin="normal"
        />
        <FormControl required>
          <InputLabel htmlFor="res-type">Response Type</InputLabel>
          <Select
            value={this.state.resType}
            onChange={(e, val) => updateState({ resType: val.props.value })}
            name="res-type"
            inputProps={{
              id: "res-type"
            }}
            style={{ width: 200 }}
          >
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
              checked={this.state.resRequired}
              onChange={e => updateState({ resRequired: this.state.resRequired })}
              label="Required"
            />
          </div>
          <div style={{display: "inline-block", float: "right", display: this.props.index === 0? "none":"content"}}>
        <Icon color="grey" name="arrow up" 
        // onClick={e => this.props.moveUp(val)} 
        />
        <Icon color="grey" name="arrow down" 
        // onClick={e => this.props.moveDown(val)} 
        />
        <Icon color="grey" name="remove" 
        // onClick={e => this.props.remove(item)} 
        />

        </div>
       
        </div>
       

        {!this.props.error? null :
          <Message negative>
          <p>Please ensure all fields are completed properly</p>
        </Message>
        }
      </Segment>
    );
  }
}
