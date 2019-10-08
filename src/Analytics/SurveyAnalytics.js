import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header,Icon, Segment, List, Rating} from "semantic-ui-react";
import { SearchBox } from "../SharedUI/SearchBox"
import { CampaignDetails } from "../SharedUI/CampaignDetails";
import { UIStore } from "../Stores/UIStore";
import Slider from "react-slick";

import {SurveyStore} from "../Stores/SurveyStore";
import {SortingChevron} from "../SharedUI/SortingChevron";
import TimeAgo from 'react-timeago'


export class SurveyAnalytics extends React.Component {
  constructor(props){
    super(props)
    this.state={searchValue: "", data: [], slideIndex: 0, updateCount: 0, surveyDetail: ""}
    this.clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
    this.sort = (controller, direction) => {
      const param = controller
      if(direction === "Lowest") { this.state.data.slice().sort((a,b) => (a[param] > b[param])? 1 : -1); }
      else { this.state.data.slice().sort((a,b) => (a[param] < b[param])? 1 : -1); } } 
  }

  // surveysNoStart = (survey) => survey.instances.length - survey.responses_by_instance.length;
  // surveysCompleted = (partially, survey) => survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>partially? !i.completed: i.completed).length : 0
 
  getPercentage = (array, val) => {
    const total = array.reduce(function(acc, val) { return acc + val; }, 0);
    return parseFloat(val/total * 100).toFixed(1);
  }

  rowSelected = (survey) => {
    this.setState({surveyDetail: survey});
    this.slider.slickGoTo(1);
  }


  componentDidMount(){
    this.sort("_updated", "Highest");
    const data = SurveyStore.allSurveys
    this.setState({data});
  }


