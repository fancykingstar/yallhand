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

import {iconKey, iconOptions} from "./IconSelect";



import _ from "lodash";

@inject("TaskStore", "SurveyStore", "ChannelStore", "AccountStore")
@observer
class TicketingNewEdit extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      ticketItems: [this.reset()], 
      label: "",
      chanID: "All",
      teamID: "",
      tags: "",
      type: "simple",
      active: "",
      icon: "",
      isTemplate: true,
      sendTargetType: "all",
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
    return {
      id: giveMeKey(),
      defaultAssignee: "",
      data: [], //{type: "", label: "", options: []}
      _requireInfo: false
    }
  };

  updateState(obj) {
    this.setState(obj);
  }


  validate = () => {
    const {label, targetType, targetConfig, deadline, surveyItems, instances} = this.state;
    const review = {
      general: Boolean(label && surveyItems.length),
      // prevLaunch: Boolean(!instances.length)
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
    return this.state.ticketItems.map((stage, index) => {
        return <TicketingItem
        multipleRows={this.checkMultiRow()} 
        label={stage.label} 
        key={index} 
        index={index} 
        id={stage.id}
        defaultAssignee={stage.defaultAssignee}
        _requireInfo={stage._requireInfo}
        data={stage.data}
        updateFields={this.updateFields} 
        removeRow={this.removeRow} 
        shiftRow={this.shiftRow}
       
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
    const {ChannelStore, AccountStore} = this.props;

    const launch = ( <Button onClick={e => this.updateSurvey(true)} disabled={ !this.validate() } primary > Launch </Button> );
    const save = ( <Button onClick={e => this.updateSurvey()}> Save </Button> );
    const stop = <Button negative onClick={()=> this.updateSurvey(false)}>Stop</Button>;
    const cancel = ( <Button onClick={e => this.props.history.push('/panel/surveys')} > Cancel </Button> );
    const preview = ( <Button onClick={e => {}} > Preview </Button> );
    const actions = this.state.active? ( <div style={{paddingTop: 5}}> {save} {stop} {preview}</div> ) : ( <div style={{paddingTop: 5}}> {launch} {save} {cancel} {preview}</div> ); 


   

    const {type, active, chanID, label, admins, collaborators} = this.state;
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
              placeholder="e.g. Open service request"
              value={label}
              onChange={(e, val) => this.updateState({ label: val.value })}
            />
          </Form>
              {!active &&
              <>
   
   
                <div style={{paddingTop: 5, paddingBottom: 10}}> <ChooseTargeting label="Access" output={val=>this.updateState(val)} input={this.state}/> </div>
             
                <Form style={{maxWidth: 400}}>
                  <Form.Dropdown value={type} onChange={(e,val)=>this.updateState({type: val.value})} label="Ticketing Type" style={{minWidth: 370}} selection defaultValue="simple" options={[{"text":"Simple", "value":"simple", "description":"basic open/close ticketing"},{"text":"Enhanced", "value":"enhanced", "description":"multistep or customized ticketing"}]} />
                    {type === "simple" && <Form.Checkbox label="Include a 'description' field for user to enter additional text"/>}
                    <Form.Dropdown value={chanID} onChange={(e,val)=>this.updateState({chanID: val.value})} options={ChannelStore._channelSelect} selection label="Channel"/>
                    <Form.Dropdown label="Button Icon" placeholder="Choose icon..." onChange={(e, val)=>this.updateState({icon: val.value})} icon={iconKey[this.state.icon]} selection options={iconOptions}>
                  
                    </Form.Dropdown>
                  </Form>



              </>
              }
    
        </Segment>
          </Col>
          <Col>
          <Segment className="TicketingAccess" style={{margin: 10}} style={{backgroundColor: "#e9e9e9"}}>
          <Header style={{paddingBottom: 15}} as="h4">Access</Header>
                  <Form>
                <Form.Dropdown onChange={(e, val)=>this.updateState({admins: val.value})} value={admins} options={AccountStore._getUsersSelectOptions()} label="Select admin(s)"  fluid multiple selection placeholder="Select user(s)..." />
                <p style={{padding: "0px", marginTop: "-15px"}}><span style={{fontSize: "0.7em"}}>Admins can edit all tickets and collaborators under this template</span></p>

                <Form.Dropdown label="Select collaborator(s)" admin={collaborators} onChange={(e, val)=>this.updateState({collaborators: val.value})} options={AccountStore._getUsersSelectOptions()}  fluid multiple selection placeholder="Select user(s)..." />
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
        
        {
          type === "simple"?
        <Segment placeholder>
        <Header >
    Simple Ticket
    <Header.Subheader>User information will automatically be passed along when this ticket is opened</Header.Subheader>
    </Header>
        </Segment>
        : 
        <>
        {this.displayTicketItems()}
        <div style={{ padding: "20px 0 20px" }}>
          <Button primary circular icon="plus" onClick={() => this.addItem()} />
        </div>
        </>
        }

  
        {actions}
      </div>
    );
  }
}
export default withRouter(TicketingNewEdit);