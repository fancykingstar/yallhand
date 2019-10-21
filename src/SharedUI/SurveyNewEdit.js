import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Checkbox } from "semantic-ui-react";
import { TaskItem } from "../Tasks/TaskItem";
import { SurveyItem }from "../Surveys/SurveyItem";
import { ChooseTargeting } from "../SharedUI/ChooseTargeting";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton";
import {survey, surveyEdit, schedule} from "../DataExchange/PayloadBuilder";
import {createSurvey, modifySurvey, createSchedule, deleteSchedule} from "../DataExchange/Up";
import { ScheduleStore } from "../Stores/ScheduleStore";

import moment from "moment";
import _ from "lodash";

@inject("TaskStore", "SurveyStore")
@observer
class SurveyNewEdit extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      surveyItems: [this.reset()], 
      label: "",
      instances: [],
      targetType: "all",
      deadline: 0,
      active: false,
      anonymous: false,
      sendToTeamID: "", sendToTagID: "", selectedUser: "", sendTargetType: "all", sendToUsers: []
    }
  };

  reset () {
    return this.props.mode === "survey"? 
    ({
        _id: giveMeKey(),
        q: "",
        resType: "scale",
        resRequired: false,
        multiConfig: "custom", 
        scaleConfig: "star",
        resChoices: [],
        scaleLabels_lo: "Least Favorable",
        scaleLabels_hi: "Most Favorable",
        valid: false,
    })
    :
    ({
        _id: giveMeKey(),
        q: "",
        resRequired: true,
    })

  };



  validate = () => {
    const {label, targetType, targetConfig, deadline, surveyItems, instances} = this.state;
    console.log("instances", instances)
    const review = {
      general: Boolean(label && surveyItems.length),
      prevLaunch: Boolean(!instances.length)
      // surveyitems: Boolean(surveyItems.filter(i => !i.valid).length === 0)
    }
    return Object.values(review).filter(i=>!i).length === 0
  }

  updateFields = (fieldObj, id) => {
    let questionList = [...this.state.surveyItems]
    questionList[id] = {...questionList[id], ...fieldObj}
    this.setState({
        surveyItems: questionList
    })
  }

  shiftRow = (direction, index) => {
    let questionList = this.state.surveyItems;
    const val = questionList[index];
    questionList.splice(index, 1);
    questionList.splice(direction==="up"? index - 1 : index + 2, 0, val);
    this.setState({surveyItems: questionList})
  }

  removeRow = async (id) => {
    let questionList = await this.state.surveyItems;
    questionList = questionList.filter(i=>i._id !== id);
    this.setState({surveyItems: questionList})
  }

  checkMultiRow = () => {
    if(this.state.surveyItems.length > 1) {
      return true
    }
    return false
  }

  displaySurveyItems = () => {
    return this.props.mode === "survey"?
        this.state.surveyItems.map((question, index) => {
            return <SurveyItem
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
        />
        })
    :
    this.state.surveyItems.map((question, index) => {
        return <TaskItem
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
        newLine={() => {if(index + 1 === this.state.surveyItems.length) this.addItem()}}
        />
      })
  } 
 
  addItem = () => {
    this.setState({ surveyItems: [...this.state.surveyItems, this.reset()]});
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
    const actions = this.state.active? ( <div style={{paddingTop: 5}}> {save} {stop} </div> ) : ( <div style={{paddingTop: 5}}> {launch} {save} {cancel} </div> ); 
    return (
      <div> 
        <BackButton/>
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          {this.props.mode==="survey"? "Survey builder" :"Task builder"}
          <Header.Subheader>
            Configure and send {this.props.mode==="survey"? "surveys":"task lists"} to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <Form>
            <Form.Input
              label="Title (Required)"
              value={this.state.label}
              onChange={(e, val) => this.setState({ label: val.value })}
            />
          </Form>
              {!this.state.active &&
              <>
              <div style={{ paddingTop: "10px" }}>
                <ChooseTargeting label="Survey" output={val=>this.setState(val)} input={this.state}/>
              </div>
              <div style={{ paddingTop: "10px" }}>
                <span style={{ fontWeight: 800 }}>Deadline</span>
              </div>
              <div style={{ marginTop: "-5px" }}>
                <DateTimeSelect
                  value={e => this.setState({ deadline: moment(e).valueOf() })}
                  includeTime
                  defaultValue={this.state.deadline? this.state.deadline : ""}
                />
              </div>
              <div style={{margin: "5px 0 5px"}}>
              <span style={{fontWeight: 800}}>Anonymous Responses </span><br/>
              <Checkbox toggle checked={this.state.anonymous} onChange={()=>this.setState({anonymous: !this.state.anonymous})}/>
              </div>
              </>
              }
          <div>{actions}</div>
        </Segment>
        {this.displaySurveyItems()}
        <div style={{ padding: "20px 0 20px" }}>
          <Button primary circular icon="plus" onClick={() => this.addItem()} />
        </div>
      </div>
    );
  }
}
export default withRouter(SurveyNewEdit);