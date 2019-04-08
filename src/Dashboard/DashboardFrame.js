import React from "react";
import {inject, observer} from "mobx-react"
import { Segment, Grid, Header, Icon, Statistic } from "semantic-ui-react";
import { Scheduled } from "./Scheduled"
import Notifications from "./Notifications"



@inject("AccountStore", "AnnouncementsStore", "PoliciesStore", "TeamStore", "EmailStore",)
@observer
export class DashboardFrame extends React.Component {
  componentWillMount() {}
  render() {
    const {AccountStore, AnnouncementsStore, PoliciesStore, TeamStore, EmailStore} = this.props

    return (
      <div style={{ paddingRight: 10 }}>
        <Header
          as="h2"
          content="Dashboard"
          subheader="Activity and Information Overview"
        />
        <Grid columns="three" divided stackable>
         
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <h4>Content</h4>
                <Statistic.Group widths={2}>
                <Statistic>
                  <Statistic.Value>{AnnouncementsStore.allAnnouncements.length}</Statistic.Value>
                  <Statistic.Label>Announcements</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{PoliciesStore.allPolicies.length}</Statistic.Value>
                  <Statistic.Label>FAQs</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <h4>Teams</h4>
                <Statistic.Group widths={2}>
                <Statistic>
                  <Statistic.Value>{TeamStore.structure.length}</Statistic.Value>
                  <Statistic.Label>Teams</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{AccountStore.allUsers.length}</Statistic.Value>
                  <Statistic.Label>Users</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <h4>Email Campaigns</h4>
                <Statistic.Group widths={1}>
                <Statistic>
                  <Statistic.Value>{EmailStore.allCampaigns.filter(i => !i.completed).length}</Statistic.Value>
                  <Statistic.Label>Campaigns</Statistic.Label>
                </Statistic>
                </Statistic.Group>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Notifications/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
                <Scheduled/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
