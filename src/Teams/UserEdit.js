import React from "react";
import { Button, Header, Image, Modal, Form } from "semantic-ui-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AdminEdit } from "./AdminEdit";
import { modifyUser,cancelInvite} from "../DataExchange/Up";
import { Offboard } from "./Offboard";
import {AccountStore} from "../Stores/AccountStore";
import Collapse from '@material-ui/core/Collapse';


export class UserEdit extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  closeModal() {
    Object.keys(this.state).forEach(key => {
      if(key !== "id" ) delete this.state[key]
    });
    this.props.close()
  }

  updateState(obj) {
    console.log(obj)
    this.setState(obj)
  };

  features = ["Teams", "FAQs", "Announcements", "Surveys", "Tasks", "Service Desk", "Email Campaigns"].map(feature => ({text: feature, value: feature}))

  render() {
    const {img, displayName, displayName_Full, isAdmin, email, teamID, tags, userID, boss} = this.props.data;


    const handleUpdate = async () => {
      await modifyUser(Object.assign(this.state, {userID}));
      this.props.close()
    }

    const cancelInv = async (id) => {
        await cancelInvite(id);
        this.props.close();
    };

    const displayAvatar = !img? null :
    <Modal closeIcon trigger={
      <div className="Avatar-Wrap"> 
      <Image
        className="Avatar"
        src={img}
        size="small"
        floated="left"
        style={!img ? {display: "none"}: {}}
      /></div> } basic size="small" >
    <Modal.Content> <Image src={img} fluid /> </Modal.Content>
  </Modal>

    return (
      <Modal open={this.props.open} onClose={()=>this.closeModal()} size="small">
        {JSON.stringify(this.state)}
        <Header as="h2">
          {displayAvatar}
          <Header.Content>
            {displayName_Full === ""? "Invited User": "Editing User"}
            <Header.Subheader>
              {displayName_Full}
            </Header.Subheader>
          </Header.Content>
        </Header>

        <Modal.Content>
          <Form size="small">
            <Form.Field>
              {!displayName_Full? null :
              <React.Fragment>
              <Form.Input
              label="Full Name"
              defaultValue={displayName_Full}
              onChange={(e, val) => this.updateState({displayName_Full: val.value})}
              />
              <Form.Input
              label="Display Name"
              defaultValue={displayName}
              onChange={(e, val) => this.updateState({displayName: val.value})}
              />
              </React.Fragment>}
              <Form.Input
                label="Email"
                disabled={Boolean(this.props.data.code)}
                defaultValue={email}
                onChange={(e, val) => this.updateState({email: val.value})}
              />
              <TeamSelect
               disabled={Boolean(this.props.data.code)}
                label=""
                defaultVal={teamID}
                outputVal={val =>
                  this.updateState({teamID: val.value})}
              />
              <TagSelect
               disabled={Boolean(this.props.data.code)}
                label=""
                defaultVal={tags}
                outputVal={val =>
                  this.updateState({tags: val==="none"? [] : [val]})
                }
              />
              <Form.Dropdown
               disabled={Boolean(this.props.data.code)}
              label="Reports to (optional):"
              fluid
              search
              selection
              defaultValue={boss}
              onChange={(e, val) => this.updateState({boss:val.value})}
              options={AccountStore._getUsersSelectOptions()}
            />
            
              <Form.Group>
         
                <Form.Radio
                 disabled={Boolean(this.props.data.code)}
                  toggle
                  // checked={this.state.isAdmin? this.state.isAdmin: isAdmin}
                  defaultChecked={isAdmin} 
                  onChange={(e, val) =>
                    this.updateState({isAdmin: val.checked})
                  }
                  label="Admin"
                />
              </Form.Group>
              <Collapse in={this.state.isAdmin === undefined? isAdmin : this.state.isAdmin}>
                  <Form>
                    <Form.Dropdown className="FixSemanticLabel" options={this.features} selection multiple label="Only allow access to view/edit features" />
                    <Form.Dropdown className="FixSemanticLabel" selection label="Only allow access to only view/edit channels" />
                    <Form.Dropdown className="FixSemanticLabel" selection label="Only allow access to only team/tag" />
                  </Form>
              </Collapse>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <div style={{ float: "right" }}>
            {" "}
            {
              this.props.data.code? <Button onClick={()=>cancelInv(this.props.data.id)} negative>Cancel Invite</Button> :
             <Offboard user={userID} account={AccountStore.account.accountID} close={()=>this.props.close()}/>
            }
  
          </div>
          <div style={{ float: "left", paddingBottom: 10 }}>
            <Button disabled={Boolean(this.props.data.code)} onClick={() => handleUpdate()} primary content="Update" />
            <Button onClick={()=>this.closeModal()}>Cancel</Button>
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}

