/* eslint-disable react/no-array-index-key */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Segment, Button, Form, Header, Checkbox, Modal } from 'semantic-ui-react';
import moment from 'moment';
import { TaskItem } from '../Tasks/TaskItem';
import { SurveyItem } from '../Surveys/SurveyItem';
import PollItem from '../Surveys/PollItem';
import ChooseTargeting from './ChooseTargeting';
import DateTimeSelect from './DateTimeSelect';
import { giveMeKey } from '../SharedCalculations/GiveMeKey';
import BackButton from './BackButton';
import { survey, surveyEdit, schedule } from '../DataExchange/PayloadBuilder';
import { createSurvey, modifySurvey, createSchedule, deleteSchedule } from '../DataExchange/Up';
import { ScheduleStore } from '../Stores/ScheduleStore';
import { TeamStore } from '../Stores/TeamStore';

import { Survey } from '../UserPortal/views/components/Survey';
import { Task } from '../UserPortal/views/components/Task';

@inject('TaskStore', 'SurveyStore', 'PollStore')
@observer
class SurveyNewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyItems: [this.reset()],
      label: '',
      instances: [],
      targetType: 'all',
      deadline: 0,
      active: false,
      anonymous: false,
      openPreview: false,
      sendToTeamID: '',
      sendToTagID: '',
      selectedUser: '',
      sendTargetType: 'all',
      sendToUsers: [],
    };
  }

  componentDidMount() {
    const { TaskStore, SurveyStore, PollStore, match, mode } = this.props;
    const { id } = match.params;
    let source = null;
    if (mode === 'survey') {
      source = SurveyStore.allSurveys;
    } else if (mode === 'task') {
      source = TaskStore.allTasks;
    } else {
      source = PollStore.allPolls;
    }

    const loadSurvey = match.params.id ? source.filter(i => i.surveyID === id)[0] : false;
    if (loadSurvey) {
      if (loadSurvey.surveyItems.length) {
        loadSurvey.surveyItems.forEach(item =>
          Object.keys(item).forEach(key => {
            if (key[0] === '_') delete item[key];
          }),
        );
      }
      this.setState(loadSurvey);
    }

    // Set anonymous true as a default value when mode is poll
    if (mode === 'poll') {
      this.setState({
        anonymous: true
      });
    }
  }

  reset = () => {
    const { mode } = this.props;
    if (mode === 'survey') {
      return {
        _id: giveMeKey(),
        q: '',
        resType: 'scale',
        resRequired: false,
        multiConfig: 'custom',
        scaleConfig: 'star',
        resChoices: [],
        scaleLabels_lo: 'Least Favorable',
        scaleLabels_hi: 'Most Favorable',
        valid: false,
      };
    }
    if (mode === 'task') {
      return {
        _id: giveMeKey(),
        q: '',
        resRequired: true,
      };
    }
    return {
      _id: giveMeKey(),
      q: '',
      resRequired: true,
      multiConfig: 'custom',
      resChoices: [],
    };
  };

  validate = () => {
    const { label, deadline, surveyItems } = this.state;
    const review = {
      general: Boolean(label && surveyItems.length),
    };
    return Object.values(review).filter(i => !i).length === 0 && deadline !== 0;
  };

  updateFields = (fieldObj, id) => {
    const { surveyItems } = this.state;
    const questionList = [...surveyItems];
    questionList[id] = { ...questionList[id], ...fieldObj };
    this.setState({
      surveyItems: questionList,
    });
  };

  shiftRow = (direction, index) => {
    const { surveyItems } = this.state;
    const questionList = surveyItems;
    const val = questionList[index];
    questionList.splice(index, 1);
    questionList.splice(direction === 'up' ? index - 1 : index + 2, 0, val);
    this.setState({ surveyItems: questionList });
  };

  removeRow = async id => {
    const { surveyItems } = this.state;
    let questionList = await surveyItems;
    questionList = questionList.filter(i => i._id !== id);
    this.setState({ surveyItems: questionList });
  };

  checkMultiRow = () => {
    const { surveyItems } = this.state;
    if (surveyItems.length > 1) {
      return true;
    }
    return false;
  };

  displaySurveyItems = () => {
    const { mode } = this.props;
    const { surveyItems } = this.state;
    if (mode === 'survey') {
      return surveyItems.map((question, index) => (
        <SurveyItem
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
      ));
    }
    if (mode === 'task') {
      return surveyItems.map((question, index) => (
        <TaskItem
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
          newLine={() => {
            if (index + 1 === surveyItems.length) this.addItem();
          }}
        />
      ));
    }
    return surveyItems.map((question, index) => (
      <PollItem
        multipleRows={this.checkMultiRow()}
        info={question}
        key={index}
        index={index} //
        _id={question._id}
        updateFields={this.updateFields} //
        removeRow={this.removeRow} //
        shiftRow={this.shiftRow} //
      />
    ));
  };

  addItem = () => {
    const { surveyItems } = this.state;
    this.setState({ surveyItems: [...surveyItems, this.reset()] });
  };

  updateSurvey = async (active = null) => {
    const { mode, history } = this.props;
    const { responses_by_instance, instances, surveyID, deadline } = this.state;

    if (active !== null) await this.setState({ active });

    if (active === false) {
      const newResponses = responses_by_instance.slice();
      instances.forEach(instance => {
        const found = newResponses.filter(res => res.instanceID === instance.instanceID);
        if (found.length) {
          newResponses.push(Object.assign(found[0], { completed: true }));
        } else {
          newResponses.push({ instanceID: instance.instanceID, completed: true });
        }
      });
      await modifySurvey({
        surveyID,
        updated: Date.now(),
        active: false,
        type: mode,
        responses_by_instance: newResponses,
      });
    } else if (surveyID) {
      await modifySurvey(surveyEdit(mode, this.state));
    } else {
      await createSurvey(survey(mode, this.state))
        .then(res => res.json())
        .then(res => this.setState({ surveyID: res.surveyID }));
    }

    if (active !== null) {
      if (active && deadline) {
        createSchedule(schedule(deadline, `end ${mode}`, { id: surveyID }), false);
      } else if (!active && deadline) {
        deleteSchedule(
          ScheduleStore.allScheduled.filter(sch => sch.data.id === surveyID && !sch.executed)[0]
            .scheduleID,
        );
      }
    }

    if (active) {
      history.push(`/panel/${mode}s`);
    }
  };

  render() {
    const { mode, history } = this.props;
    const { anonymous, label, openPreview, surveyItems, active, deadline } = this.state;

    const launch = (
      <Button onClick={() => this.updateSurvey(true)} disabled={!this.validate()} primary>
        {' '}
        Launch
        {' '}
      </Button>
    );
    const save = <Button onClick={() => this.updateSurvey()}> Save </Button>;
    const stop = (
      <Button negative onClick={() => this.updateSurvey(false)}>
        Stop
      </Button>
    );
    const cancel = <Button onClick={() => history.push('/panel/surveys')}> Cancel </Button>;
    const preview = surveyItems.length && (
      <Button onClick={() => this.setState({ openPreview: true })}> Preview </Button>
    );
    const actions = active ? (
      <div style={{ paddingTop: 5 }}>
        {' '}
        {save}
        {stop}
        {preview}
        {' '}
      </div>
    ) : (
      <div style={{ paddingTop: 5 }}>
        {' '}
        {launch}
        {save}
        {cancel}
        {preview}
        {' '}
      </div>
    );
    let title = '';
    let desc = '';
    if (mode === 'survey') {
      title = 'Survey builder';
      desc = 'surveys';
    } else if (mode === 'task') {
      title = 'Task builder';
      desc = 'task lists';
    } else {
      title = 'Poll builder';
      desc = 'polls';
    }
    return (
      <div>
        <Modal
          closeIcon
          onClose={() => this.setState({ openPreview: false })}
          open={openPreview}
        >
          <Modal.Header>Preview</Modal.Header>
          <Modal.Content style={{ backgroundColor: '#898989' }}>
            {surveyItems.length && (
              <div style={{ paddingTop: 20 }} className="container">
                <div className="page_container">
                  {mode === 'survey' ? (
                    <Survey
                      preview
                      data={this.state}
                      index={giveMeKey()}
                      usePaper 
                    />
                  ) : (
                    <Task
                      data={this.state}
                      index={giveMeKey()}
                      usePaper 
                    />
                  )}
                </div>
              </div>
            )}
          </Modal.Content>
        </Modal>
        <BackButton />
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          {title}
          <Header.Subheader>
            Configure and sendTargetType
            {' '}
            {desc}
            {' '}
            to your employees
          </Header.Subheader>
        </Header>
        <Segment>
          <Form>
            <Form.Input
              label="Title (Required)"
              value={label}
              onChange={(e, val) => this.setState({ label: val.value })}
            />
          </Form>
          {!active && (
            <>
              {TeamStore._isTargetingAvail && (
                <div style={{ paddingTop: '10px' }}>
                  <ChooseTargeting
                    label="Send survey"
                    output={val => this.setState(val)}
                    input={this.state}
                  />
                </div>
              )}
              <div style={{ paddingTop: '10px' }}>
                <span style={{ fontWeight: 800 }}>Deadline (Required)</span>
              </div>
              <div style={{ marginTop: '-5px' }}>
                <DateTimeSelect
                  value={e => this.setState({ deadline: moment(e).valueOf() })}
                  includeTime
                  defaultValue={deadline || ''}
                />
              </div>
              {mode !== 'poll' && (
                <div style={{ margin: '5px 0 5px' }}>
                  <span style={{ fontWeight: 800 }}>Anonymous Responses </span>
                  <br />
                  <Checkbox
                    toggle
                    checked={anonymous}
                    onChange={() => this.setState({ anonymous: !anonymous })}
                  />
                </div>
              )}
            </>
          )}
          <div>{actions}</div>
        </Segment>
        {this.displaySurveyItems()}
        {mode !== 'poll' && (
          <div style={{ padding: '20px 0 20px' }}>
            <Button
              primary
              circular
              icon="plus"
              onClick={() => this.addItem()}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(SurveyNewEdit);
