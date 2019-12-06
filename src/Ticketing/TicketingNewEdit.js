import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { Segment, Button, Form, Header, Checkbox, Grid, Dropdown, Divider } from "semantic-ui-react";
import { Collapse } from '@material-ui/core';
import { TicketingItem } from "./TicketingItem";
import { Col, Row } from "reactstrap";
import { ChooseTargeting } from "../SharedUI/ChooseTargeting";
import { ContentSearch} from "../SharedUI/ContentSearch";
import { BundleContent } from "../SharedUI/Bundle/BundleContent";

import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import BackButton from "../SharedUI/BackButton";
import { ticket, } from "../DataExchange/PayloadBuilder";
import { createTicket,  modifyTicket, deleteTicket } from "../DataExchange/Up";
import { validate } from "../SharedCalculations/ValidationTemplate";
import { arrayValUpOrDown } from "../SharedCalculations/ArrayValUpOrDown";

import { iconKey, iconOptions } from "./IconSelect";

import { ConfirmDelete } from "../SharedUI/ConfirmDelete";

@inject("TicketingStore", "ChannelStore", "AccountStore", "UserStore")
@observer
class TicketingNewEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketItems: this.reset(true),
      label: "",
      chanID: "All",
      teamID: "",
      tags: [],
      assoc: [],
      type: "simple",
      access: "default",
      active: false,
      icon: "Star",
      isTemplate: true,
      sendTargetType: "all",
      sendToTagID: "",
      sendToTeamID: "",
      sendToUsers: [],
      collaborators: [],
      config: {
        simpleDesc: false,
        deleteTicket: false,
      },
      _iconOptions: false,
    };
  }

  reset(init) {
    if (init) {
      return [
        {
          id: giveMeKey(),
          isOpen: true,
          defaultAssignee: "",
          data: [], //{type: "", label: "", options: []}
 
        },
        {
          id: giveMeKey(),
          defaultAssignee: "",
          isClose: true,
          data: [], //{type: "", label: "", options: []}

        }
      ];
    } else
      return {
        id: giveMeKey(),
        defaultAssignee: "",
        data: [{ type: "text", label: "", options: [] }], //{type: "", label: "", options: []}
 
      };
  }

  updateState(obj) { this.setState(obj); }

  validateFields = () => {
    const {
      label,
      collaborators,
      ticketItems,
    } = this.state;
    const conditions = {
      Title: Boolean(label),
      Collaborators: Boolean(collaborators.length),
      Labels: Boolean(!ticketItems.filter(i => {
        return Boolean(i.data.filter(y => !y.label).length)
      }).length),
      "Select Options": Boolean(!ticketItems.filter(i => {
        return Boolean(i.data.filter(y => y.type.toLowerCase().includes('select') && !y.options.length).length)
      }).length),
    };
    return validate(conditions).valid;
  };

  updateFields = (fieldObj, i) => {
    let ticketList = this.state.ticketItems;
    let newData = Object.assign(ticketList[i], fieldObj);
    ticketList.splice(i, 1, newData);
    this.setState({
      ticketItems: ticketList
    });
  };

  shiftRow = (direction, index) => {
    let questionList = this.state.ticketItems;
    const val = questionList[index];
    questionList.splice(index, 1);
    questionList.splice(direction === "up" ? index - 1 : index + 2, 0, val);
    this.setState({ surveyItems: questionList });
  };

  removeRow = async id => {
    let questionList = await this.state.ticketItems;
    questionList = questionList.filter(i => i._id !== id);
    this.setState({ surveyItems: questionList });
  };

  checkMultiRow = () => {
    if (this.state.ticketItems.length > 1) {
      return true;
    }
    return false;
  };

  fileUploadInUse = () => {
    let fileUploader = false;
    this.state.ticketItems.forEach(ticketItem => {
      if (ticketItem.data.filter(i => i.type === "file").length > 0 && !fileUploader) fileUploader = true;
    })
    return fileUploader;
  }

  displayTicketItems = () => {
    return this.state.ticketItems.map((stage, index) => {
      return (
        <TicketingItem
          multipleRows={this.checkMultiRow()}
          label={stage.label}
          isClose={stage.isClose}
          key={"ticketItemDisplay" + index}
          totalItemsCount={this.state.ticketItems.length}
          index={index}
          id={stage.id}
          fileUploadInUse={this.fileUploadInUse()}
          defaultAssignee={stage.defaultAssignee}
          data={stage.data}
          updateFields={this.updateFields}
          removeRow={this.removeRow}
          shiftRow={this.shiftRow}
          add={this.addItem}
          newLine={() => {
            if (index + 1 === this.state.ticketItems.length) this.addItem();
          }}
        />
      );
    });
  };

  addItem = () => {
    this.setState({ ticketItems: [...this.state.ticketItems, this.reset()] });
  };

  updateTicket = async (active = null) => {
    if (!this.validateFields()) return;
    if (active !== null) await this.setState({active});
    const isNew = Boolean(!this.state.ticketID);
    if (isNew) {
      const updated = await createTicket(ticket(this.state)).then(r=>r.json());
      await this.setState(updated);
    }
    else {
      modifyTicket(ticket(this.state));
    };
    if (active) this.props.history.push('/panel/ticketing');
  };

  removeSuggestedContent = val => {
    const {assoc} = this.state;
    const updatedBundle= assoc.filter(
      item => Object.values(item)[0] !== Object.values(val)[0]
    );
    this.setState({assoc: updatedBundle});
  };
  
  moveSuggestedContent = (val, direction) => {
    const {assoc} = this.state;
    const updatedBundle = arrayValUpOrDown( assoc, val, direciton );
    this.setState({assoc: updatedBundle});
  };



  handleDelete = async () => {
    await deleteTicket(this.state.ticketID);
    this.props.history.push('/panel/ticketing');
  }


  componentDidMount(active = null) {
    const { TaskStore, TicketingStore, UserStore } = this.props;
    const id = this.props.match.params.id;
    const me = UserStore.user.userID;
    const loadTicket = this.props.match.params.id
      ? TicketingStore.allTickets.filter(i => i.ticketID === id)[0]
      : false;
    if (loadTicket) {
      this.setState(loadTicket);
    }
    else this.setState({collaborators: [me]})
  }

  render() {
    const { ChannelStore, AccountStore, UserStore } = this.props;
    const { type, active, chanID, label, _iconOptions, icon, collaborators, access, assoc } = this.state;
    const isNew = Boolean(!this.state.ticketID);


    const launch = ( <Button onClick={e => this.updateTicket(true)} disabled={ false } primary > Launch </Button> );
    const save = ( <Button onClick={e => this.updateTicket()}> Save </Button> );
    const stop = <Button negative onClick={()=> this.updateTicket(false)}>Stop</Button>;
    const cancel = ( <Button onClick={e => this.props.history.push('/panel/ticketing')} > Cancel </Button> );
    const del = ( <ConfirmDelete confirm={()=> this.handleDelete()} label="Service desk ticket" /> );


  
    const preview = <Button onClick={e => {}}> Preview </Button>;
    const actions = active ? (
      <div style={{ paddingTop: 5 }}>
        {" "}
        {stop} {save} {cancel}
   
      </div>
    ) : (
      <div style={{ paddingTop: 5 }}>
        {" "}
        {launch} {save} {isNew? cancel: del} 
  
      </div>
    );

 
    return (
      <div>
        <BackButton />
   
        <Header as="h2" style={{ padding: 0, margin: 0 }}>
          New Request Template  
          <Header.Subheader>
            Employees create new tickets via the employee portal
          </Header.Subheader>
        </Header>
        <Row>
          <Col style={{ marginTop: 10 }}>
            <Segment>
 
              <Form>
                <Form.Input
                  className="FixSemanticLabel"
                  style={{ maxWidth: 400 }}
                  label="Title"
                  required
                  placeholder="e.g. Open service request"
                  value={label}
                  onChange={(e, val) => 
                    this.updateState({ label: val.value })
                  }
                >
                  <input maxLength={48} />
                </Form.Input>
              </Form>


                  <Form style={{ maxWidth: 400 }}>
                    <Form.Field className="FixSemanticLabel" style={{ minWidth: 370 }}>
                      <label>Ticketing Type</label>
                      <Grid columns={2} relaxed="very" stackable>
                        <Grid.Column>
                          <div style={{cursor: "pointer"}} onClick={()=>this.updateState({type: "simple", ticketItems: this.reset(true)})} className={type === "simple"? "PlanOption PlanActive" : "PlanOption"}>
                            <h4>Simple</h4>
                            <p>Basic open/close ticketing</p>
                          </div>
                        </Grid.Column>
                        <Grid.Column>
                        <div style={{cursor: "pointer"}} onClick={()=>this.updateState({type: "enhanced"})}  className={type !== "simple"? "PlanOption PlanActive" : "PlanOption"}>
                            <h4>Enhanced</h4>
                            <p>Design your own multi-step ticketing</p>
                          </div>
                        </Grid.Column>
                      </Grid>
                    </Form.Field>


                    <Form.Dropdown
                      value={access}
                      onChange={(e, val) =>
                        this.updateState({ access: val.value })
                      }
                      label="Choose ticket collaborators"
                      className="FixSemanticLabel"
                      style={{ minWidth: 370 }}
                      selection
                      options={[
                        {
                          text: `${UserStore.user.displayName} (me)`,
                          value: "default",
            
                        },
                        {
                          text: "Customize...",
                          value: "custom",
                   
                        }
                      ]}
                    />
                           </Form>
                    <Collapse in={this.state.access === "custom"}>
                      <Form>
          \

                        <Form.Dropdown
                          label="Select collaborator(s)"
                          className="FixSemanticLabel"
                          value={collaborators}
                          onChange={(e, val) =>
                            this.updateState({ collaborators: val.value })
                          }
                          
                          options={AccountStore._getUsersSelectOptions()}
                          fluid
                          multiple
                          selection
                          placeholder="Select user(s)..."
                        />
                        <p style={{ padding: "0px", marginTop: "-15px" }}>
                          <span style={{ fontSize: "0.7em" }}>
                            Grant access for editing and viewing tickets from this template
                           
                          </span>
                        </p>

      
                        <Form.Field>
                          <Checkbox
                            checked={this.state.config.deleteTicket}
                            onChange={(e, val) =>
                              this.updateState({
                                config: { deleteTicket: val.checked }
                              })
                            }
                            label="Allow collaborator(s) to delete tickets"
                          />
                        </Form.Field>

                      </Form>
                    </Collapse>
                    <Divider />
                    <Form>
                      <Form.Group>
                      <Form.Dropdown
                      value={chanID}
                      className="FixSemanticLabel"
                      onChange={(e, val) =>
                        this.updateState({ chanID: val.value })
                      }
                      options={ChannelStore._channelSelect}
                      selection
                      label="Channel"
                    />
                    <Form.Dropdown
                      className="FixSemanticLabel"
                      value={icon}
                      label="Button Icon"
                      onOpen={() => this.updateState({_iconOptions: true})}
                      onClose={() => this.updateState({_iconOptions: false})}
                      onChange={(e, {value})=>this.updateState({icon: value})}
                      icon={iconKey[`${icon}`]}
                      selection 
                      options={_iconOptions? iconOptions : []}
                    ></Form.Dropdown>
                      </Form.Group>
                      <Form.Group>
                      <Form.Field className="FixSemanticLabel">
                        <label>Suggest content to requester</label>
                        <ContentSearch output={res => {if(!assoc.filter(i=>i.value === res.value).length) this.updateState({assoc: [...assoc, {type: res.type, value: res.value}]})}}/>
                        {Boolean(assoc.length) &&
                        <BundleContent
                        input={assoc}
                        remove={val => this.removeSuggestedContent(val)}
                        moveUp={val => this.moveSuggestedContent(val, "up")}
                        moveDown={val => this.moveSuggestedContent(val, "up")}
                      />
                        }
                      </Form.Field>
                      </Form.Group>
                    </Form>
                  
           
            </Segment>
          </Col>
         
        </Row>

        {type === "simple" ? (
          <Segment>
            <Header>
              Simple Ticket
              <Header.Subheader>
                User information will automatically be passed along when this
                ticket is opened
              </Header.Subheader>
            </Header>
            <Form.Checkbox
              checked={this.state.config.simpleDesc}
              onChange={(e, val) =>
                this.updateState({ config: { simpleDesc: val.checked } })
              }
              label="Include a 'description' field for user to enter additional text"
            />
          </Segment>
        ) : (
          <>
            {this.displayTicketItems()}
            <div style={{ padding: "20px 0 20px" }}>
              <Button
                primary
                circular
                icon="plus"
                onClick={() => this.addItem()}
              />
            </div>
          </>
        )}

        {actions}
      </div>
    );
  }
}
export default withRouter(TicketingNewEdit);
