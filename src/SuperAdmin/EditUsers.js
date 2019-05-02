import React from "react"
import {inject, observer} from "mobx-react"
import {Header, Segment, Dropdown, Button, Icon} from "semantic-ui-react"
import { api_get } from "./Down"
import {apiCall_del, apiCall_noBody} from "../DataExchange/Fetch"

@inject("DataEntryStore")
@observer
export class EditUsers extends React.Component {
    constructor(props){
        super(props)
        const {DataEntryStore} = this.props
        this.getUsers = () =>{
            api_get("validations")
            .then((response) => {
            DataEntryStore.set("superAdmin", "allUsers", response.data.map(i => ({text: i.email, value:i.id, key: i.id})))
            DataEntryStore.set("superAdmin", "selectedUser", "")
            })
            .catch((error) => {
            console.log(error);
            })
     
        }
    }
componentDidMount(){
    const {DataEntryStore} = this.props
    if(DataEntryStore.superAdmin.allUsers.length === 0){
        this.getUsers()
    }
}
render(){
    const {DataEntryStore} = this.props

    const deleteUser = () => {
        const validationOption = DataEntryStore.superAdmin.allUsers.slice().filter(i => i.value === DataEntryStore.superAdmin.userSelected)[0]
        apiCall_del(`validations/${validationOption.value}`, "DELETE").then(() =>
            apiCall_noBody(`users/all?filter={"where":{"email":"${encodeURIComponent(validationOption.text)}"}}`, 'GET')
                .then((response) =>
                { apiCall_del(`users/${response[0].userID}`, "DELETE") 
                this.getUsers()}
                   
                ))
      
    }

    return(
        <div>
            <Header inverted floated="left">User Management</Header>
            <br/>
            <Segment inverted>
                <Dropdown value={DataEntryStore.superAdmin.userSelected} onChange={(e, val) => DataEntryStore.set("superAdmin", "userSelected", val.value)} placeholder="choose user" options={DataEntryStore.superAdmin.allUsers} />
                <br/>
                {/* <Button.Group style={{paddingTop: 15}}>
                    <Button inverted>Load...</Button>
                   
                </Button.Group> */}
                
                <Button onClick={e => deleteUser()} style={{marginTop: 15}} inverted color="red" floated="right">Delete</Button>
            </Segment>


        </div>
    )
}
}``