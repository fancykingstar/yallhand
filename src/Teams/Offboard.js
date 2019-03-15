import React from "react";
import { inject, observer } from "mobx-react";
import {
  Modal,
  Button,
  Form,
  Grid,
  Divider,
  Container
} from "semantic-ui-react";
import { DatePicker } from "../SharedUI/DatePicker";
import { offBoardUser, createSchedule, deleteUser } from "../DataExchange/Up";
import { schedule } from "../DataExchange/PayloadBuilder"
import moment from "moment"

export const Offboard = inject("UIStore", "DataEntryStore")(
  observer(props => {
    const { UIStore } = props;
    const { DataEntryStore } = props;

    const handleOpen = () => {
      DataEntryStore.set("onOffBoarding", "offBoardingDate", "");
      UIStore.set("modal", "offboard", true);
    };

    const handleClose = () => {
      UIStore.set("modal", "offboard", false);
    };

    const offboardNow = () => {
        offBoardUser(DataEntryStore.userEditFields.userEdit.userID).then(() => {
          handleClose()
          UIStore.set("modal", "editUser", false)
          })
    }

    const offboardLater = () => {
        createSchedule(schedule(moment(DataEntryStore.onOffBoarding.offBoardingDate).valueOf(), "offboard user", {"userID": DataEntryStore.userEditFields.userEdit.userID}))
        .then(() => {
          handleClose() 
          UIStore.set("modal", "editUser", false)
        })

    }

    const setOffBoardDate = day => {
      DataEntryStore.set("onOffBoarding", "offBoardingDate", day);
    };

    const deleteInvited = () => {
      //User record from invite will still exist in DynamoDB unless changed
      deleteUser(DataEntryStore.userEditFields.userEdit.userID).then(() => {
      handleClose()
      UIStore.set("modal", "editUser", false)
      })
    }

    const deleteOrOffboard = DataEntryStore.userEditFields.userEdit.displayName_full === "" ?
    <Button
    disabled={props.disabled}
    onClick={e => deleteInvited()}
    negative
  >
    Delete
  </Button> :
   <Button
   disabled={props.disabled}
   onClick={e => handleOpen(e)}
   negative
 >
   Offboard
 </Button>

    return (
      <Modal
        open={UIStore.modal.offboard}
        size="small"
        trigger={
          <div style={{ float: "left" }}>
            {" "}
            {deleteOrOffboard}
          </div>
        }
      >
        <Modal.Content>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column>
              <Container style={{ paddingTop: 13 }} textAlign="center">
                <Button
                  onClick={e => offboardNow()}
                  content="Offboard Now"
                  icon="hand peace"
                  negative
                  size="large"
                />
                <p style={{ paddingTop: 10 }}>
                  User will immediately be deactivated from Yallhands.
                </p>
              </Container>
            </Grid.Column>

            <Grid.Column verticalAlign="middle">
              <Container textAlign="center">
                <Button
                  onClick={e => offboardLater()}
                  content="Schedule Last Day"
                  icon="clock"
                  primary
                  size="large"
                  disabled={DataEntryStore.onOffBoarding.offBoardingDate === ""}
                />
                <Form.Input style={{ paddingTop: 10 }} label="Choose Date">
                <DatePicker from={"tomorrow"} output={setOffBoardDate} />
                </Form.Input>
              </Container>
            </Grid.Column>
          </Grid>

          <Divider hidden vertical>
            Or
          </Divider>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel" onClick={e => handleClose(e)} />
        </Modal.Actions>
      </Modal>
    );
  })
);
