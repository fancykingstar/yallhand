import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Icon, Accordion, Dropdown, Button, Label, Header, Form } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import TextField from "@material-ui/core/TextField";
// import Avatar from '@material-ui/core/Avatar';

import {AccountStore} from "../Stores/AccountStore";
import _ from "lodash";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";


export const TicketingItem = inject("DataEntryStore")(observer((props) => {
  const { id, _requireInfo, data, label, defaultAssignee} = props;

  const setField = (obj) => {
    props.updateFields(obj, props.index) 
  } 

  const removeRow = () => {
    props.removeRow(_id)
  }

  const shiftRow = (direction) => {
    props.shiftRow(direction, props.index)
  }

  const getDataItemOptions = (options) => options.map(opt => ({
    text: opt,
    key: opt + giveMeKey(),
    value: opt
  }))

  const addDataItem = () => setField({data: [...props.data, {type: "text", label: "", options: []}]})

  const updateDataItem = (obj, i) => {
    let newData = props.data
    const updatedRecord = Object.assign(newData[i], obj);
    newData.splice(i, 1, updatedRecord);
    setField({data:newData});
  }

  const displayData = () => data.map((dataItem, i) => 
    <Form.Group key={"ticketdata" + i} >
    <Form.Dropdown value={dataItem.type} onChange={(e,val) => updateDataItem({type: val.value},i)} selection label="Type" options={[{text: "Text", value: "text"}, {text:"Select", value: "select"},{text: "MultiSelect", value: "multi"}]}/>
    <Form.Input 
    value={dataItem.label} 
    onChange={(e,{value}) => updateDataItem({label: value},i)} 
    label="Label" ><input maxLength="48" /></Form.Input>
    {dataItem.type !== "text" &&
    <Form.Dropdown 
    className="MultiSelectDropDown"
    options={getDataItemOptions(dataItem.options)} 
    onAddItem={(e,val) => updateDataItem({options: [...dataItem.options, val.value]},i)}  
    additionLabel={<i>Hit enter to add:  </i>}
    onChange={(e, val) => updateDataItem({options: val.value},i)}
    search
    multiple
    selection
    fluid
    allowAdditions
    label="Enter Selection Options" />}
  </Form.Group>)

    return (
      <Segment secondary={props.isClose} >
      <Row >
        {/* <Col style={{maxWidth: 60}} sm={1}><Avatar>{props.index + 1}</Avatar> </Col> */}
        <Col>
        <div>
        {
          !props.index || props.isClose?
          <Header >
          {`${!props.index? "Open":"Close"}`} Ticket
          <Header.Subheader>Configure required information to {`${!props.index? "open":"close"}`} a ticket</Header.Subheader>
          </Header>
       :       
        <TextField
          required
          label="Stage Name"
          value={label}
          onKeyDown={(e)=> {if(e.keyCode ==13) props.newLine()}}
          onChange={e => setField({ label: e.target.value }) }
        />
        }
        </div>
        </Col>
      </Row>
        {!props.isClose &&
        <Row style={{paddingTop: 10}}><Col>
        <span>Default Assignee:</span><br/>
        <Dropdown selection placeholder="Choose..." onChange={(e,val)=>setField({defaultAssignee: val.value})} value={defaultAssignee} options={[...AccountStore._getUsersSelectOptions(), {"text":"None", "value":""}]} /><br/>
        </Col></Row>
        }
        <Row>
        <div style={{paddingLeft: 10}}>
        <Accordion>
          <Accordion.Title onClick={()=>setField({_requireInfo: !_requireInfo})} active={_requireInfo}><Icon name='dropdown' /> Required information for this stage {`${!props.index? "(note: user information will automatically be passed along when this ticket is opened)":""}`}</Accordion.Title>
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

          <div style={{display: "inline-block", float: "right", display: props.index === 0 || props.index === props.totalItemsCount - 1? "none":"content"}}>
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
 }));

