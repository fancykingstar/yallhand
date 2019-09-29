import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Checkbox } from "semantic-ui-react";
import { TaskItem } from "./TaskItem";
import { ChooseTargeting } from "../SharedUI/ChooseTargeting";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton";
import {task} from "../DataExchange/PayloadBuilder";
import {createTask} from "../DataExchange/Up";
import {TaskStore} from "../Stores/TaskStore";
import moment from "moment";
import _ from "lodash";


@observer
class TaskNewEdit extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      taskItems: [this.reset()], 
      label: "",
    //   targetType: "all",
    //   targetsConfig: {} ,
    //   deadline: "",
      stage: "inactive",
      anonymous: false,
    }
  };

  reset () {
    return {
        _id: giveMeKey(),
        task_label: "",
        executed: false,
        updated: 0,
        valid: false,
    };
  };



  validate = () => {
    console.log(JSON.stringify(this.state))
    const {label, targetType, targetConfig, deadline, taskItems} = this.state;
  //   const review = {
  //     general: Boolean(label && taskItems.length && deadline),
  //     target: Boolean(targetType === "all"? true : _.isEmpty(targetConfig)? false: true),
  //     taskItems: Boolean(taskItems.filter(i => !i.valid).length === 0)
  //   }
  //   return Object.values(review).filter(i=>!i).length === 0
  }

  updateFields = (fieldObj, id) => {
    let questionList = [...this.state.taskItems]
    questionList[id] = {...questionList[id], ...fieldObj}
    this.setState({
        taskItems: questionList
    })
  }

  shiftRow = (direction, index) => {
    console.log(direction, index)
    let questionList = this.state.taskItems;
    const val = questionList[index];
    questionList.splice(index, 1);
    questionList.splice(direction==="up"? index - 1 : index + 2, 0, val);
    this.setState({taskItems: questionList})
  }

  removeRow = async (id) => {
    let questionList = await this.state.taskItems;
    questionList = questionList.filter(i=>i._id !== id);
    this.setState({taskItems: questionList})
  }

  checkMultiRow = () => {
    if(this.state.taskItems.length > 1) {
      return true
    }
    return false
  }

  displaytaskItems = () => {
    return this.state.taskItems.map((task, index) => {
      return <TaskItem
      multipleRows={this.checkMultiRow()} 
      info={task} 
      key={index} 
      index={index} 
      _id={task._id}
      updateFields={this.updateFields} 
      removeRow={this.removeRow} 
      shiftRow={this.shiftRow}
    //   checked={question.resRequired}
      add={this.addItem}
      />
    })
  }

  addItem = () => {

    this.setState({ taskItems: [...this.state.taskItems, this.reset()]});
  }

  SaveTask = () => {
    const {taskItems, label, targetType, anonymous, deadline} = this.state;
    createTask(task(taskItems, label, targetType, anonymous, deadline));
  }

//   componentDidMount(){
//     const {TaskStore} = this.props;
//     const id = this.props.match.params.id;
//     const loadTasks = this.props.match.params.id? TaskStore.allTasks.filter(i=>i.taskID === id)[0] : false;
//     if(loadTasks) this.setState(loadTasks);
//   }

  static getDerivedStateFromProps(props, state) { 
    const id = props.match.params.id;
    const loadTasks = props.match.params.id? TaskStore.allTasks.filter(i=>i.taskID === id)[0] : false;
    if(loadTasks) return(loadTasks);
    return null
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
      <Button onClick={e => this.SaveTask()}>
        Save
      </Button>
    );
    const archive = <Button>archive</Button>;
    const stop = <Button>Stop</Button>;
    const cancel = ( <Button> Cancel </Button> );
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
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          Tasks
          <Header.Subheader>
            Configure and send task lists to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <Form>
            <Form.Input
              label="Task List Title (Required)"
              value={this.state.label}
              onChange={(e, val) => this.setState({ label: val.value })}
            />
          </Form>
          <div style={{ paddingTop: "10px" }}>
            <ChooseTargeting label="Task List" echostate={val=>this.setState({targetsConfig:val})}/>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <span style={{ fontWeight: 800 }}>Deadline</span>
          </div>
          <div style={{ marginTop: "-5px" }}>
            <DateTimeSelect
              value={e => this.setState({ deadline: moment(e).valueOf() })}
              includeTime
              defaultValue={this.state.deadline}
            />
          </div>
          <div style={{margin: "5px 0 5px"}}>
          <span style={{fontWeight: 800}}>Anonymous Responses </span><br/>
          <Checkbox size toggle checked={this.state.anonymous} onChange={()=>this.setState({anonymous: !this.state.anonymous})}/>
          </div>
          <div>{actions[this.state.stage]}</div>
        </Segment>
        {this.displaytaskItems()}
        <div style={{ padding: "20px 0 20px" }}>
          <Button primary circular icon="plus" onClick={() => this.addItem()} />
        </div>
      </div>
    );
  }
}
export default withRouter(TaskNewEdit);