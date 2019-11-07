import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Icon, Accordion, Dropdown, Button, Label, Header, Form } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Avatar from '@material-ui/core/Avatar';

import {AccountStore} from "../Stores/AccountStore";
import _ from "lodash";


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

  const updateDataItem = (obj, i) => {
    let newData = props.data
    newData.splice(i, 1, Object.assign(newData[i], obj));
    setField(newData);
  }

  const displayData = () => data.map((dataItem, i) => 
    <Form.Group>
    <Form.Dropdown selection label="Type" options={[{text: "Text", value: "Text"}, {text:"Select", value: "select"},{text: "MultiSelect", value: "multi"}]}/>
    <Form.Input value={dataItem} onChange={val => updateDataItem(i, {defaultAssignee: val.value})} label="Label" ><input maxLength="48" /></Form.Input>
    <Form.Input label="Enter Selection Options" action='Add' placeholder='Search...'/>
    <Form.Field>
    <div>
      <Label size="mini">Windows <Icon name='delete' /></Label>
      <Label size="mini">Monitor</Label>
      <Label size="mini">Outlook/Mail</Label>
      <Label size="mini">Hardware</Label>
      <Label size="mini">Other</Label>
      </div>
    </Form.Field>
  </Form.Group>)

    return (
      <Segment >
      <Row justifyContent="center">
        <Col style={{maxWidth: 60}} sm={1}><Avatar>{props.index + 1}</Avatar> </Col>
        <Col>
        <div>
        {
          !props.index?
          <Header >
          Open Ticket
          <Header.Subheader>Configure required information to open a ticket</Header.Subheader>
          </Header>
       :       
        <TextField
          required
          label="Stage Name"
          value={label}
          onKeyDown={(e)=> {if(e.keyCode ==13) props.newLine()}}
          onChange={e => setField({ q: e.target.value }) }
        />
        }
        </div>
        </Col>
      </Row>
        <Row style={{paddingTop: 10}}><Col>
        <span>Default Assignee:</span><br/>
        <Dropdown selection placeholder="Choose..." onChange={(e,val)=>setField({defaultAssignee: val.value})} value={defaultAssignee} options={[...AccountStore._getUsersSelectOptions(), {"text":"None", "value":""}]} /><br/>
        {props.index !==0 && <span style={{fontSize: "0.8em"}}>Choose "none" to let previous step assignee delegate</span>}
       
        </Col></Row>
        <Row>
        <div style={{paddingLeft: 10}}>
        <Accordion>
          <Accordion.Title onClick={()=>setField({_requireInfo: !_requireInfo})} active={_requireInfo}><Icon name='dropdown' /> Required information for this stage</Accordion.Title>
          <Accordion.Content active={_requireInfo}>
            <Container>
              <Form>
                {displayData()}
              </Form>
              
            </Container>
          </Accordion.Content>
        </Accordion>
        </div>
       
        </Row>
        <Row>
        <div style={{ marginLeft: "25px" }}>
          <Button size="mini" primary circular icon="plus" onClick={() => this.addItem()} />
        </div>
        </Row>
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

