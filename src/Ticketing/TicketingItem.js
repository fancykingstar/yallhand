import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Icon, Accordion, Dropdown, Button, Label, Header, Form } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";


export const TicketingItem = inject("DataEntryStore")(observer((props) => {
  const { id, _requireInfo, data, label, defaultAssignee} = props;

  const setField = (obj) => {
    // const isValid = 
    // Object.values({
    //   q: Boolean(q.trim().length !== 0),
    // }).filter(i => !i).length === 0;
    // const obj = Object.assign(content, {valid: isValid})
    props.updateFields(obj, props.index) 
  } 

  const removeRow = () => {
    props.removeRow(_id)
  }

  const shiftRow = (direction) => {
    props.shiftRow(direction, props.index)
  }

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
        <Dropdown selection value={defaultAssignee} options={[{text: "Marc T", value:0},{text: "none", value:1}]} /><br/>
        {props.index !==0 && <span style={{fontSize: "0.8em"}}>Choose "none" to let previous step assignee delegate</span>}
       
        </Col></Row>
        <Row>
        <div style={{paddingLeft: 10}}>
          {String(_requireInfo)}
        <Accordion>
          <Accordion.Title active={_requireInfo}><Icon onClick={()=>setField({_requireInfo: !_requireInfo})} name='dropdown' /> Required information for this stage</Accordion.Title>
          <Accordion.Content active={_requireInfo}>
            <Container>
              <Form>
                <Form.Group>
                  <Form.Dropdown selection label="Type" options={[{text: "Text", value: "Text"}, {text:"Select", value: "select"},{text: "MultiSelect", value: "multi"}]}/>
                  <Form.Input label="Label" ><input maxLength="48" /></Form.Input>
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
                </Form.Group>
              </Form>
              
                {/* <Row>
                    <Col md={2}>
                        <span>Type:</span><br/>
                        <Dropdown selection defaultValue={"Text"} options={[{text: "Text", value: "Text"}]} />
                    </Col>
                    <Col md={2}>
                    <span>Label:</span><br/>
                        <Input placeholder="Enter Label" />
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <span>Type:</span><br/>
                        <Dropdown selection defaultValue={"Text"} options={[{text: "Selection", value: "Text"}]} />
                    </Col>
                    <Col md={2}>
                    <span>Label:</span><br/>
                        <Input placeholder="Enter Label" />
                    </Col>
                    <Col md={4}>
                    <span>Options:</span><br/>
                    <Input action='Add' placeholder='Search...' />
                    <div>
                    <Label size="mini">Windows</Label>
                    <Label size="mini">Monitor</Label>
                    <Label size="mini">Outlook/Mail</Label>
                    <Label size="mini">Hardware</Label>
                    <Label size="mini">Other</Label>
                    </div>
                    
               
                   
                    </Col>
                  
                
                  
                  
                </Row> */}
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

