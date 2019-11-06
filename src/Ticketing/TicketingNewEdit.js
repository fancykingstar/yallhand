import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Checkbox, Dropdown, Divider } from "semantic-ui-react";
import { TicketingItem } from "./TicketingItem";
import { Col, Row} from "reactstrap";
import { ChooseTargeting } from "../SharedUI/ChooseTargeting";

import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton";
import {survey, surveyEdit, schedule} from "../DataExchange/PayloadBuilder";
import {createSurvey, modifySurvey, createSchedule, deleteSchedule} from "../DataExchange/Up";
import { ScheduleStore } from "../Stores/ScheduleStore";

import _ from "lodash";

@inject("TaskStore", "SurveyStore")
@observer
class TicketingNewEdit extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      ticketItems: [this.reset()], 
      label: "",
      chanID: "all",
      teamID: "",
      tags: "",
      type: "",
      active: "",
      icon: "",
      isTemplate: true,
      admins: [],
      collaborators: [],
      config: {
        simpleDesc: false, 
        notifyAdminNewTicket: false,
        deleteTicket: false,
        updateOpener: false
      }
    }
  };

  reset () {
    return this.props.mode === "survey"? 
    ({
        id: giveMeKey(),
        defaultAssignee: "",
        _requireInfo: false,
        requiredInfo: [
          {
            type: "text",
            label: "",
            selectionOptions: []
          }
        ]
    })
    :
    ({
        _id: giveMeKey(),
        q: "",
        resRequired: true,
    })

  };

  updateState(obj) {
    this.setState(obj);
  }


  validate = () => {
    const {label, targetType, targetConfig, deadline, surveyItems, instances} = this.state;
    const review = {
      general: Boolean(label && surveyItems.length),
      prevLaunch: Boolean(!instances.length)
    }
    return Object.values(review).filter(i=>!i).length === 0
  }

  updateFields = (fieldObj, id) => {
    let questionList = [...this.state.ticketItems]
    questionList[id] = {...questionList[id], ...fieldObj}
    this.setState({
        surveyItems: questionList
    })
  }

  shiftRow = (direction, index) => {
    let questionList = this.state.ticketItems;
    const val = questionList[index];
    questionList.splice(index, 1);
    questionList.splice(direction==="up"? index - 1 : index + 2, 0, val);
    this.setState({surveyItems: questionList})
  }

  removeRow = async (id) => {
    let questionList = await this.state.ticketItems;
    questionList = questionList.filter(i=>i._id !== id);
    this.setState({surveyItems: questionList})
  }

  checkMultiRow = () => {
    if(this.state.ticketItems.length > 1) {
      return true
    }
    return false
  }

  displayTicketItems = () => {
    return this.state.ticketItems.map((question, index) => {
        return <TicketingItem
        multipleRows={this.checkMultiRow()} 
        info={question} 
        key={index} 
        index={index} 
        _id={question._id}
        updateFields={this.updateFields} 
        removeRow={this.removeRow} 
        shiftRow={this.shiftRow}
        checked={question.resRequired}
        add={this.addItem}
        newLine={() => {if(index + 1 === this.state.ticketItems.length) this.addItem()}}
        />
      })
  } 
 
  addItem = () => {
    this.setState({ ticketItems: [...this.state.ticketItems, this.reset()]});
  }

  updateSurvey = async (active=null) => {
    if (active !== null) await this.setState({active});
    if (active === false) modifySurvey({surveyID: this.state.surveyID, updated: Date.now(), active: false, type: this.props.mode});
    else if (this.state.surveyID) await modifySurvey(surveyEdit(this.props.mode,this.state));
    else {
     await createSurvey(survey(this.props.mode,this.state)).then(res => res.json()).then(res => this.setState({surveyID: res.surveyID}))
    }
    if (active !== null) {
      if(active && this.state.deadline) createSchedule(schedule(this.state.deadline,`end ${this.props.mode}`,{id: this.state.surveyID}), false);
      else if(!active && this.state.deadline) deleteSchedule(ScheduleStore.allScheduled.filter(sch => sch.data.id === this.state.surveyID && !sch.executed)[0].scheduleID);
    }

  }

  componentDidMount(active=null){
    const {TaskStore, SurveyStore} = this.props;
    const id = this.props.match.params.id;
    const source = this.props.mode === "survey"? SurveyStore.allSurveys : TaskStore.allTasks;
    const loadSurvey = this.props.match.params.id? source.filter(i=>i.surveyID === id)[0] : false;
    if(loadSurvey) {
      if(loadSurvey.surveyItems.length) {
        loadSurvey.surveyItems.forEach(i=> Object.keys(i).forEach(key=> {if(key[0]==="_") delete i[key]} ))
      }
      this.setState(loadSurvey)
    };
  }

  render() {
    const launch = ( <Button onClick={e => this.updateSurvey(true)} disabled={ !this.validate() } primary > Launch </Button> );
    const save = ( <Button onClick={e => this.updateSurvey()}> Save </Button> );
    const stop = <Button negative onClick={()=> this.updateSurvey(false)}>Stop</Button>;
    const cancel = ( <Button onClick={e => this.props.history.push('/panel/surveys')} > Cancel </Button> );
    const preview = ( <Button onClick={e => {}} > Preview </Button> );
    const actions = this.state.active? ( <div style={{paddingTop: 5}}> {save} {stop} {preview}</div> ) : ( <div style={{paddingTop: 5}}> {launch} {save} {cancel} {preview}</div> ); 

    return (
      <div> 
        <BackButton/>
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          Build Service Ticket Template
          <Header.Subheader>
            Configure and send tickets to your employees
          </Header.Subheader>
        </Header>
        <Row style={{paddingTop: 10}}>
          <Col>
          <Segment>
          <Header style={{paddingBottom: 15}} as="h4">General Settings</Header>
          <Form>
            <Form.Input
              label="Title (Required)"
              value={this.state.label}
              onChange={(e, val) => this.updateState({ label: val.value })}
            />
          </Form>
              {!this.state.active &&
              <>
   
   
                <div style={{paddingTop: 5, paddingBottom: 10}}> <ChooseTargeting label="Access" output={val=>this.updateState(val)} input={this.state}/> </div>
             
                <Form style={{maxWidth: 400}}>
                  <Form.Dropdown label="Ticketing Type" style={{minWidth: 370}} selection defaultValue="simple" options={[{"text":"Simple", "value":"simple", "description":"basic open/close ticketing"},{"text":"Enhanced", "value":"enhanced", "description":"multistep or customized ticketing"}]} />
                    <Form.Checkbox label="Include a 'description' field for user to enter additional text"/>
                    <Form.Dropdown selection label="Channel"/>
                    <Form.Dropdown selection label="Choose Icon"/>
                  </Form>



              </>
              }
    
        </Segment>
          </Col>
          <Col>
          <Segment style={{margin: 10}} style={{backgroundColor: "#e9e9e9"}}>
          <Header style={{paddingBottom: 15}} as="h4">Access</Header>
                  <Form>
                <Form.Dropdown label="Select admin(s)"  selection />
                <p style={{padding: "0px", marginTop: "-15px"}}><span style={{fontSize: "0.7em"}}>Admins can edit all tickets and collaborators under this template</span></p>

                <Form.Dropdown label="Select collaborator(s)"  selection />
                <p style={{padding: "0px", marginTop: "-15px"}}><span style={{fontSize: "0.7em"}}>Collaborators can edit and view history of tickets that have been assigned to them</span></p>

                <Form.Field>
                      <Checkbox label="Email admin(s) when a new ticket is opened"/>
                    </Form.Field>
                    <Form.Field>
                      <Checkbox label="Allow admin(s) to delete tickets"/>
                    </Form.Field>
                    
                  <Form.Field>
                      <Checkbox label="Keep user who opens ticket updated of status"/>
                    </Form.Field>
               
                  </Form>
                </Segment>
          </Col>
        </Row>

        <Segment placeholder>
        <Header >
    Simple Ticket
    <Header.Subheader>User information will automatically be passed along when this ticket is opened</Header.Subheader>
    </Header>
        </Segment>

 




       


        {this.displayTicketItems()}
        <div style={{ padding: "20px 0 20px" }}>
          <Button primary circular icon="plus" onClick={() => this.addItem()} />
        </div>
        {actions}
      </div>
    );
  }
}
export default withRouter(TicketingNewEdit);