import React from "react";
import { Button, Header, Image, Modal, Form } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { TeamSelect } from "../SharedUI/TeamSelect";
import { TagSelect } from "../SharedUI/TagSelect";
import { AdminEdit } from "./AdminEdit";
import { modifyUser} from "../DataExchange/Up"
import { Offboard } from "./Offboard"
import { userUpdate } from "../DataExchange/PayloadBuilder"

@inject("DataEntryStore")
@observer
export class UserEdit extends React.Component {
  render() {
    const { DataEntryStore } = this.props;
    console.log(DataEntryStore.userEditFields.isAdmin)
    const defaultValues = val =>
        DataEntryStore.userEditFields.userEdit[val];
    // const adminSettings =
    //   DataEntryStore.userEditFields.isAdmin === false ? null : <AdminEdit />;
    const handleInput = (e, val, type) => {
      DataEntryStore.userEditFields[type] = val.value;}
    const handleCancel = () => {
      DataEntryStore.reset("userEditFields", {adminConfig: "all"});
      this.props.close()
    }
    const handleUpdate = () => {
      modifyUser(userUpdate())
      .then(() => {
        DataEntryStore.reset("userEditFields", {adminConfig: "all"});
        this.props.close()
      })
     
    }

    const displayAvatar = defaultValues("img") === ""? null :
    <Modal closeIcon trigger={
      <div className="Avatar-Wrap"> 
      <Image
        className="Avatar"
        src={defaultValues("img")}
        size="small"
        floated="left"
        style={defaultValues("img") === "" ? {display: "none"}: {}}
      /></div> } basic size="small" >
    <Modal.Content> <Image src={defaultValues("img")} fluid /> </Modal.Content>
  </Modal>

    return (
      <Modal open={this.props.open} onClose={handleCancel} size="small">
        <Header as="h2">
          {displayAvatar}
          <Header.Content>
            {defaultValues("displayName_full") === ""? "Invited User": "Editing User"}
            <Header.Subheader>
              {defaultValues("displayName_full")}
            </Header.Subheader>
          </Header.Content>
        </Header>

        <Modal.Content>
          <Form size="small">
            <Form.Field>
              {defaultValues("displayName_full") === ""? null :
              <React.Fragment>
              <Form.Input
              label="Full Name"
              defaultValue={defaultValues("displayName_full")}
              onChange={(e, val) => handleInput(e, val, "displayName_full")}
              />
              <Form.Input
              label="Display Name"
              defaultValue={defaultValues("displayName")}
              onChange={(e, val) => handleInput(e, val, "displayName")}
              />
              </React.Fragment>}
              <Form.Input
                label="Email"
                defaultValue={defaultValues("email")}
                onChange={(e, val) => handleInput(e, val, "email")}
              />
              <TeamSelect
                label=""
                defaultVal={defaultValues("teamID")}
                outputVal={val =>
                  DataEntryStore.set("userEditFields", "teamID", val.value)}
              />
              <TagSelect
                label=""
                defaultVal={defaultValues("tags")}
                outputVal={val =>
                  DataEntryStore.set("userEditFields", "tagID", val)
                }
              />
            
              <Form.Group>
         
                <Form.Radio
                  toggle
                  checked={DataEntryStore.userEditFields.isAdmin} 
                  onChange={e =>
                    DataEntryStore.set(
                      "userEditFields",
                      "isAdmin",
                      !DataEntryStore.userEditFields.isAdmin
                    )
                  }
                  label="Admin"
                />
              </Form.Group>
              {/* {adminSettings} */}
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <div style={{ float: "right" }}>
            {" "}
           <Offboard/>
          </div>
          <div style={{ float: "left", paddingBottom: 10 }}>
            <Button onClick={e => handleUpdate(e)} primary content="Update" />
            <Button onClick={e => handleCancel(e)}>Cancel</Button>
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}

