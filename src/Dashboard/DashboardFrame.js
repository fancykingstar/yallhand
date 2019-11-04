import React from "react";
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom"
import { Segment, Header, Icon, Statistic, Dropdown, Button, Modal, Grid } from "semantic-ui-react";
import { Col, Row, Container } from "reactstrap";

import { Scheduled } from "./Scheduled"
import Notifications from "./Notifications"
import { Line, Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import {apiCall} from "../DataExchange/Fetch";
import CreateContent from "../SharedUI/ManageContent/CreateContent";
import {DateRange} from "../SharedUI/DateRange"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

import _ from "lodash";
// import "./style.css";

@inject("AccountStore", "AnnouncementsStore", "PoliciesStore", "TeamStore", "EmailStore", "UIStore", "UserStore")
@observer
class DashboardFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createContent: "announcement", 
      dateRange: ""
    };
    const {AccountStore} = this.props;

    this.getData = (startDate=Date.now() - 2592000000, endDate=Date.now()) => apiCall("itslogs/views/analyticssummary", "POST", {accountID: AccountStore.account.accountID, startDate, endDate})
      .then(result => result.json().then(data => {
        AccountStore.loadDashboardData(data)
          let dataset = AccountStore.dashboardData.counts_by_date
          this.setState({
            dateRange: `${dataset[0].date_friendly}-${dataset[dataset.length - 1].date_friendly}`,
          })
      }));
  }

  componentDidMount(){
    const {UIStore} = this.props;
    this.getData()
    window.scrollTo(0, 0);
    UIStore.set("dropdown", "dashboardOverview", 30);
  }


  render() {
    const {AccountStore, AnnouncementsStore, PoliciesStore,  UIStore, UserStore} = this.props


    const create = (type) => {
      if(type === "faq") this.props.history.push('panel/faqs/content/new')
      else if(type === "announcement") this.props.history.push('panel/announcements/content/new')
      else if(type === "survey") this.props.history.push('/panel/surveys/manage-survey')
      else if(type === "task") this.props.history.push('/panel/tasks/manage-task')
    }

    const onboardUser = () => {
      this.props.history.push("/panel/teams")
      UIStore.set("menuItem", "teamFrame", "onboard")
    }

    const createEmail = () => {
      this.props.history.push("/panel/email")
      UIStore.set("menuItem", "emailFrame", "send email")
    }

    const getDoughnut = () => [AccountStore.dashboardData.sentiment_total[0], AccountStore.dashboardData.sentiment_total[1], AccountStore.dashboardData.sentiment_total[2] ];
    const doughnutData =  {
      labels: [
        'Negative',
        'Neutral',
        'Positive'
    ],
      datasets: [{
          data: AccountStore.dashboardData.sentiment_total === undefined? null : getDoughnut(),
          backgroundColor: ["#e84393", "#0BCDFD","#B908FA"]
      }],

  };
  // const mockRates = {open: 96.4, click: 73.2}
  const openRate = AccountStore.dashboardData.total_recipient_count === undefined? 0 : Math.round(AccountStore.dashboardData.total_email_views.length / AccountStore.dashboardData.total_recipient_count * 100)
  const clickRate =AccountStore.dashboardData.total_email_views === undefined? 0 : Math.round(AccountStore.dashboardData.total_recipient_click / AccountStore.dashboardData.total_email_views.length * 100)
  const getLabel = (data) => {
    let label = ""
   try {
   if(data.type === "announcement"){label = AnnouncementsStore._getAnnouncement(data.contentID).label}
   else if(data.type === "policy"){label = PoliciesStore._getPolicy(data.contentID).label}
   }
   catch(error) {
       label = ""
   }

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
        {
          label: 'Survey Responses',
          fill: false,
          data: AccountStore.dashboardData.length === 0? [] : AccountStore.dashboardData.counts_by_date.map(i => ({x: i.date_friendly, y: i.survey_count})),
          borderColor: '#6610f2',
          borderWidth: 2
        },
        {
          label: 'Tasks Activity',
          fill: false,
          data: AccountStore.dashboardData.length === 0? [] : AccountStore.dashboardData.counts_by_date.map(i => ({x: i.date_friendly, y: i.task_count})),
          borderColor: '#ff9f1a',
          borderWidth: 2
        },
      ]
    }
    const createcontent = this.state.createContent === "announcement"? <div id="create annc"><CreateContent invisible mode="announcement"/></div> : <CreateContent invisible mode="policy"/>
    const sentimentPercentage = (sentiment) => {
      if(AccountStore.dashboardData.length === 0){return 0}
      const total = AccountStore.dashboardData.sentiment_total[0] + AccountStore.dashboardData.sentiment_total[1] + AccountStore.dashboardData.sentiment_total[2]  
      return UserStore.user.invitedBy !== "admin"? Math.round(AccountStore.dashboardData.sentiment_total[sentiment] / total * 100):{0: 11, 1:31,  2: 58}[sentiment]
    }
    const topContent = 
      _.sortBy( 
        _.uniqBy(AccountStore.dashboardData.total_portal_views, "contentID")
        .map(i => ({contentID: i.contentID, type: i.type, total: AccountStore.dashboardData.total_portal_views.filter(x => x.contentID === i.contentID).length}))
        , "total").reverse().slice(0, 5).map(content => 
                <Grid.Row key={giveMeKey()}>
                  <Grid.Column width={13}> <p>{getLabel(content)}</p> </Grid.Column>
                  <Grid.Column> <h4><CountUp duration={1} decimals={0} end={UserStore.user.invitedBy==="admin"? Math.floor(Math.random() * 627) + 3    :content.total} /></h4> </Grid.Column>
                </Grid.Row>
        )


    const closeCalendarModal = () => {
      UIStore.set("modal", "dashboardDates", false)
    }

    const updateData = (source, val1) => {
      if(source === "dropdown" && val1 !== "custom")  {
        UIStore.set("dropdown", "dashboardOverview", val1)
        this.getData(Date.now() - 2592000000 * {30:1, 60:2, 90:3}[val1])
      }

      if(source === "dropdown" && val1 === "custom")  {
        UIStore.set("modal", "dashboardDates", !UIStore.modal.dashboardDates)
      }
    }

    return (
      <div style={{ paddingRight: 10 }}>
        {createcontent}
        <Header
          as="h2"
          content="Dashboard"
          subheader="Activities and Information Overview"
        />
        <div className="dashboardShortcuts">
          <Segment>
            <Container>
              <Row>
                <Col md={2} className="text-center">
                <div onClick={() => createEmail()} > <div><Button circular color="blue" size="medium" icon="mail"/></div><h4>Send Email</h4> </div>
                </Col>
                <Col md={2} className="text-center" >
                  <div onClick={() => create("announcement")} > <div><Button circular color="blue" size="medium" icon="bullhorn"/></div><h4>New Announcement</h4> </div>
                </Col>
                <Col md={2} className="text-center">
                <div onClick={() => create("faq")} > <div><Button circular color="blue" size="medium" icon="question"/></div><h4>New FAQ</h4> </div>
                </Col>
                <Col md={2} className="text-center">
                <div onClick={() => create("survey")} > <div><Button circular color="blue" size="medium" icon="edit outline"/></div><h4>New Survey</h4> </div>
                </Col>
                <Col className="text-center">
                <div onClick={() => create("task")} > <div><Button circular color="blue" size="medium" icon="tasks"/></div><h4>New Task</h4> </div>
                </Col>
                <Col md={2} className="text-center" >
                <div onClick={() => onboardUser()} > <div><Button circular color="blue" size="medium" icon="user outline"/></div><h4>Onboard User</h4> </div>
                </Col>
              </Row>
            </Container>
          </Segment>
        </div>
        <div style={{paddingTop: 10}}>
          <Icon name="calendar alternate outline" color="blue"/>
          Last{" "}
          <Dropdown 
          options={[{"text": "30 days", "value": 30},{"text": "60 days", "value": 60},{"text": "90 days", "value": 90},{"text": "choose custom date range", "value": "custom"}]} 
          onChange={(e, val) => updateData("dropdown", val.value)}
          value={UIStore.dropdown.dashboardOverview} />
          <span onClick={() => UIStore.set("modal", "dashboardDates", !UIStore.modal.dashboardDates)} className="date-range font-800">{this.state.dateRange}</span>
          <Modal onClose={closeCalendarModal} open={UIStore.modal.dashboardDates} size='small'>
            <Modal.Content>
              <DateRange output={this.getData}/>
            </Modal.Content>
          </Modal>
        </div>
      
        <Segment>
          {" "}
          <Row>
            <Col sm={2}><Icon style={{color:"#e84393"}} name="square"/>Email Views </Col>
            <Col sm={2}><Icon style={{color:'#0BCDFD'}} name="square"/>Portal Views</Col>
            <Col sm={2}><Icon style={{color:'#6610f2'}} name="square"/>Survey Responses</Col>
            <Col sm={2}><Icon style={{color:'#ff9f1a'}} name="square"/>Task Activity</Col>
          </Row>
         
    
    
 
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
     <br/>
        <Grid className="grid-adjustment" columns="three" divided stackable>
          <Grid.Row>
            <Grid.Column>
              <Segment style={{minHeight: 300}}>
                <h4>All Email Campaigns</h4>
                <div style={{marginTop: "auto", minHeight:240, position: "relative"}}>
                  <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)"}}>
                    <Statistic.Group widths={1}>
                      <Statistic>
                        <Statistic.Value><CountUp duration={1} decimals={1} end={Number.isNaN(openRate)? 0: openRate} />%</Statistic.Value>
                        <Statistic.Label>Open Rate 
                        {/* <Icon name="arrow up" color="blue"/>+1% */}
                        </Statistic.Label>
                      </Statistic>
                      <Statistic style={{paddingTop: 10}}>
                        <Statistic.Value><CountUp duration={1} decimals={1} end={Number.isNaN(clickRate)? 0: clickRate} />%</Statistic.Value>
                        <Statistic.Label>Click Rate 
                          {/* <Icon name="arrow up" color="blue"/>+1% */}
                          </Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment style={{minHeight: 300}}>
                <h4>Most Viewed</h4>
                <Grid className="grid-adjustment" divided>
                {topContent.length === 0?  <Grid.Row> <Grid.Column width={13}> <p>No Data</p> </Grid.Column> </Grid.Row> : topContent}
                </Grid>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment style={{minHeight: 300}}>
                <div style={{marginTop: 0, paddingTop: 0, paddingBottom: 5}}>   <h4>All Content Sentiments</h4></div>
                <div style={{paddingBottom: 10}}> 
                  <Grid className="grid-adjustment" columns="equal">
                    <Grid.Row>
                      <Grid.Column>
                        <Icon style={{color:'#B908FA'}} name="smile outline"/>{Number.isNaN(sentimentPercentage(2))? 0 : sentimentPercentage(2)}% 
                      </Grid.Column>
                      <Grid.Column>
                        <Icon style={{color:'#0BCDFD'}} name="meh outline"/>{Number.isNaN(sentimentPercentage(1))? 0 : sentimentPercentage(1)}% 
                      </Grid.Column>
                      <Grid.Column>
                        <Icon style={{color:"#e84393"}} name="frown outline"/>{Number.isNaN(sentimentPercentage(0))? 0 : sentimentPercentage(0)}% 
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
                      <Statistic.Label>{AccountStore.dashboardData.length === 0? 0 : UserStore.user.invitedBy === "admin"? 621: AccountStore.dashboardData.sentiment_total[0] + AccountStore.dashboardData.sentiment_total[1] + AccountStore.dashboardData.sentiment_total[2]} TOTAL</Statistic.Label>
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