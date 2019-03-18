import React from "react"
import {Header, Segment, Form, Button} from "semantic-ui-react"

export class CreateUsers extends React.Component {
render(){
    return(
        <div>
            <Header inverted floated="left">Create Users</Header>
            <br/>
            <Segment inverted>
                <Form inverted>
                    <Form.Select label="Organization"/>
                    <Form.Input label="Email"/>
                    <Form.Select label="Team"/>
                    <Form.Select label="Tag"/>
                    <Form.Checkbox inverted label="Admin"/>
                    <Form.Button inverted>Submit</Form.Button>
                </Form>
            </Segment>


        </div>
    )
}
}