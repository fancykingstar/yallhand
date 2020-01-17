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
import DateTimeSelect from "../SharedUI/DateTimeSelect";
import { offBoardUser, createSchedule, deleteUser } from "../DataExchange/Up";
import { schedule } from "../DataExchange/PayloadBuilder"
import { apiCall } from "../DataExchange/Fetch"
import moment from "moment"

export const Offboard = inject("UIStore", "DataEntryStore")(
  observer(props => {
    const { UIStore, DataEntryStore,user, account } = props;

    const handleOpen = () => {
      DataEntryStore.set("onOffBoarding", "offBoardingDate", "");
      UIStore.set("modal", "offboard", true);
    };

    const handleClose = () => {
      UIStore.set("modal", "offboard", false);
      props.close();
    };

    const offboardNow = () => {
      offBoardUser(user, true).then(() => {
        handleClose()
      })
    }

    const offboardLater = () => {
      apiCall("emailcampaigns/trigger", "POST", {userID: user, accountID: account, type: "offboard"})
      createSchedule(schedule(moment(DataEntryStore.onOffBoarding.offBoardingDate).valueOf(), "offboard user", {"userID": user}))
        .then(() => {
          handleClose() 
        });
    } 

    const setOffBoardDate = day => {
      DataEntryStore.set("onOffBoarding", "offBoardingDate", day);
    };

    const deleteInvited = () => {
      //User record from invite will still exist in DynamoDB unless changed
      deleteUser(user).then(() => {
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
              <Container style={{paddingTop: 12}} textAlign="center">
                <Button
                  onClick={e => offboardLater()}
                  content="Schedule Last Day"
                  icon="clock"
                  primary
                  size="large"
                  disabled={DataEntryStore.onOffBoarding.offBoardingDate === ""}
                />
                <Form.Input label="Choose Date">

                <DateTimeSelect notToday value={val => setOffBoardDate(val) } />
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
