import React from "react";
// import {inject, observer} from "mobx-react"
import { Segment, Grid, Header, Icon, Statistic } from "semantic-ui-react";
import { Bar, Doughnut, Bubble, Line } from "react-chartjs-2";
import { Scheduled } from "./Scheduled"

export class DashboardFrame extends React.Component {
  componentWillMount() {}
  render() {
    const barchart1 = {
      labels: ["annc1", "annc2", "annc3"],
      options: {
        legend: { display: false }
      },
      datasets: [
        {
          label: "Reads",
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850"
          ],
          data: [211, 56, 123]
        }
      ]
    };

    const bubble1 = [
      {
        x: 100,
        y: 0,
        r: 10
      },
      {
        x: 60,
        y: 30,
        r: 20
      },
      {
        x: 40,
        y: 60,
        r: 25
      },
      {
        x: 80,
        y: 80,
        r: 50
      },
      {
        x: 20,
        y: 30,
        r: 25
      },
      {
        x: 0,
        y: 100,
        r: 5
      }
    ];
    const line1 = {
      labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
      datasets: [
        {
          label: "Car Speed",
          data: [0, 59, 75, 20, 20, 55, 40]
        }
      ]
    };

    return (
      <div style={{ paddingRight: 10 }}>
        <Header
          as="h2"
          content="Dashboard"
          subheader="Activity and Information Overview"
        />
        <Grid columns="three" divided>
          {/* <Grid.Row>
      <Grid.Column>
        <Segment>
            <h4>Announcements Activity</h4>
            <Bar data={barchart1}/>
        </Segment>
      </Grid.Column>
      <Grid.Column>
      <Segment>
             <h4>Email Activity</h4>
             <Doughnut data={barchart1}/>
        </Segment>
      </Grid.Column>
      <Grid.Column>
      <Segment>
      <h4>FAQs Activity</h4>
      <Bar data={barchart1}/>
        </Segment>
      </Grid.Column>
    </Grid.Row> */}

          <Grid.Row>
            <Grid.Column>
              <Segment style={{ height: 240 }}>
                <h4>Content Battery</h4>
                <Statistic label="Announcements" value="8" />
                <Statistic label="FAQs" value="23" />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <h4>Team Dispersion</h4>
                <Bubble data={bubble1} />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <h4>User Activity (past week)</h4>
                <Line data={line1} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Segment>
                <Header as="h3">
                  <Icon name="bell" />
                  <Header.Content>Notifications</Header.Content>
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Segment>
                <Scheduled/>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
