import React from "react";
import {inject, observer} from "mobx-react"
import UTCtoFriendly from "../SharedCalculations/UTCtoFriendly"
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { Table, Header,Icon, Segment, List, Rating, Modal} from "semantic-ui-react";
import { SearchBox } from "../SharedUI/SearchBox"
import { CampaignDetails } from "../SharedUI/CampaignDetails";
import { UIStore } from "../Stores/UIStore";
import Slider from "react-slick";

import {SurveyStore} from "../Stores/SurveyStore";
import {TaskStore} from "../Stores/TaskStore";
import {AccountStore} from "../Stores/AccountStore";
import {SortingChevron} from "../SharedUI/SortingChevron";
import TimeAgo from 'react-timeago'


export class SurveyAnalytics extends React.Component {
  constructor(props){
    super(props)
    this.state={searchValue: "", data: [], slideIndex: 0, updateCount: 0, surveyDetail: "", userList: [], displayUsers: false, sortsToggled:[]}
    this.clickRate = (camp) => Number.isNaN(Math.round(camp.clicks / camp.total_views * 100))? 0 : Math.round(camp.clicks / camp.total_views * 100)
    this.sort = (param) => {
      
      if (this.state.sortsToggled.includes(param)) this.setState({sortsToggled: this.state.sortsToggled.filter(i=>i !== param)});
      else (this.setState({sortsToggled: [...this.state.sortsToggled, ...[param]]}))
      if(this.state.sortsToggled.includes(param)) { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] > b[param])? 1 : -1) })}
      else { this.setState({data: this.state.data.slice().sort((a,b) => (a[param] < b[param])? 1 : -1)}) }  
  }
  
}

  // surveysNoStart = (survey) => survey.instances.length - survey.responses_by_instance.length;
  // surveysCompleted = (partially, survey) => survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>partially? !i.completed: i.completed).length : 0
 
  getPercentage = (array, val) => {
    const total = array.reduce(function(acc, val) { return acc + val; }, 0);
    const result = parseFloat(val/total * 100).toFixed(1);
    return result ==="NaN"? "0": result;
  }

  rowSelected = (survey) => {
    this.setState({surveyDetail: survey});
    this.slider.slickGoTo(1);
  }


  componentDidMount(){
    this.sort("_updated", "Highest");
    const data = this.props.mode === "survey"? SurveyStore.allSurveys : TaskStore.allTasks
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
      beforeChange: (current, next) => this.setState({ slideIndex: next }),
  };



    const rows = searchFilter(data).map(survey => {
      return (
        <Table.Row disabled={!survey.instances.length} key={"survey" + giveMeKey()} onClick={e => this.rowSelected(survey)}>
          <Table.Cell width={4} style={{fontSize: "1em !important" , fontFamily: "Rubik, sans-serif" }}  >
              {survey.label}
          </Table.Cell>
          <Table.Cell >{survey.instances.length === 0? "Never" : <TimeAgo date={Math.max(...survey.instances.map(i=>i.sent))} />}</Table.Cell>
          <Table.Cell >{survey._surveys}</Table.Cell>
          <Table.Cell >{survey._instances}</Table.Cell>
          <Table.Cell >{survey._noStart}</Table.Cell>
          <Table.Cell >{survey._partial}</Table.Cell>
          <Table.Cell >{survey._completed}</Table.Cell>
          <Table.Cell >{survey.instances.length === 0 || !Math.max(...survey.instances.map(i=>i.deadline)) ? "None" : <TimeAgo date={Math.max(...survey.instances.map(i=>i.deadline))} />}</Table.Cell>
          </Table.Row>
        )
      })

      const userList = (userIDs) => 
            <List>
                {userIDs.map(userID => <List.Item>{AccountStore._getDisplayName(userID)}</List.Item>)}
            </List>

      const questionDetails = (surveyItems, anon) => surveyItems.map(surveyItem => 
      <div style={{paddingTop: 30, paddingBottom: 30}}>
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
               <Modal closeIcon open={this.state.displayUsers} onClose={()=>this.setState({displayUsers: false})}>
                 <Modal.Header>
                   Users with selected response
                 </Modal.Header>
                 <Modal.Content>
                 {userList(this.state.userList)}
                 </Modal.Content>
             
              </Modal>
              {surveyItem.scaleConfig==="star" && surveyItem.resType === "scale" && <Table.Cell width={4} collapsing ><Rating icon='star' disabled defaultRating={res} maxRating={5} /></Table.Cell>}
              {surveyItem.scaleConfig!=="star" && surveyItem.resType === "scale" && <Table.Cell width={4} collapsing >{res}</Table.Cell>}
              {surveyItem.resType === "multichoice" && surveyItem.multiConfig === "thumbsupdown" && <Table.Cell width={4} collapsing >{res? "👍":"👎"}</Table.Cell> }
              {surveyItem.resType === "multichoice" && surveyItem.multiConfig === "truefalse" && <Table.Cell width={4} collapsing >{res? "True":"False"}</Table.Cell> }
              {surveyItem.resType === "multichoice" && surveyItem.multiConfig === "yesno" && <Table.Cell width={4} collapsing >{res? "Yes":"No"}</Table.Cell> }
              {surveyItem.resType === "multichoice" && surveyItem.multiConfig === "custom" && <Table.Cell width={4} collapsing >{res}</Table.Cell> }
              {surveyItem.resType === "text" && <Table.Cell width={4} collapsing >{res}</Table.Cell> }
              <Table.Cell width={4} collapsing >{surveyItem._responses[res].percentage}%</Table.Cell>
              {anon?
              <Table.Cell width={4} collapsing><p>{`(${surveyItem._responses[res].count}) responses `}</p></Table.Cell>
              :
              <Table.Cell width={4} onClick={()=>this.setState({displayUsers: true, userList: surveyItem._responses[res].users})} collapsing><p style={{color: "#2fc7f8"}}>{`(${surveyItem._responses[res].count}) responses `}</p></Table.Cell>
              }
           
            </Table.Row>
          )}
          </Table.Body>
        </Table>

      </div>
      )

      const taskDetails = (surveyItems, anon) => 
        <div style={{paddingTop: 30, paddingBottom: 30}}>
         <Table compact basic='very'>
          <Table.Header>
                <Table.HeaderCell>Task</Table.HeaderCell>
                <Table.HeaderCell>Participation Rate</Table.HeaderCell>
                <Table.HeaderCell>Completed</Table.HeaderCell>
                <Table.HeaderCell>Awaiting</Table.HeaderCell>
              </Table.Header>
            <Table.Body>
            {surveyItems.map(surveyItem => 
            // {Object.keys(surveyItem._responses).map(res =>
              <Table.Row>
                 <Modal closeIcon open={this.state.displayUsers} onClose={()=>this.setState({displayUsers: false})}>
                   <Modal.Header>
                     Users who completed this task
                   </Modal.Header>
                   <Modal.Content>
                   {userList(this.state.userList)}
                   </Modal.Content>
               
                </Modal>

                <Table.Cell width={4} collapsing >{surveyItem.q}</Table.Cell>
                <Table.Cell width={4} collapsing >{surveyItem._participation_percent === "NaN"? "0":surveyItem._participation_percent }%</Table.Cell>
                {anon?
                <Table.Cell width={4} collapsing><p>{`(${surveyItem._responses.true.count}) responses `}</p></Table.Cell>
                :
                <Table.Cell width={4} onClick={()=>this.setState({displayUsers: true, userList: surveyItem._responses.true.users})} collapsing><p style={{color: "#2fc7f8"}}>{`(${surveyItem._responses.true? surveyItem._responses.true.count: "0"}) responses `}</p></Table.Cell> 
                }
                  {anon?
                <Table.Cell width={4} collapsing><p>{`(${surveyItem._inactive_users.length}) responses `}</p></Table.Cell>
                :
                <Table.Cell width={4} onClick={()=>this.setState({displayUsers: true, userList: surveyItem._inactive_users})} collapsing><p style={{color: "#2fc7f8"}}>{`(${surveyItem._inactive_users.length}) responses `}</p></Table.Cell> 
                }
             
              </Table.Row>
            )}
            </Table.Body>
          </Table>
  
        </div>
        

    return (
  
      <div>
      
      <Slider ref={slider => (this.slider = slider)} {...settings_components_slide}>
           <div>
           <Header
          as="h2"
          content={`${this.props.mode === "survey"? "Survey" : "Task"} Performance`}
        />
                   <div style={UIStore.responsive.isMobile? null : {float: 'right', paddingRight: 10, paddingBottom: 15,display: "inline-block"}}>     <SearchBox value={searchValue} output={val => this.setState({searchValue: val})}/></div>
          <div style={{overflowX: "auto", width: "100%"}}>
          <Table selectable basic="very" >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Last Sent <span> <SortingChevron onClick={e => this.sort("_updated", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Queries<span><SortingChevron onClick={e => this.sort("_surveys", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Recipients<span><SortingChevron onClick={e => this.sort("_instances", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}><span>Not Started<SortingChevron onClick={e => this.sort("_noStart", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Partial<span><SortingChevron onClick={e => this.sort("_partial", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Completed <span><SortingChevron onClick={e => this.sort("_completed", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell style={{whiteSpace:"nowrap"}}>Deadline <span><SortingChevron onClick={e => this.sort("_deadline", e)}/></span></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows}
            </Table.Body>
          </Table>
          </div>
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
                      <p style={{fontSize: ".7em"}}>{`(${surveyDetail._noStart} ${surveyDetail.type === "survey"? "Survey":"Task List"}${surveyDetail._noStart === 1? "":"s"})`}</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Partially Completed</List.Header>
                      {`${this.getPercentage([surveyDetail._noStart, surveyDetail._partial, surveyDetail._completed] ,surveyDetail._partial)}%`}
                      <p style={{fontSize: ".7em"}}>{`(${surveyDetail._partial} ${surveyDetail.type === "survey"? "Survey":"Task List"}${surveyDetail._partial === 1? "":"s"})`}</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Header>Completed</List.Header>
                      {`${this.getPercentage([surveyDetail._noStart, surveyDetail._partial, surveyDetail._completed] ,surveyDetail._completed)}%`}
                      <p style={{fontSize: ".7em"}}>{`(${surveyDetail._completed} ${surveyDetail.type === "survey"? "Survey":"Task List"}${surveyDetail._completed === 1? "":"s"})`}</p>
                    </List.Content>
                  </List.Item>
                </List>
              </Segment>
              {surveyDetail && this.props.mode === "survey" && <Segment> {questionDetails(surveyDetail.surveyItems, surveyDetail.anonymous)} </Segment>}
              {surveyDetail && this.props.mode === "task" && <Segment> {taskDetails(surveyDetail.surveyItems, surveyDetail.anonymous)} </Segment>}
          </div>

         </Slider>
      </div>
    );
  }
}
