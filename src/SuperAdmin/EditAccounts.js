import React from "react"
import {inject, observer} from "mobx-react"
import {Header, Segment, Dropdown, Button, Icon} from "semantic-ui-react"
import { loadAdmin } from "../DataExchange/LoadProfile";
import { deleteAccount } from "../DataExchange/Up"
import { api_get } from "./Down"

@inject("DataEntryStore", "UserStore")
@observer
export class EditAccounts extends React.Component {

render(){
    const {DataEntryStore, UserStore} = this.props
    const loadAccount = () => {
        loadAdmin(true, {accountID: DataEntryStore.superAdmin.previewAccount, userID: UserStore.user.userID})
    }

    const deleteAcct = () => {
        deleteAccount(DataEntryStore.superAdmin.previewAccount).then(() =>
        api_get("accounts/all")
        .then((response) => {
          DataEntryStore.set("superAdmin", "allAccounts", response.data)
        })
        .catch((error) => {
          console.log(error);
        }))
    }

    return(
        <div>
            <Header inverted floated="left">Account Management</Header>
            <br/>
            <Segment inverted>
                <Dropdown placeholder="choose account" options={this.props.accounts} onChange={(e, val) => DataEntryStore.set("superAdmin", "previewAccount", val.value)} />
                <br/>
                <Button.Group style={{paddingTop: 15}}>
                    <Button onClick={() => loadAccount()} disabled={DataEntryStore.superAdmin.previewAccount === ""} inverted>Load...</Button>
                </Button.Group>
                <Button.Group floated="right">
                <Button style={{marginTop: 15}} inverted color="red" toggle active={DataEntryStore.superAdmin.accountArmed} onClick={e => DataEntryStore.set("superAdmin", "accountArmed", !DataEntryStore.superAdmin.accountArmed)} icon> <Icon name='lock' /> </Button>
                <Button style={{marginTop: 15}} inverted color="red"  disabled={DataEntryStore.superAdmin.previewAccount === "" || !DataEntryStore.superAdmin.accountArmed}>Suspend</Button>
                <Button style={{marginTop: 15}} inverted color="red"  disabled={DataEntryStore.superAdmin.previewAccount === "" || !DataEntryStore.superAdmin.accountArmed} onClick={e => deleteAcct()}>Delete</Button>
                </Button.Group>

            </Segment>
          


        </div>
    )
}
}