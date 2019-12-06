import React from "react";
import { Segment, Icon, Button, Label, Header, Form, Checkbox } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import {AccountStore} from "../Stores/AccountStore";
import toast  from "../YallToast"
import Collapse from '@material-ui/core/Collapse';

export class TicketingItem extends React.Component {
  constructor(props){
    super(props);
    this.state={optionInput: ""};
  }
  render() {
  const { id, data, label, defaultAssignee} = this.props;
  const _requireInfo = data.length > 0;



  const setField = (obj) => {
    this.props.updateFields(obj, this.props.index) 
  } 


  const addDataItem = () => {
    let valid = false;
    if (!this.props.data.length) valid = true;
    else {
      const lastItem = this.props.data.slice().pop();
      if (!lastItem.label) toast.error("Please add a label", {hideProgressBar: true});
      else if (lastItem.type !== "text" && !lastItem.options.length) toast.error("Please add options for selection", {hideProgressBar: true});
      else valid = true;
    } 
    if(valid) setField({data: [...this.props.data, {type: "text", label: "", options: []}]});
  }

  const toggleRequiredData = () => {
    if (this.props.data.length) setField({data:[]});
    else addDataItem() ;
  }

  const removeRow = () => {
    this.props.removeRow(_id)
  }

  const removeDataItem = (index) => {
    let newData = this.props.data.slice();
    newData.splice(index, 1)
    setField({data: newData})
  }

  const updateDataItem = async (obj, i) => {
    let newData = this.props.data
    const updatedRecord = await Object.assign(newData[i], obj);
    await newData.splice(i, 1, updatedRecord);
  
    setField({data:newData});
  }

  const displayData = () => data.map((dataItem, i) => 
    <Form.Group key={"ticketdata" + i} >
    <Form.Dropdown className="FixSemanticLabel" value={dataItem.type} onChange={(e,val) => updateDataItem({type: val.value},i)} selection label="Type" options={[{text: "Text", value: "text"}, {text:"Select", value: "select"},{text: "MultiSelect", value: "multiselect"},{text: "File Upload", disabled: this.props.fileUploadInUse, value: "file"}]}/>
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

        <Form>
          <Form.Dropdown className="FixSemanticLabel" label="Default Assignee" selection placeholder="Choose..." onChange={(e,val)=>setField({defaultAssignee: val.value})} value={defaultAssignee} options={[...AccountStore._getUsersSelectOptions(), {"text":"None", "value":""}]} />
          {JSON.stringify(this.props.isOpen )}
          {!this.props.index && !defaultAssignee? <p style={{marginTop: -10, fontSize: ".8em"}}>You don't have a default assignee and Yallhands will email notify all collaborators when a new ticket from this template is created.</p>:""}
        </Form>

        </Col></Row>
        }
        <Row>
        <div style={{paddingLeft: 20, paddingTop: 10}}>
        <span><Checkbox toggle checked={_requireInfo} 
        label={`Require information for this stage ${!this.props.index? "(note: user information will automatically be passed along when this ticket is opened)":""}`}
        onChange={()=> toggleRequiredData()} /></span>
        <Collapse in={_requireInfo} >
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
        </Collapse>
  
        </div>
       
        </Row>
        <Row>

        </Row>
       <div style={{ padding: "20px 0 20px", width: "100%" }}>

          <div style={{display: "inline-block", float: "right", display: this.props.index === 0 || this.props.index === this.props.totalItemsCount - 1? "none":"content"}}>
       
        <Icon color="grey" name="remove" 
        onClick={removeRow} 
        />

        </div>
       
        </div>

      </Segment>)
  }}
  ;

