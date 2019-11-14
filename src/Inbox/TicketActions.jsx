import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, Checkbox, Dropdown, Menu, Icon } from "semantic-ui-react";
import { Paper } from "@material-ui/core";

import { Container, Col, Row } from "reactstrap";
import { AccountStore } from "../Stores/AccountStore";
import { UserStore } from "../Stores/UserStore";
import { modifyTicket } from "../DataExchange/Up";
import { TicketData } from "./TicketData";
import { TicketActivity } from "./TicketActivity";
import { TicketRequester } from "./TicketRequester";
import FadeIn from 'react-fade-in';

export class TicketActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "activity",
      showMemo: false,
      stage: "",
      addlFieldsSource: [],
      selectedAssignee: "", //NOTE: False is unassigned for dropdown functionality
      memo: "",
      memoAdmin: "",
      id: "",
      addlFieldsRes: {},
      assigneeOptions: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.id !== state.id) {
      const base = AccountStore._getUsersSelectOptions([ ...props.data._parent.admins, ...props.data._parent.collaborators ]); 
      console.log("DATA", props.data)
      return {
        id: props.id,
        showMemo: false,
        memo: "",
        stage: props.data._stage,
        selectedAssignee: props.data._currentAssignee || false ,
        memoAdmin: "",
        addlFieldsSource: [],
        addlFieldsRes: {},
        assigneeOptions: [...base, {text: "Unassigned", value: false}]
      };

    }
    else return null;
  }

  setAddlFieldRes = obj => {
    const newVal = Object.assign(this.state.addlFieldsRes, obj);
    this.setState({ addlFieldsRes: newVal });
  };



  async addlFields() {
    const { stage } = this.state;
    const { _parent } = this.props.data;
    if (!stage) return [];
    else if (stage.includes("close"))
      return await _parent.ticketItems.filter(i => i.isClose);
    else if (stage === "open")
      return await _parent.ticketItems.filter(i => i.isOpen);
    else
      return await _parent.ticketItems.filter(
        i => i.label && i.label === stage
      );
  }

  updateTicket = async () => {
    const { stage } = this.state;
    const userID = UserStore.user.userID;
    if (stage.includes("close")) {
      const newActivity = [
        ...this.props.data.activity,
        {
          userID,
          stage: this.state.stage,
          updated: Date.now(),
          data: this.state.memo ? { memo: this.state.memo } : {}
        }
      ];
      const updateObj = {
        ticketID: this.props.data.ticketID,
        accountID: this.props.data.accountID,
        stage: this.state.stage,
        activity: newActivity
      };
      modifyTicket(updateObj);
    }
  };

  async changeStage(stage) {
    await this.setState({ stage });
    const checkFields = await this.addlFields();

    if (checkFields.length && checkFields[0].data.length)
      this.setState({ addlFieldsSource: checkFields[0].data });
  }

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
      { text: "Close (Outside of scope/declined)", value: "closed-wont" }
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
    const { _requester, _userImg, _userInitials, _parent, _parentLabel, activity } = this.props.data;
    const { activeItem, assigneeOptions, selectedAssignee, stage } = this.state;

   
    return (

        <FadeIn transitionDuration={100} delay={0}>
              <Container style={{padding: 0}}>
              <Row style={{ padding: "25px 0 0px" }}>
                <Col>
                  <Form className="FixSemanticLabel">
                    <Form.Group>
                      <Form.Field>
                        {"Stage:"}{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <Dropdown
                            value={stage}
                            onChange={(e, { value }) => this.changeStage(value)}
                            options={this.stagesOptions()}
                          />
                        </span>
                      </Form.Field>

                      <Form.Field>
                        {" "}
                        {"Assignee:"}{" "}
                        <span style={{ fontWeight: "bold" }}>
                          <Dropdown
                            value={selectedAssignee}
                            options={assigneeOptions}
                            onChange={(e, { value }) =>
                              this.setState({ selectedAssignee: value })
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
                <Button onClick={()=>this.showActionForm()} className="SubActionFeatured" active={true} color="blue" style={{fontSize: ".7em"}} size="mini">Accept Request</Button>
                <Dropdown className="SubAction"  button style={{fontSize: ".7em"}} size="mini" text="Decline Request" options={[{text: "Outside of scope/declined", value: 0},{text: "Unable to fulfill", value: 2},{text: "Duplicate", value: 3},{text: "Completed", value: 4}]} />
                <Button className="SubAction"   style={{fontSize: ".7em"}} size="mini" toggle><Icon name='talk' />Message Requester...</Button>
                <Button className="SubAction"  style={{fontSize: ".7em"}} size="mini" toggle><Icon name="write" />Add Memo...</Button>
                </Col>
              </Row>

              {/* <Row style={{ padding: "5px 0 8px" }}>
                <Col>
                  {!this.state.showMemo ? (
                    <span
                      style={{ color: "#4183C4", fontSize: "1rem" }}
                      onClick={() => this.setState({ showMemo: true })}
                    >
                      Add Memo...
                    </span>
                  ) : (
                    <Form className="FixSemanticLabel">
                      <Form.Input
                        onChange={e => this.setState({ memo: e.target.value })}
                        placeholder="Memo (optional)"
                        label="Memo (optional)"
                        type="text"
                        name={"description"}
                        id="description"
                      />
                    </Form>
                  )}
                </Col>
              </Row> */}
              {/* <Row style={{ padding: "12px 0 8px" }}>
                <Col>
                  <Button onClick={() => this.updateTicket()} primary>
                    Update
                  </Button>
                </Col>
              </Row> */}
              </Container>
        </FadeIn>

    );
  }
}


