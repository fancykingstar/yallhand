import React from 'react';
import * as constants from "../../constants/constants.js";
import { withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import {SliderScale} from "./Responses/Slider";
import {StarRating} from "./Responses/StarRating";
import {Binary} from "./Responses/Binary";
import {MultiChoice} from "./Responses/MultiChoice";
import { ItemExtra } from 'semantic-ui-react';
import TimeAgo from 'react-timeago';


export class Survey extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        // const box_type = (this.props.box_type) ? this.props.box_type : 'announce';
        // var classes = (box_type === "announce") ? "announce_box " : (box_type === "suggession") ? "suggession_box" : '';
        // classes += " " + this.props.main_class;
        const recordResponse = (val, survey) => {
            let record = {}
            record[survey._id] = val;
            this.setState(record);
            console.log(this.state);
        }

        const answerOptions = (type, data) => ({
            scale10: <SliderScale max={10} minLabel={data.scaleLabels_lo} maxLabel={data.scaleLabels_hi} output={val=>recordResponse(val, data)} />,
            scale5: <SliderScale max={5} minLabel={data.scaleLabels_lo} maxLabel={data.scaleLabels_hi} output={val=>recordResponse(val, data)} />,
            star: <StarRating output={val=>recordResponse(val, data)} />,
            text: <Input placeholder="Enter your response…" type="text" name="description" id="description" output={e=>recordResponse(e.target.value, data)} />,
            yesno: <Binary negLabel="No" posLabel="Yes" output={val=>recordResponse(val, data)}  />,
            truefalse: <Binary negLabel="False" posLabel="True" output={val=>recordResponse(val, data)}  />,
            thumbsupdown: <Binary thumbs={true} output={e=>recordResponse(val, data)}  />,
            custom: <MultiChoice answeroptions={data.resChoices} output={val=>recordResponse(val, data)}/>
        }[type]) ;

        const answerKey = (item) => {
            if(item.resType === "text") return "text";
            else return item.resType === "multichoice"? item.multiConfig : item.scaleConfig;
        }

        return (
            <div className={"servay_group"} key={`survey_q ${this.props.index}`}>
            <div className="inner_page_content_title">
               <h5>{this.props.data.label}</h5>
               <p><TimeAgo date={this.props.data.updated} /></p>
            </div>
            <div className="survey_group_questions">
            {this.props.data.surveyItems.map((item, innerIndex) => {
               return <div className="check_question" key={innerIndex}>
                  <h6>{item.q}</h6>
                  {answerOptions(answerKey(item), item)}
               </div>
            })}
        </div>
         </div>
        )
    }
}


