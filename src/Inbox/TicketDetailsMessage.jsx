import React from "react";
import {Container, Row, Col} from "reactstrap";
import {Header, Icon, Form } from "semantic-ui-react";
import FadeIn from 'react-fade-in';

export class TicketDetailsMessage extends React.Component {
    render() {
        return(
            <FadeIn transitionDuration={100} delay={0}>
             <Container style={{padding: 0}}>
              <Row style={{ padding: "25px 0 0px" }}>
              <Col>
              <Header style={{marginBottom: 5}} as="h5">   <Icon color="blue" name='arrow circle left' />Send message to requester
           
              </Header>
               <Form  className="FixSemanticLabel">
                 <Form.Input
                 className="ActionButton"
                 action="Send"
                 // label="This label"
                 />
               </Form>
              </Col>
            </Row>
          </Container>
          </FadeIn>
        )
    }
}

              
  