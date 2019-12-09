import React from "react";
import {Container, Row, Col} from "reactstrap";
import {Header, Icon, Form, Dropdown } from "semantic-ui-react";
import FadeIn from 'react-fade-in';

export const TicketDetailsQandAMessage = (props) => {
        const {_content} = props.data;
        return(
            <FadeIn transitionDuration={100} delay={0}>
             <Container style={{padding: 0}}>
              <Row style={{ padding: "25px 0 0px" }}>
              <Col>
              <span> <Icon onClick={()=>props.output({messageType: ""})} color="blue" name='arrow circle left' />Q: {props.data.activity[props.data.activity.length - 1].data.q}</span>
              {/* <Header style={{marginBottom: 5}} as="h5">  Re: {_content.label} 
               <Header.Subheader>
                   {props.data.activity[props.data.activity.length - 1].data.q}
               </Header.Subheader>
              </Header> */}
               <Form onSubmit={()=>props.handleSubmit()}  className="FixSemanticLabel">
               <Form.Field>
                    {" "}
                    {"Reply"}{" "}
                    <span style={{ fontWeight: "bold" }}>
                      <Dropdown
                        onChange={(e, {value})=>props.output({"messageType":value})}
                        options={[
                            {text: "publicly on content page" , value: "reply-public"},
                            {text: "privately to requester", value: "reply-private"},
                        ]}
                        defaultValue={"reply-public"}
                      />
                    </span>
                  </Form.Field>
                 <Form.Input
                 className="ActionButton"
                 action={"Reply"}
                 onChange={(e, {value})=>props.output({"message":value})}
                 />
               </Form>
              </Col>
            </Row>
          </Container>
          </FadeIn>
        )
    };


              
  