import React from "react"
import {Header, Segment, Dropdown, Button} from "semantic-ui-react"

export class EditUsers extends React.Component {
render(){
    return(
        <div>
            <Header inverted floated="left">User Management</Header>
            <br/>
            <Segment inverted>
                <Dropdown placeholder="choose user" options={[{text: "1", value: 1}]} />
                <br/>
                <Button.Group style={{paddingTop: 15}}>
                    <Button inverted>Load...</Button>
                </Button.Group>
                <Button style={{marginTop: 15}} inverted color="red" floated="right">Suspend</Button>
            </Segment>


        </div>
    )
}
}