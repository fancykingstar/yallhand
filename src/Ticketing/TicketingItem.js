import React from "react";
import {inject, observer} from "mobx-react";
import { Segment, Icon, Accordion, Dropdown, Input, Label } from "semantic-ui-react";
import { Container, Row, Col } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";


export const TicketingItem = inject("DataEntryStore")(observer((props) => {
  const { q, _id} = props.info;

  const setField = (content) => {
    const isValid = 
    Object.values({
      q: Boolean(q.trim().length !== 0),
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
          label="Stage Name"
          placeholder=""
          value={q}
          onKeyDown={(e)=> {if(e.keyCode ==13) props.newLine()}}
          onChange={e => setField({ q: e.target.value }) }
          margin="normal"
        />
    
        <br /> <br />
        <Row><Col>
        <span>Default Assignee:</span><br/>
        <Dropdown selection defaultValue={0} options={[{text: "Marc T", value:0},{text: "none", value:1}]} /><br/>
        {props.index !==0 && <span style={{fontSize: "0.8em"}}>Choose "none" to let previous step assignee delegate</span>}
       
        </Col></Row>
        <br />
        <Accordion>
          <Accordion.Title active={props.index === 0}><Icon name='dropdown' /> Acquire Information</Accordion.Title>
          <Accordion.Content active={props.index === 0}>
            <Container>
                <Row>
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
                  
                
                  
                  
                </Row>
            </Container>
          </Accordion.Content>
        </Accordion>
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

