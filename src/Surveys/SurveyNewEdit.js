import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Checkbox } from "semantic-ui-react";
import { SurveyItem } from "./SurveyItem";
import { ChooseTargeting } from "../SharedUI/ChooseTargeting";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton";
import {survey} from "../DataExchange/PayloadBuilder";
import {createSurvey} from "../DataExchange/Up";
import _ from "lodash";

@inject("SurveyStore")
@observer
class SurveyNewEdit extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      surveyItems: [this.reset()], 
      label: "",
      targetType: "all",
      targetsConfig: {} ,
      deadline: "",
      stage: "inactive",
      anonymous: false,
    }
  };

  reset () {
    return {
        _id: giveMeKey(),
        q: "",
        resType: "scale",
        resRequired: false,
        multiConfig: "custom", 
        scaleConfig: "star",
        resChoices: [],
        scaleLabels_lo: "Least Favorable",
        scaleLabels_hi: "Most Favorable",
        valid: false
    };
  };

  validate = () => {
    console.log(JSON.stringify(this.state))
    const {label, targetType, targetConfig, deadline, surveyItems} = this.state;
    const review = {
      general: Boolean(label && surveyItems.length && deadline),
      target: Boolean(targetType === "all"? true : _.isEmpty(targetConfig)? false: true),
      surveyitems: Boolean(surveyItems.filter(i => !i.valid).length === 0)
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
    console.log(direction, index)
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
    return this.state.surveyItems.map((question, index) => {
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
  }

  addItem = () => {
    console.log(this.state.surveyItems);
    this.setState({ surveyItems: [...this.state.surveyItems, this.reset()]});
    console.log(this.state.surveyItems);
  }

  saveSurvey = () => {
    const {surveyItems, label, targetType, anonymous} = this.state;
    createSurvey(survey(surveyItems, label, targetType, anonymous));
  }

  componentDidMount(){
    const {SurveyStore} = this.props;
    const id = this.props.match.params.id;
    const loadSurvey = this.props.match.params.id? SurveyStore.allSurveys.filter(i=>i.surveyID === id)[0] : false;
    console.log("id", id, "survey", SurveyStore.allSurveys)
    if(loadSurvey) this.setState(loadSurvey);
  }
  

  render() {
    const launch = (
      <Button
        disabled={
         !this.validate()
        }
        primary
      >
        Launch
      </Button>
    );
    const save = (
      <Button onClick={e => this.saveSurvey()}>
        Save
      </Button>
    );
    const archive = <Button>archive</Button>;
    const stop = <Button>Stop</Button>;
    const cancel = (
      <Button
        onClick={e => this.setState({ items: this.state.items.reverse() })}
      >
        Cancel
      </Button>
    );
    const actions = {
      inactive: (
        <React.Fragment>
          {launch}
          {save}
          {cancel}
        </React.Fragment>
      ),
      active: (
        <React.Fragment>
          {save}
          {stop}
          {archive}
        </React.Fragment>
      )
    };



    return (
      <div>
        <BackButton/>
        {/* {JSON.stringify(this.state.surveyItems)} */}
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          Survey builder
          <Header.Subheader>
            Configure and send surveys to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <Form>
            <Form.Input
              label="Survey Title (Required)"
              value={this.state.label}
              onChange={(e, val) => this.setState({ label: val.value })}
            />
          </Form>
          <div style={{ paddingTop: "10px" }}>
            <ChooseTargeting label="Survey" echostate={val=>this.setState({targetsConfig:val})}/>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <span style={{ fontWeight: 800 }}>Deadline</span>
          </div>
          <div style={{ marginTop: "-5px" }}>
            <DateTimeSelect
              value={e => this.setState({ deadline: e })}
              includeTime
            />
          </div>
          <div style={{margin: "5px 0 5px"}}>
          <span style={{fontWeight: 800}}>Anonymous Responses </span><br/>
          <Checkbox size toggle checked={this.state.anonymous} onChange={()=>this.setState({anonymous: !this.state.anonymous})}/>
          </div>
          <div>{actions[this.state.stage]}</div>
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