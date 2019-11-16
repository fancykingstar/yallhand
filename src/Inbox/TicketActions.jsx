import React from "react";
import { Button, Form, Checkbox, Dropdown, Menu, Icon } from "semantic-ui-react";
import { Container, Col, Row } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";
import { userID } from "../SharedCalculations/CommonValues";
import { modifyTicket } from "../DataExchange/Up";
import { AttachFile } from "../SharedUI/AttachFile";
import FadeIn from "react-fade-in";
import isEmpty from "lodash";
import moment from "moment";

export class TicketActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "activity",
      stage: "",
      addlFieldsSource: [],
      selectedAssignee: "", //NOTE: False is unassigned for dropdown functionality
      id: "",
      addlFieldsRes: {},
      assigneeOptions: [],
      showFileUpload: false,
      files: []
    };
  }

  updateState(obj) {this.setState(obj)};

 async addFile(file) {
    const newActivity =  {
      userID: userID(),
      views: [userID()],
      stage: "",
      updated: Date.now(),
      data: {file: file.resourceID},
      assignee: ""
    };
    let activity = [ newActivity, ...this.props.data.activity];

    const updateObj = {
      ticketID: this.props.data.ticketID,
      accountID: this.props.data.accountID,
      activity,
    };
    await modifyTicket(updateObj);

    // this.setState({files: [...this.state.files, file]})
  }

  static getDerivedStateFromProps(props, state) {

    if (props.id !== state.id) {
      const base = [...AccountStore._getUsersSelectOptions([
        ...props.data._parent.admins,
        ...props.data._parent.collaborators
      ]), ...AccountStore._getAdminSelectOptions()];
      return {
        id: props.id,
        stage: props.data._stage,
        selectedAssignee: props.data._currentAssignee || false,
        addlFieldsSource: [],
        addlFieldsRes: {},
        assigneeOptions: [...base, { text: "Unassigned", value: false }]
      };
    } else return null;
  }

  setAddlFieldRes = obj => {
    const newVal = Object.assign(this.state.addlFieldsRes, obj);
    this.setState({ addlFieldsRes: newVal });
  };

  async addlFields() {
    const { stage } = this.state;
    const { _parent, activity } = this.props.data;
    const stageHasBeenCompleted = () => {
      const activityStages = activity.map(act => act.stage);
      if (stage.includes("open"))
        return (
          activityStages.includes("open-pending") ||
          activityStages.includes("open")
        );
      else if (stage.includes("close"))
        return Boolean(
          activityStages.filter(stg => stg.includes("close")).length
        );
      else return Boolean(activityStages.filter(stg => stg === stage).length);
    };

    if (!stage || stageHasBeenCompleted()) return [];
    else if (stage.includes("close"))
      return await _parent.ticketItems.filter(i => i.isClose);
    else if (stage === "open")
      return await _parent.ticketItems.filter(i => i.isOpen);
    else
      return await _parent.ticketItems.filter(
        i => i.label && i.label === stage
      );
  }

  // updateTicket = async () => {
  //   const { selectedAssignee, addlFieldsRes } = this.state;
  //   const userID() = UserStore.user.userID();
  //   let newData = isEmpty(addlFieldsRes)? {} : addlFieldsRes;
 

  //     const newActivity = [
  //       ...this.props.data.activity,
  //       {
  //         userID(),
  //         stage: this.state.stage,
  //         updated: Date.now(),
  //         data: newData,
  //         assignee: selectedAssignee || ""
  //       }
  //     ];
  //     const updateObj = {
  //       ticketID: this.props.data.ticketID,
  //       accountID: this.props.data.accountID,
  //       activity: newActivity,
  //     };
  //     await modifyTicket(updateObj);
  // };

  addOrReplace = (type) => {
    const lastActivity = this.props.data.activity[0];
    const underThreeMin = moment().diff(lastActivity.updated, 'minutes') < 3? "replace" : "add";
    const evalu = {
      assignOnly:   !lastActivity.stage && isEmpty(lastActivity.data),
      stageOnly: lastActivity.stage && isEmpty(lastActivity.data),
      dataOnly: !lastActivity.stage && !isEmpty(lastActivity.data),
      complete: lastActivity.stage && !isEmpty(lastActivity.data)
    }
    const sameType = Object.keys(evalu).filter(ev => evalu[ev])[0] === type;
    return sameType && underThreeMin? "replace":"add";
  }


  async changeStageOrAssign(type, data) {
    const { selectedAssignee, stage } = this.state;
    if (type === "stage" && data === stage) return
    if (type === "assignee" && data === selectedAssignee) return
    await this.setState(type === "stage"? {stage: data} : {selectedAssignee: data});
    const checkFields = await this.addlFields();
    const action = type === "stage" && data === "open" && stage === "open-pending"? "add" : this.addOrReplace(type === "stage"? "stageOnly" : "assignOnly");
    
    if (type === "stage" && checkFields.length && checkFields[0].data.length) this.setState({ addlFieldsSource: checkFields[0].data });
    else {
      const newActivity =  {
        userID: userID(),
        views: [userID()],
        stage: type==="stage"? data : "",
        updated: Date.now(),
        data: {},
        assignee: type==="assignee"? data : selectedAssignee || ""
      };
      let activity = [];
      if (action === "add") activity = [ newActivity, ...this.props.data.activity];

      else {
        activity = this.props.data.activity;
        activity.splice(0, 1, newActivity);
      }

      const updateObj = {
        ticketID: this.props.data.ticketID,
        accountID: this.props.data.accountID,
        activity,
      };
      await modifyTicket(updateObj);
    }
    };




  stagesOptions = () => {
    const { _parent } = this.props.data;

    const parentStages = !_parent.ticketItems.length
      ? []
      : _parent.ticketItems
          .filter(ticketItem => ticketItem.label)
          .map(ticketItem => ({
            text: ticketItem.label,
            value: ticketItem.label
          }));

    let baseStages = [
      { text: "Open", value: "open" },
      { text: "Close (completed)", value: "closed" },
      { text: "Close (unable to fulfill)", value: "closed-cant" },
      { text: "Close (outside of scope/declined)", value: "closed-wont" },
      { text: "Close (duplicate)", value: "closed-duplicate" }
    ];
    return [...parentStages, ...baseStages];
  };

  getFormItemField(formItem) {
    if (formItem.type === "text")
      return (
        <Form className="FixSemanticLabel">
          <Form.Input
            label={formItem.label}
            onChange={(e, value) => {
              let newVal = {};
              newVal[formItem.label] = value;
              this.setAddlFieldRes(newVal);
            }}
          />
        </Form>
      );
    else if (formItem.type === "select")
      return (
        <Form className="FixSemanticLabel">
          <Form.Select
            label={formItem.label}
            onChange={(e, { value }) => {
              let newVal = {};
              newVal[formItem.label] = value;
              this.setAddlFieldRes(newVal);
            }}
            options={formItem.options.map(opt => ({ text: opt, value: opt }))}
          />
        </Form>
      );
    else if (formItem.type === "multi")
      return (
        <>
          <span>{formItem.label}</span>
          <Form>
            <Form.Group grouped>
              {formItem.options.map(opt => (
                <Form.Field
                  control={Checkbox}
                  label={<label>{opt}</label>}
                  onChange={(e, value) => {
                    let newVal = {};
                    newVal[opt] = value.checked;
                    this.setAddlFieldRes(newVal);
                  }}
                />
              ))}
            </Form.Group>
          </Form>
        </>
      );
  }

  render() {
    const { assigneeOptions, selectedAssignee, stage } = this.state;

    return (
      <FadeIn transitionDuration={100} delay={0}>
        <Container style={{ padding: 0 }}>

          <Row style={{ padding: "25px 0 0px" }}>
            <Col>
              <Form className="FixSemanticLabel">
                <Form.Group>
                  {stage !== "open-pending" && (
                    <Form.Field>
                      {"Stage:"}{" "}
                      <span style={{ fontWeight: "bold" }}>
                        <Dropdown
                          value={stage}
                          onChange={(e, { value }) => this.changeStageOrAssign("stage",value)}
                          options={this.stagesOptions()}
                        />
                      </span>
                    </Form.Field>
                  )}

                  <Form.Field>
                    {" "}
                    {"Assignee:"}{" "}
                    <span style={{ fontWeight: "bold" }}>
                      <Dropdown
                        value={selectedAssignee}
                        options={assigneeOptions}
                        onChange={(e, { value }) =>
                        this.changeStageOrAssign("assignee", value)
                        }
                      />
                    </span>
                  </Form.Field>
                </Form.Group>
              </Form>
            </Col>
          </Row>

          <Row>
            {this.state.addlFieldsSource &&
              this.state.addlFieldsSource.map(formItem => (
                <Col md={6}>{this.getFormItemField(formItem)}</Col>
              ))}
          </Row>
          <Row>
            <Col>
              {stage === "open-pending" && (
                <>
                  <Button
                    onClick={() => this.changeStageOrAssign("stage", "open")}
                    className="SubActionFeatured"
                    active={true}
                    color="blue"
                    style={{ fontSize: ".7em" }}
                    size="mini"
                  >
                    Accept Request
                  </Button>
                  <Dropdown
                    className="SubAction"
                    onChange={(e, {value}) => this.changeStageOrAssign("stage", value)}
                    button
                    style={{ fontSize: ".7em" }}
                    size="mini"
                    text="Decline Request"
                    options={[
                      { text: "Outside of scope/declined", value: "closed-wont" },
                      { text: "Unable to fulfill", value: "closed-cant" },
                      { text: "Duplicate", value: "closed-duplicate" },
                      { text: "Completed", value: "closed" }
                    ]}
                  />
                </>
              )}
              {/* <Button onClick={() => this.props.output({messageType: "requester"})} className="SubAction"   style={{fontSize: ".7em"}} size="mini" toggle><Icon name='talk' />Message Requester...</Button> */}
              <Button
                onClick={() => this.props.output({ messageType: "internal" })}
                className="SubAction"
                style={{ fontSize: ".7em" }}
                size="mini"
                toggle
              >
                <Icon name="write" />
                Add Memo...
              </Button>
              <Button
                onClick={() => this.updateState({showFileUpload: true})}
                className="SubAction"
                style={{ fontSize: ".7em" }}
                size="mini"
                toggle
              >
                <Icon name="attach" />
                Add File...
              </Button>
              <AttachFile
              assoc={{tickets: [this.props.data.ticketID]}}
              open={this.state.showFileUpload}
              close={() => this.updateState({showFileUpload: false})}
              title="Upload a new file"
              output={val => this.addFile(val)}
              includeTeamTag={false}
        />
            </Col>
          </Row>
        </Container>
      </FadeIn>
    );
  }
}
