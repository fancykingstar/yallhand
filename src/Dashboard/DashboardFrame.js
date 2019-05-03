import React from "react";
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom"
import { Segment, Grid, Header, Icon, Statistic, Dropdown, Button, Input } from "semantic-ui-react";
import { Scheduled } from "./Scheduled"
import Notifications from "./Notifications"
import { Line, Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import {apiCall} from "../DataExchange/Fetch";
import CreateContent from "../SharedUI/ManageContent/CreateContent";
import moment from "moment"
import _ from "lodash";
import "./style.css";

@inject("AccountStore", "AnnouncementsStore", "PoliciesStore", "TeamStore", "EmailStore", "UIStore")
@observer
class DashboardFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {createContent: "announcement"};
    const {AccountStore} = this.props;
    this.getData = (startDate=Date.now() - 2592000000, endDate=Date.now()) => apiCall("itslogs/views/analyticssummary", "POST", {accountID: AccountStore.account.accountID, startDate, endDate})
      .then(result => result.json().then(data => {
          AccountStore.loadDashboardData(data)
      }));
  }
  componentDidMount(){
    this.getData()
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
          data: AccountStore.dashboardData.sentiment_total === undefined? null : [AccountStore.dashboardData.sentiment_total[0], AccountStore.dashboardData.sentiment_total[1], AccountStore.dashboardData.sentiment_total[2] ],
          backgroundColor: ["#FF6384", "#0BCDFD","#B908FA"]
      }],

  };

  const getLabel = (data) => {
    let label = ""
   try {
   if(data.type === "announcement"){label = AnnouncementsStore._getAnnouncement(data.contentID).label}
   else if(data.type === "policy"){label = PoliciesStore._getPolicy(data.contentID).label}
   }
   catch(error) {
       label = ""
   }
//    else {return "No label available"}
   return label === "" || label === undefined? "obsoleted data" : label
}

    const data =  
    {
      
      labels: AccountStore.dashboardData.length === 0? [] : AccountStore.dashboardData.counts_by_date.map(i => i.date_friendly),
      datasets: [
        {
          label: 'Email opens',
          fill: false,
          data: AccountStore.dashboardData.length === 0? [] : AccountStore.dashboardData.counts_by_date.map(i => ({x: i.date_friendly, y: i.email_count})),
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
      },
      {
        label: 'Portal Views',
        fill: false,
        data: AccountStore.dashboardData.length === 0? [] : AccountStore.dashboardData.counts_by_date.map(i => ({x: i.date_friendly, y: i.portal_count})),
        borderColor: 'rgba(11, 205, 253, 1)',
        borderWidth: 2
    },
    ]
  }

    const createcontent = this.state.createContent === "announcement"? <div id="create annc"><CreateContent invisible mode="announcement"/></div> : <CreateContent invisible mode="policy"/>
    const sentimentPercentage = (sentiment) => {
      if(AccountStore.dashboardData.length === 0){return 0}
      const total = AccountStore.dashboardData.sentiment_total[0] + AccountStore.dashboardData.sentiment_total[1] + AccountStore.dashboardData.sentiment_total[2]  
      return Math.round(AccountStore.dashboardData.sentiment_total[sentiment] / total * 100)
    }
    const topContent = 
      _.sortBy( 
        _.uniqBy(AccountStore.dashboardData.total_portal_views, "contentID")
        .map(i => ({contentID: i.contentID, type: i.type, total: AccountStore.dashboardData.total_portal_views.filter(x => x.contentID === i.contentID).length}))
        , "total").reverse().slice(0, 5).map(content => 
                <Grid.Row>
                  <Grid.Column width={13}> <p>{getLabel(content)}</p> </Grid.Column>
                  <Grid.Column> <h4><CountUp duration={1} decimals={0} end={content.total} /></h4> </Grid.Column>
                </Grid.Row>
        )

    return (
      <div style={{ paddingRight: 10 }}>
        {createcontent}
        <Header
          style={{padding: 0, margin: 0}}
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
        options={{ maintainAspectRatio: false, legend: false, scales:{xAxes:[{display: false}] }}}
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
                {topContent.length === 0? <span>No Data Yet</span> : topContent}
          
             
              
             
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
                      <Icon style={{color:"#FF6384"}} name="smile outline"/>{Number.isNaN(sentimentPercentage(2))? 0 : sentimentPercentage(2)}% 
                    </Grid.Column>
                    <Grid.Column>
                    <Icon style={{color:'#0BCDFD'}} name="meh outline"/>{Number.isNaN(sentimentPercentage(1))? 0 : sentimentPercentage(1)}% 
                    </Grid.Column>
                    <Grid.Column>
                    <Icon style={{color:'#B908FA'}} name="frown outline"/>{Number.isNaN(sentimentPercentage(0))? 0 : sentimentPercentage(0)}% 
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
                  <Statistic.Label>{AccountStore.dashboardData.length === 0? 0 : AccountStore.dashboardData.sentiment_total[0] + AccountStore.dashboardData.sentiment_total[1] + AccountStore.dashboardData.sentiment_total[2]} TOTAL</Statistic.Label>
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