  render() {
    const {searchValue, data, surveyDetail} = this.state;




    const searchFilter = (all) => {
      if(searchValue === "") return all
      else return all.filter(i => i.label.toLowerCase().includes(searchValue.toLowerCase()))
  }

    const settings_components_slide = {
      dots: false,
      draggable: false,
      arrows: false,
      infinite: false,
      speed: 250,
      swipeToSlide: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: () =>
        this.setState(state => ({ updateCount: state.updateCount + 1 })),
      beforeChange: (current, next) => this.setState({ slideIndex: next })
  };



    const rows = searchFilter(data).map(survey => {
      return (
        <Table.Row key={"survey" + giveMeKey()} onClick={e => this.rowSelected(survey)}>
          <Table.Cell style={{fontSize: "1em !important" , fontFamily: "Rubik, sans-serif" }}  >
              {survey.label}
          </Table.Cell>
          <Table.Cell >{survey.instances.length === 0? "Never" : <TimeAgo date={Math.max(...survey.instances.map(i=>i.sent))} />}</Table.Cell>
          <Table.Cell >{survey._surveys}</Table.Cell>
          <Table.Cell >{survey._instances}</Table.Cell>
          <Table.Cell >{survey._noStart}</Table.Cell>
          <Table.Cell >{survey._partial}</Table.Cell>
          <Table.Cell >{survey._completed}</Table.Cell>
          <Table.Cell >{survey.instances.length === 0 || !Math.max(...survey.instances.map(i=>i.deadline)) ? "No Current Deadlines" : <TimeAgo date={Math.max(...survey.instances.map(i=>i.deadline))} />}</Table.Cell>
          </Table.Row>
        )
      })

      const userList = (list) => 
      <Accordion>
        <Accordion.Title> Users </Accordion.Title>
        <Accordion.Content>
            <List>
                {list.map(user => <List.Item>{user}</List.Item>)}
            </List>
        </Accordion.Content>
      </Accordion>

      const questionDetails = (surveyItems) => surveyItems.map(surveyItem => 
      <>
      <h5>{surveyItem.q}</h5>
      {surveyItem.resType === "scale" && surveyItem.scaleConfig !== "star"? `1=${surveyItem.scaleLabels_lo} ${surveyItem.scaleConfig.includes(10)? "10":"5"}=${surveyItem.scaleLabels_hi}`:null}
        <Table compact basic='very'>
        <Table.Header>
              <Table.HeaderCell>Response</Table.HeaderCell>
              <Table.HeaderCell>Percentage</Table.HeaderCell>
              <Table.HeaderCell>Count</Table.HeaderCell>
            </Table.Header>
          <Table.Body>
          {Object.keys(surveyItem._responses).map(res =>
            <Table.Row>
              <Table.Cell collapsing >{surveyItem.scaleConfig==="star"? <Rating icon='star' disabled defaultRating={res} maxRating={5} /> : res}</Table.Cell>
              <Table.Cell collapsing >{surveyItem._responses[res].percentage}%</Table.Cell>
              <Table.Cell collapsing><p>{`(${surveyItem._responses[res].count}) responses `}</p></Table.Cell>
            </Table.Row>
          )}
          </Table.Body>
        </Table>

      </>
      )
    return (
      <div>
         <Slider ref={slider => (this.slider = slider)} {...settings_components_slide}>
           <div>
           <Header
          as="h2"
          content="Survey Performance"
        />
                   <div style={UIStore.responsive.isMobile? null : {float: 'right', paddingRight: 10, paddingBottom: 15,display: "inline-block"}}>     <SearchBox value={searchValue} output={val => this.setState({searchValue: val})}/></div>
     
          <Table selectable basic="very" >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Last Sent <span> <SortingChevron onClick={e => this.sort("_updated", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell>Question Count <span><SortingChevron onClick={e => this.sort("_surveys", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell>Survey Count <span><SortingChevron onClick={e => this.sort("_instances", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell>Not Started <span><SortingChevron onClick={e => this.sort("_noStart", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell>Partially Completed <span><SortingChevron onClick={e => this.sort("_partial", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell>Completed <span><SortingChevron onClick={e => this.sort("_completed", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell>Deadline <span><SortingChevron onClick={e => this.sort("_deadline", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows}
            </Table.Body>
          </Table>

          </div>
          <div>
          <Icon
                name="arrow circle left"
                color="blue"
                size="large"
                onClick={() => this.slider.slickGoTo(0)} alt="Go back"
              />
              <br/>
              <Header as="h2" content={surveyDetail && surveyDetail.label}/>

              <Segment>
              <List horizontal>
                  <List.Item>
                    <List.Content>
                      <List.Header>Not Started</List.Header>
                      {`${this.getPercentage([surveyDetail._noStart, surveyDetail._partial, surveyDetail._completed] ,surveyDetail._noStart)}%`}
                      <p style={{fontSize: ".7em"}}>{`(${surveyDetail._noStart} Surveys)`}</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    {/* <Image avatar src='/images/avatar/small/christian.jpg' /> */}
                    <List.Content>
                      <List.Header>Partially Completed</List.Header>
                      {`${this.getPercentage([surveyDetail._noStart, surveyDetail._partial, surveyDetail._completed] ,surveyDetail._partial)}%`}
                      <p style={{fontSize: ".7em"}}>{`(${surveyDetail._partial} Surveys)`}</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    {/* <Image avatar src='/images/avatar/small/matt.jpg' /> */}
                    <List.Content>
                      <List.Header>Completed</List.Header>
                      {`${this.getPercentage([surveyDetail._noStart, surveyDetail._partial, surveyDetail._completed] ,surveyDetail._completed)}%`}
                      <p style={{fontSize: ".7em"}}>{`(${surveyDetail._completed} Surveys)`}</p>
                    </List.Content>
                  </List.Item>
                </List>
              </Segment>
        
              <Segment>
              {surveyDetail && questionDetails(surveyDetail.surveyItems)}
              </Segment>
          </div>

          </Slider>
      </div>
    );
  }
}
