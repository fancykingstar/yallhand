import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Icon, Accordion, Dropdown, Button, Label, Header, Form } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import TextField from "@material-ui/core/TextField";
// import Avatar from '@material-ui/core/Avatar';

import {AccountStore} from "../Stores/AccountStore";
import _ from "lodash";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import toast  from "../YallToast"
import ChipInput from 'material-ui-chip-input'



export class TicketingItem extends React.Component {
  constructor(props){
    super(props);
    this.state={optionInput: ""};
  }
  render() {
  const { id, _requireInfo, data, label, defaultAssignee} = this.props;

  const setField = (obj) => {
    this.props.updateFields(obj, this.props.index) 
  } 



  const shiftRow = (direction) => {
    this.props.shiftRow(direction, this.props.index)
  }

  const getDataItemOptions = (options) => options.map(opt => ({
    text: opt,
    key: opt + giveMeKey(),
    value: opt
  }))

  const addDataItem = () => {
    //ticketItems: [ {data: [{text, label, options}]} ]

    let valid = false;
    if (!this.props.data.length) valid = true;
    else {
      const lastItem = this.props.data.slice().pop();
      if (!lastItem.label) toast.error("Please add a label", {hideProgressBar: true});
      else if (lastItem.type !== "text" && !lastItem.options.length) toast.error("Please add options for selection", {hideProgressBar: true});
      else valid = true;
    } 
    // console.log("valid", valid)
    // const newData = [...this.props.data, {type: "text", label: "", options: []}];
    console.log("newData", this.props.data)
    if(valid) setField({data: [...this.props.data, {type: "text", label: "", options: []}]});
  }

  const removeRow = () => {
    this.props.removeRow(_id)
  }

  const removeDataItem = (index) => {
    console.log("pressed")
    // let newData = this.props.data.slice();
    // newData.splice(index, 1)
    // console.log(this.props.data, newData)
    // setField({data: newData})
  }

  const updateDataItem = async (obj, i) => {
    let newData = this.props.data
    const updatedRecord = await Object.assign(newData[i], obj);
    await newData.splice(i, 1, updatedRecord);
    console.log("updatedrecord", newData)
    setField({data:newData});
  }

  const displayData = () => data.map((dataItem, i) => 
    <Form.Group key={"ticketdata" + i} >
    <Form.Dropdown className="FixSemanticLabel" value={dataItem.type} onChange={(e,val) => updateDataItem({type: val.value},i)} selection label="Type" options={[{text: "Text", value: "text"}, {text:"Select", value: "select"},{text: "MultiSelect", value: "multiselect"},{text: "File Upload", value: "file"}]}/>
    <Form.Input 
    className="FixSemanticLabel"
    value={dataItem.label} 
    onChange={(e,{value}) => updateDataItem({label: value},i)} 
    label="Label" ><input maxLength="48" /></Form.Input>
    {dataItem.type.toLowerCase().includes('select') &&

        <>
      <Form.Field className="FixSemanticLabel">

      <label>Create Options</label>
      <input 
        value={this.state.optionInput}
        onChange={(e) => this.setState({optionInput: e.target.value})}
        onKeyDown={e => {
          if(e.keyCode === 13) {
          if (this.state.optionInput && !dataItem.options.includes(this.state.optionInput)) updateDataItem({options: [...dataItem.options, this.state.optionInput]},i)
          this.setState({optionInput: ""})
          }
        }}
        />
              <label style={{fontSize: "0.8em", color: "#ABACAB"}}>Hit enter to add entry</label>
      
      </Form.Field>
      <Form.Field>
            <Label.Group>
      {dataItem.options.map(x => <Label >{x}<Icon name='delete' onClick={()=> updateDataItem({options: dataItem.options.filter(y=>y!==x)},i)} /></Label>)}
      </Label.Group>
      </Form.Field>
    
    </>
}
    {/* <Form.Dropdown 
    className="MultiSelectDropDown"
    options={getDataItemOptions(dataItem.options)} 
    onAddItem={(e,val) => updateDataItem({options: [...dataItem.options, val.value]},i)}  
    additionLabel={<i>Hit enter to add:  </i>}
    onChange={(e, val) => updateDataItem({options: [...dataItem.options, val.value]},i)} 
    search
    multiple
    selection
    fluid
    allowAdditions
    label="Enter Selection Options" />} */}
    <Form.Field>
      <div style={{marginTop: 25}}>
       <Button icon>
       <Icon name='close' onClick={()=>removeDataItem(i)}></Icon>
       </Button>
       </div>
    </Form.Field>
  </Form.Group>
  
  )

    return (
      <Segment secondary={this.props.isClose} >
    
      <Row >
        {/* <Col style={{maxWidth: 60}} sm={1}><Avatar>{this.props.index + 1}</Avatar> </Col> */}
        <Col>
        <div>
        {
          !this.props.index || this.props.isClose?
          <Header >
          {`${!this.props.index? "Open":"Close"}`} Ticket
          <Header.Subheader>Configure required information to {`${!this.props.index? "open":"close"}`} a ticket</Header.Subheader>
          </Header>
       :       
        <Form>
          <Form.Input
          required
          className="FixSemanticLabel"
          label="Stage Name"
          value={label}
          onKeyDown={(e)=> {if(e.keyCode ==13) this.props.newLine()}}
          onChange={e => setField({ label: e.target.value }) }
        />
        </Form>
        }
        </div>
        </Col>
      </Row>
        {!this.props.isClose &&
        <Row style={{paddingTop: 10}}><Col>
        {/* <span>Default Assignee:</span><br/> */}
        <Form>
          <Form.Dropdown className="FixSemanticLabel" label="Default Assignee" selection placeholder="Choose..." onChange={(e,val)=>setField({defaultAssignee: val.value})} value={defaultAssignee} options={[...AccountStore._getUsersSelectOptions(), {"text":"None", "value":""}]} />
        </Form>

        </Col></Row>
        }
        <Row>
        <div style={{paddingLeft: 10}}>
        <Accordion>
          <Accordion.Title onClick={()=>setField({_requireInfo: !_requireInfo})} active={_requireInfo}><Icon name='dropdown' /> Required information for this stage {`${!this.props.index? "(note: user information will automatically be passed along when this ticket is opened)":""}`}</Accordion.Title>
          <Accordion.Content active={_requireInfo}>
            <Container>
              <Form>
                {displayData()}
              </Form>
              {
                data.length < 4 &&
                <div>
                 <Button size="mini" primary circular icon="plus" onClick={()=>addDataItem()} />
                </div>
              }
            </Container>
          </Accordion.Content>
        </Accordion>
        </div>
       
        </Row>
        <Row>

        </Row>
       <div style={{ padding: "20px 0 20px", width: "100%" }}>

          <div style={{display: "inline-block", float: "right", display: this.props.index === 0 || this.props.index === this.props.totalItemsCount - 1? "none":"content"}}>
        {/* <Icon color="grey" name="arrow up" 
        onClick={()=>shiftRow("up")} 
        />
        <Icon color="grey" name="arrow down" 
        onClick={()=>shiftRow("down")} 
        /> */}
        <Icon color="grey" name="remove" 
        onClick={removeRow} 
        />

        </div>
       
        </div>

      </Segment>)
  }}
  ;

