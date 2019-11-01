import React from 'react';


import {SliderScale} from "./Responses/Slider";
import {StarRating} from "./Responses/StarRating";
import {Binary} from "./Responses/Binary";
import {MultiChoice} from "./Responses/MultiChoice";

import TimeAgo from 'react-timeago';
import { apiCall } from '../../../DataExchange/Fetch.js';

import { UserStore } from "../../../Stores/UserStore";
import {SurveyStore} from "../../../Stores/SurveyStore";

import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import VisibilityOffRoundedIcon from '@material-ui/icons/VisibilityOffRounded';
import {  Button, Input } from 'reactstrap';


export class Survey extends React.Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() {
        const {label, surveyID, instances} = this.props.data;
        const instanceID = this.props.preview? "" : instances[0].instanceID;
        // const box_type = (this.props.box_type) ? this.props.box_type : 'announce';
        // var classes = (box_type === "announce") ? "announce_box " : (box_type === "suggession") ? "suggession_box" : '';
        // classes += " " + this.props.main_class;
        const recordResponse = (val, survey) => {
            let record = {}
            record[survey._id] = val;
            this.setState(record);
        }

        const answerOptions = (type, data) => ({
            scale10: <SliderScale max={10} minLabel={data.scaleLabels_lo} maxLabel={data.scaleLabels_hi} output={val=>recordResponse(val, data)} />,
            scale5: <SliderScale max={5} minLabel={data.scaleLabels_lo} maxLabel={data.scaleLabels_hi} output={val=>recordResponse(val, data)} />,
            star: <StarRating output={val=>recordResponse(val, data)} />,
            text: <Input placeholder="Enter your response…" type="text" name="description" id="description" onChange={e=>recordResponse(e.target.value, data)} />,
            yesno: <Binary negLabel="No" posLabel="Yes" output={val=>recordResponse(val, data)}  />,
            truefalse: <Binary negLabel="False" posLabel="True" output={val=>recordResponse(val, data)}  />,
            thumbsupdown: <Binary thumbs={true} output={val=>recordResponse(val, data)}  />,
            custom: <MultiChoice answeroptions={data.resChoices} output={val=>recordResponse(val, data)}/>
        }[type]) ;

        const answerKey = (item) => {
            if(item.resType === "text") return "text";
            else return item.resType === "multichoice"? item.multiConfig : item.scaleConfig;
        }

        const submit = async () => {
            if (UserStore.user.isAdmin) {
                this.setState({completed:true});
                return
            }
            const updated = Date.now();
            let response = {};
            await Object.keys(this.state).forEach(i => response[i] = {updated, response: this.state[i]});
            const payload = {surveyID, instanceID, response};
            await apiCall('surveys/response', 'POST', payload).then(res => {
                this.setState({completed:true});
                SurveyStore._dropSurvey(surveyID);
            })
        }

        const content =  <div className={"servay_group"} key={`survey_q ${this.props.index}`}>
        <div className="inner_page_content_title">
           <h5>{label}</h5>
           <p><TimeAgo date={this.props.data.updated} /></p>
  
        </div>
        <div className="survey_group_questions">
        {this.props.data.anonymous && <div style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}><p style={{fontSize: ".9em", color: "#abacab"}}><VisibilityOffRoundedIcon size="small"/> Responses are anonymous</p></div>}
        {this.props.data.surveyItems.map((item, innerIndex) => {
           return <div className="check_question" key={innerIndex}>
              <h6>{item.q}</h6>
              {answerOptions(answerKey(item), item)}
           </div>
        })}
    { !this.props.preview &&
    <div style={{padding: "25px 25px 15px 25px"}}>
    <Button outline color="primary" size="sm" onClick={()=>submit()}>
    Submit <DoneRoundedIcon fontSize="small"/>
  </Button>
    </div>
    }
    </div>
     </div>

        return (
            <Collapse ref="showSurvey" in={!this.state.completed}>
                { this.props.usePaper ? <Paper style={{padding: 20, borderRadius: 8, margin: 25}} elevation={4}>{content}</Paper> : content }
            </Collapse>
        )
    }
}


