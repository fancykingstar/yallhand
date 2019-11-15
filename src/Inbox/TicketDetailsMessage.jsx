import React from "react";
import {Container, Row, Col} from "reactstrap";
import {Header, Icon, Form } from "semantic-ui-react";
import FadeIn from 'react-fade-in';

export const TicketDetailsMessage = (props) => {

        return(
            <FadeIn transitionDuration={100} delay={0}>
             <Container style={{padding: 0}}>
              <Row style={{ padding: "25px 0 0px" }}>
              <Col>
              <Header style={{marginBottom: 5}} as="h5">   <Icon onClick={()=>props.output({messageType: ""})} color="blue" name='arrow circle left' />{props.label}
           
              </Header>
               <Form onSubmit={()=>props.handleSubmit()}  className="FixSemanticLabel">
                 <Form.Input
                 className="ActionButton"
                 action={props.action}
                 onChange={(e, {value})=>props.output({"message":value})}
                 />
               </Form>
              </Col>
            </Row>
          </Container>
          </FadeIn>
        )
    };


              
  