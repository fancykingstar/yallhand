import React, { Component } from 'react';
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom";
import { EditAccounts } from "./EditAccounts"
import { CreateAccounts } from "./CreateAccounts"
import { EditUsers } from "./EditUsers"
import { Analytics } from "./Analytics"
import { api_get } from "./Down"
import { SuperAdminNav } from "./SuperAdminNav";
import { TestFrame } from "./TestFrame"
import './superadmin.css';

@inject("UIStore", "DataEntryStore")
@observer
class SuperAdminFrame extends Component {
  componentDidMount(){
    const {DataEntryStore} = this.props
   api_get("accounts/all")
  .then((response) => {
    DataEntryStore.set("superAdmin", "allAccounts", response.data)
  })
  .catch((error) => {
    console.log(error);
  })
  }
  render() {
    const {UIStore, DataEntryStore} = this.props
    const accountOptions = () => DataEntryStore.superAdmin.allAccounts.map(acct => ({"text": acct.label, "value": acct.accountID, "key": acct.accountID}))
    const route = {
      "analytics": <Analytics accounts={accountOptions()}/>,
      "edit account": <EditAccounts accounts={accountOptions()}/>,
      "create account": <CreateAccounts/>,
      "users": <EditUsers/>,
      "test": <TestFrame/>
    }[UIStore.menuItem.superAdminFrame]

    return (
      <div className="SuperAdmin">
        <div className="SuperAdminNav">
        <SuperAdminNav updateNav={val => UIStore.set("menuItem", "superAdminFrame", val)} />
        </div>

       <div className="SuperAdminActionFrame">
        {route}
     

       </div>
      </div>
    );
  }
}

const App = withRouter(SuperAdminFrame);
export default App;

