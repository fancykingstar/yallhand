import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Checkbox, Dropdown, Divider } from "semantic-ui-react";
import { TicketingItem } from "./TicketingItem";
import { Col, Row} from "reactstrap";
import { ChooseTargeting } from "../SharedUI/ChooseTargeting";

import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton";
import {ticket, surveyEdit, schedule} from "../DataExchange/PayloadBuilder";
import {createTicket, modifySurvey, createSchedule, deleteSchedule} from "../DataExchange/Up";
import { ScheduleStore } from "../Stores/ScheduleStore";

import {iconKey, iconOptions} from "./IconSelect";



import _ from "lodash";

@inject("TicketingStore", "ChannelStore", "AccountStore")
@observer
class TicketingNewEdit extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      ticketItems: [this.reset()], 
      label: "",
      chanID: "All",
      teamID: "",
      tags: [],
      type: "simple",
      active: false,
      icon: "",
      isTemplate: true,
      sendTargetType: "all",
      sendToTagID: "",
      sendToTeamID: "",
      sendToUsers: [],
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
      data: [{type: "text", label: "", options: []}], //{type: "", label: "", options: []}
      _requireInfo: false
    }
  };

  updateState(obj) {
    if(Object.keys(obj).includes('config')) this.setState({config: Object.assign(this.state.config, obj.config)});
    else this.setState(obj);
  }


  validate = () => {
    return true
    const {label, targetType, targetConfig, deadline, surveyItems, instances} = this.state;
    // const review = {
    //   general: Boolean(label && surveyItems.length),
      // prevLaunch: Boolean(!instances.length)
    // }
    // return Object.values(review).filter(i=>!i).length === 0
  }

  updateFields = (fieldObj, i) => {
    let ticketList = this.state.ticketItems;
    let newData = Object.assign(ticketList[i], fieldObj)
    ticketList.splice(i, 1, newData)
    this.setState({
        ticketItems: ticketList
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
        key={"ticketItemDisplay"+ index} 
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

  updateTicket = async (active=null) => {
    // await this.setState({active});
    // if (active !== null) await this.setState({active});
    // if (active === false) modifySurvey({surveyID: this.state.surveyID, updated: Date.now(), active: false, type: this.props.mode});
    // else if (this.state.surveyID) await modifySurvey(surveyEdit(this.props.mode,this.state));
    // else {
     await createTicket(ticket(this.state)).then(res => res.json()).then(res => this.setState({surveyID: res.surveyID}))
    // }
    // if (active !== null) {
    //   if(active && this.state.deadline) createSchedule(schedule(this.state.deadline,`end ${this.props.mode}`,{id: this.state.surveyID}), false);
    //   else if(!active && this.state.deadline) deleteSchedule(ScheduleStore.allScheduled.filter(sch => sch.data.id === this.state.surveyID && !sch.executed)[0].scheduleID);
    // }

  }

  componentDidMount(active=null){
    const {TaskStore, TicketingStore} = this.props;
    const id = this.props.match.params.id;
    const loadTicket = this.props.match.params.id? TicketingStore.allTickets.filter(i=>i.ticketID === id)[0] : false;
    if(loadTicket) {
      // if(loadTicket.surveyItems.length) {
      //   loadSurvey.surveyItems.forEach(i=> Object.keys(i).forEach(key=> {if(key[0]==="_") delete i[key]} ))
      // }
      this.setState(loadTicket)
    };
  }

  render() {
    const {ChannelStore, AccountStore} = this.props;

    const launch = ( <Button onClick={e => this.updateTicket(true)} disabled={ !this.validate() } primary > Launch </Button> );
    const save = ( <Button onClick={e => this.updateTicket()}> Save </Button> );
    const stop = <Button negative onClick={()=> this.updateTicket(false)}>Stop</Button>;
    const cancel = ( <Button onClick={e => this.props.history.push('/panel/surveys')} > Cancel </Button> );
    const preview = ( <Button onClick={e => {}} > Preview </Button> );
    const actions = this.state.active? ( <div style={{paddingTop: 5}}> {save} {stop} {preview}</div> ) : ( <div style={{paddingTop: 5}}> {launch} {save} {cancel} {preview}</div> ); 


   

    const {type, active, chanID, label, admins, icon, collaborators} = this.state;
    return (
      <div> 
        <BackButton/>
        {JSON.stringify(this.state)}
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          Build Service Ticket Template
          <Header.Subheader>
            Configure and send tickets to your employees
          </Header.Subheader>
        </Header>
        <Row>
          <Col style={{marginTop: 10}} xl={6}>
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
                  <Form.Dropdown value={type} onChange={(e,val)=>this.updateState({type: val.value})} label="Ticketing Type" style={{minWidth: 370}} selection options={[{"text":"Simple", "value":"simple", "description":"basic open/close ticketing"},{"text":"Enhanced", "value":"enhanced", "description":"multistep or customized ticketing"}]} />
                    <Form.Dropdown value={chanID} onChange={(e,val)=>this.updateState({chanID: val.value})} options={ChannelStore._channelSelect} selection label="Channel"/>
                    <Form.Dropdown value={icon} label="Button Icon" placeholder="Choose icon..." onChange={(e, val)=>this.updateState({icon: val.value})} icon={iconKey[this.state.icon]} selection options={iconOptions}>
                  
                    </Form.Dropdown>
                  </Form>



              </>
              }
    
        </Segment>
          </Col>
          <Col style={{marginTop: 10}}  xl={6}>
          <Segment className="TicketingAccess" style={{margin: 10}} style={{backgroundColor: "#e9e9e9"}}>
          <Header style={{paddingBottom: 15}} as="h4">Access</Header>
                  <Form>
                <Form.Dropdown onChange={(e, val)=>this.updateState({admins: val.value})} value={admins} options={AccountStore._getUsersSelectOptions()} label="Select admin(s)"  fluid multiple selection placeholder="Select user(s)..." />
                <p style={{padding: "0px", marginTop: "-15px"}}><span style={{fontSize: "0.7em"}}>Admins can edit all tickets and collaborators under this template</span></p>

                <Form.Dropdown label="Select collaborator(s)" admin={collaborators} onChange={(e, val)=>this.updateState({collaborators: val.value})} options={AccountStore._getUsersSelectOptions()}  fluid multiple selection placeholder="Select user(s)..." />
                <p style={{padding: "0px", marginTop: "-15px"}}><span style={{fontSize: "0.7em"}}>Collaborators can edit and view history of tickets that have been assigned to them</span></p>
       
                <Form.Field>
                      <Checkbox checked={this.state.config.notifyAdminNewTicket} onChange={(e,val)=> this.updateState({config: {notifyAdminNewTicket: val.checked}})} label="Email admin(s) when a new ticket is opened"/>
                    </Form.Field>
                    <Form.Field>
                      <Checkbox checked={this.state.config.deleteTicket} onChange={(e,val)=> this.updateState({config: {deleteTicket: val.checked}})}  label="Allow admin(s) to delete tickets"/>
                    </Form.Field>
                    
                  <Form.Field>
                      <Checkbox checked={this.state.config.updateOpener} onChange={(e,val)=> this.updateState({config: {updateOpener: val.checked}})} label="Keep user who opens ticket updated of status"/>
                    </Form.Field>
               
                  </Form>
                </Segment>
          </Col>
        </Row>
        
        {
          type === "simple"?
        <Segment>
        <Header >
    Simple Ticket
    <Header.Subheader>User information will automatically be passed along when this ticket is opened</Header.Subheader>
    </Header>
    <Form.Checkbox checked={this.state.config.simpleDesc} onChange={(e,val)=> this.updateState({config: {simpleDesc: val.checked}})} label="Include a 'description' field for user to enter additional text"/>
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