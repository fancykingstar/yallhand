import React from "react";
import "./style.css"
import {Segment, Button, Header} from "semantic-ui-react"

export const History = () => {
    return(
        <Segment>
        <div style={{ maxWidth: 400 }}>
        <Header>History</Header>
        <Button
              style={{ display: "inline-block", marginLeft: 5 }}
              
            >
              Download
            </Button>
            <br />
            </div>
        </Segment>
    )
}
