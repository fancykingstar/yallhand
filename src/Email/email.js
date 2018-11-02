import React from "react";
// import "./style.css";
import { Form, Icon, Table, Segment, Header} from "semantic-ui-react";
import { PillButton } from "../SharedUI/PillButton";

export class Email extends React.Component {
  render() {
    return (
      <div className="Segment">
        <Header
          as="h2"
          content="Configure Email Campaign"
          subheader="Send targeted emails across your organization"
        />

        <Segment>
          <Header as="h3" content="Settings" />
          <Header as="h4" content="Send eligible emails every" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              
              <Form.Select fluid label="Day" placeholder="Day of week" options={
                  [
                      {text: 'Monday', value: 'Monday'},
                      {text: 'Tuesday', value: 'Tuesday'},
                      {text: 'Wednesday', value: 'Wednesday'},
                      {text: 'Thursday', value: 'Thursday'},
                      {text: 'Friday', value: 'Friday'}
                      
                      ]}/>
                 
                 <Form.Select fluid label="Period" placeholder="Time of day" options={
                  [
                      {text: 'Morning', value: 'Morning'},
                      {text: 'Noon', value: 'Noon'},
                      {text: 'Afternoon', value: 'Afternoon'}
                      
                      ]}/>
            </Form.Group>
            <Form.Group />
          </Form>
          <Header as="h4" content="Include" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Checkbox fluid label="Annoucements" />
              <Form.Checkbox fluid label="FAQs" />
              <Form.Checkbox fluid label="Surveys" />
              <Form.Checkbox fluid label="Polls" />
              <Form.Checkbox fluid label="Resources" />
            
            </Form.Group>
            <Form.Group />
          </Form>
          <Header as="h4" content="Additional settings" />
          <Form>
            <Form.Group inline widths="equal" style={{ paddingRight: 10 }}>
              <Form.Checkbox fluid label="Enable retargeting for unopened emails" />
            </Form.Group>
            <Form.Group />
          </Form>

          <Header as="h3" content="Queue" />

          <Table style={{ maxWidth: 850 }} basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
               
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Annoucement</Table.Cell>
                <Table.Cell>We're switching to bi-weekly paychecks start tomorrow</Table.Cell>
                <Table.Cell>September 28th 2018</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Annoucement</Table.Cell>
                <Table.Cell>New Lunch program Tues and Weds for San Francisco Offices</Table.Cell>
                <Table.Cell>September 28th 2018</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>FAQ</Table.Cell>
                <Table.Cell>Where can employees lock up their bike?</Table.Cell>
                <Table.Cell>September 28th 2018</Table.Cell>

                <Table.HeaderCell>
                  <Icon name="minus circle" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Header as="h4" content="Rush Delivery" />
          <PillButton iconName="send" label="Send Now"/>
        </Segment>
        {/* <Table.Body style={{ fontWeight: 200 }}>{displayLinks}</Table.Body> */}
      </div>
    );
  }
}
