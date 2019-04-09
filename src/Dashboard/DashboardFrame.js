import React from "react";
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom"
import { Segment, Grid, Header, Icon, Statistic, Dropdown, Button, Input } from "semantic-ui-react";
import { Scheduled } from "./Scheduled"
import Notifications from "./Notifications"
import { Line, Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import "./style.css"
import CreateContent from "../SharedUI/ManageContent/CreateContent";


@inject("AccountStore", "AnnouncementsStore", "PoliciesStore", "TeamStore", "EmailStore", "UIStore")
@observer
class DashboardFrame extends React.Component {
  constructor(props){
    super(props)
    this.state = {createContent: "announcement"}
  }
  render() {
    const {AccountStore, AnnouncementsStore, PoliciesStore, TeamStore, EmailStore, UIStore} = this.props

    const createAnnc = () => {
      this.setState({createContent: "announcement"})
      UIStore.set("modal", "createContent", true)
    }

    const createFAQ = () => {
      this.setState({createContent: "policy"})
      UIStore.set("modal", "createContent", true)
    }

    const onboardUser = () => {
      this.props.history.push("/panel/teams")
      UIStore.set("menuItem", "teamFrame", "onboard")
    }

    const createEmail = () => {
      this.props.history.push("/panel/email")
      UIStore.set("menuItem", "emailFrame", "send email")
    }

    const doughnutData =  {
      datasets: [{
          data: [10, 20, 30],
          backgroundColor: ["#FF6384", "#0BCDFD","#B908FA"]
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Red',
          'Yellow',
          'Blue'
      ]
  };

    const data =  {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [{
          label: 'Email opens',
          fill: false,
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
      },
      {
        label: 'Portal Views',
        fill: false,
        data: [6, 13, 2, 2, 5, 8],
        borderColor: 'rgba(11, 205, 253, 1)',
        borderWidth: 2
    },
    ]
  }

    const createcontent = this.state.createContent === "announcement"? <div id="create annc"><CreateContent invisible mode="announcement"/></div> : <CreateContent invisible mode="policy"/>

    return (
      <div style={{ paddingRight: 10, overflow: "auto" }}>
        {createcontent}
        <Header
          as="h2"
          content="Dashboard"
          subheader="Activities and Information Overview"
        />
        <div className="dashboardShortcuts">
        <Segment width="100%">
        <Grid stackable columns={4}>
        <Grid.Row>
          <Grid.Column>
          <div style={{width: 155, margin: "auto"}}
          onClick={e => createEmail()}
          >
          <div style={{width: 50, margin: "auto"}} ><Button circular color="blue" size="huge" icon="mail"/></div>
          <div style={{width: "auto", margin: "auto", textAlign: "center"}}>   <h4 style={{padding: 0}}>Send Email</h4></div>
          </div>
          </Grid.Column>
          <Grid.Column>
          <div style={{width: 155, margin: "auto"}}
          onClick={e => createAnnc()}
          >
          <div style={{width: 50, margin: "auto"}} ><Button circular color="blue" size="huge" icon="bullhorn"/></div>
          <div style={{width: "auto", margin: "auto", textAlign: "center"}}>   <h4 style={{padding: 0}}>Create Announcement</h4></div>
          </div>
          </Grid.Column>
          <Grid.Column>
          <div style={{width: 155, margin: "auto"}}
          onClick={e => createFAQ()}
          >
          <div style={{width: 50, margin: "auto"}} ><Button circular color="blue" size="huge" icon="question"/></div>
          <div style={{width: "auto", margin: "auto", textAlign: "center"}}>   <h4 style={{padding: 0}}>Create FAQ</h4></div>
          </div>
          </Grid.Column>
          <Grid.Column 
          onClick={e => onboardUser()}
          >
          <div style={{width: 155, margin: "auto"}}>
          <div style={{width: 50, margin: "auto"}} ><Button circular color="blue" size="huge" icon="user outline"/></div>
          <div style={{width: "auto", margin: "auto", textAlign: "center"}}>   <h4 style={{padding: 0}}>Onboard User</h4></div>
          </div>
          </Grid.Column>
        </Grid.Row>
        
        </Grid>
        </Segment>
       

        
          

        </div>
        <div style={{paddingTop: 10}}>
        <Icon name="calendar alternate outline" color="blue"/>
        Last{" "}
      <Dropdown 
        options={[{"text": "30 days", "value": 30},{"text": "60 days", "value": 60},{"text": "90 days", "value": 90}]} 
        onChange={(e, val) => UIStore.set("dropdown", "dashboardOverview", val.value)}
        value={UIStore.dropdown.dashboardOverview} />
        <span style={{paddingLeft: 20}}>Or choose a date range</span>
        </div>
      
        <Segment>
        {" "}<Icon style={{color:"#FF6384"}} name="square"/>Email Views <Icon style={{color:'#0BCDFD'}} name="square"/>Portal Views
        <div style={{paddingTop: 10, minHeight: 200}}>
        <Line
        data={data}
        width={100}
        height={50}
        options={{ maintainAspectRatio: false, legend: false}}
      />
        </div>
        </Segment>
        <br/>
     
   
        <Grid columns="three" divided stackable>
         
          <Grid.Row>
            <Grid.Column>
              <Segment style={{minHeight: 300}}>
                <h4>All Email Campaigns</h4>
                <div style={{marginTop: "auto", minHeight:240, position: "relative"}}>
                <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)"}}>
                <Statistic.Group widths={1}>
                <Statistic>
                  <Statistic.Value><CountUp duration={1} decimals={1} end={AnnouncementsStore.allAnnouncements.length} />%</Statistic.Value>
                  <Statistic.Label>Open Rate <Icon name="arrow up" color="blue"/>+1%</Statistic.Label>
                </Statistic>
                <Statistic style={{paddingTop: 10}}>
                  <Statistic.Value><CountUp duration={1} decimals={1} end={PoliciesStore.allPolicies.length} />%</Statistic.Value>
                  <Statistic.Label>Click Rate <Icon name="arrow up" color="blue"/>+1%</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              </div>
                </div>
                
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment style={{minHeight: 300}}>
                <h4>Most Viewed</h4>
                <Grid divided>
                <Grid.Row>
                  <Grid.Column width={13}> <p>Content title 1 is very cool</p> </Grid.Column>
                  <Grid.Column> <h4><CountUp duration={1} decimals={0} end={421} /></h4> </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={13}> <p>Content title 2 is even more very cool</p> </Grid.Column>
                  <Grid.Column><h4><CountUp duration={1} decimals={0} end={311} /></h4></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={13}> <p>Content title 3 is super long and also very cool</p> </Grid.Column>
                  <Grid.Column><h4><CountUp duration={1} decimals={0} end={211} /></h4></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={13}> <p>Content title 2 is even more very cool</p> </Grid.Column>
                  <Grid.Column><h4><CountUp duration={1} decimals={0} end={311} /></h4></Grid.Column>
                </Grid.Row>
          
             
              
             
                </Grid>
               
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment style={{minHeight: 300}}>
                <div style={{marginTop: 0, paddingTop: 0, paddingBottom: 5}}>   <h4>All Sentiment Surveys</h4></div>
                <div style={{paddingBottom: 10}}> 
                <Grid columns="equal">
                  <Grid.Row>
                    <Grid.Column>
                      <Icon style={{color:"#FF6384"}} name="smile outline"/>20% 
                    </Grid.Column>
                    <Grid.Column>
                    <Icon style={{color:'#0BCDFD'}} name="meh outline"/>30% 
                    </Grid.Column>
                    <Grid.Column>
                    <Icon style={{color:'#B908FA'}} name="frown outline"/>50%
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                </div>
                <div style={{height: 220, position: "relative"}}>
                <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)"}}>
                <Doughnut 
                 data={doughnutData}
                 options={{legend: false}}
                />
                </div>
               
                <Statistic.Group widths={1}>
                <Statistic>
                  <Statistic.Label>22 TOTAL</Statistic.Label>
                </Statistic>
                </Statistic.Group>
                </div>
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
        <br/>
      </div>
    );
  }
}

export default withRouter(DashboardFrame)