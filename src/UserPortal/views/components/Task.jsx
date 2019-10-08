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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import TimeAgo from 'react-timeago';


export class Task extends React.Component {
    constructor(props){
        super(props);
        this.state={data: this.props.data};
    }

    ///REMOVE STATE AND USE PROPS
    
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

        const update = (item, val) => {
            const newItem = Object.assign(item, {executed: val})
            console.log("newItem", newItem)
            let restOfState = this.state.data.surveyItems.filter(i => i._id !== item._id);
            restOfState.push(newItem);
            const newState = Object.assign(this.state, {surveyItems: restOfState});
            this.setState(newState);
        }

        // const answerOptions = (type, data) => ({
        //     scale10: <SliderScale max={10} minLabel={data.scaleLabels_lo} maxLabel={data.scaleLabels_hi} output={val=>recordResponse(val, data)} />,
        //     scale5: <SliderScale max={5} minLabel={data.scaleLabels_lo} maxLabel={data.scaleLabels_hi} output={val=>recordResponse(val, data)} />,
        //     star: <StarRating output={val=>recordResponse(val, data)} />,
        //     text: <Input placeholder="Enter your response…" type="text" name="description" id="description" output={e=>recordResponse(e.target.value, data)} />,
        //     yesno: <Binary negLabel="No" posLabel="Yes" output={val=>recordResponse(val, data)}  />,
        //     truefalse: <Binary negLabel="False" posLabel="True" output={val=>recordResponse(val, data)}  />,
        //     thumbsupdown: <Binary thumbs={true} output={e=>recordResponse(val, data)}  />,
        //     custom: <MultiChoice answeroptions={data.resChoices} output={val=>recordResponse(val, data)}/>
        // }[type]) ;

        // const answerKey = (item) => {
        //     if(item.resType === "text") return "text";
        //     else return item.resType === "multichoice"? item.multiConfig : item.scaleConfig;
        // }
        const tasklistitem = (item, i, completed) => 
            <ListItem key={"task_item_id" + i} dense button>
                 <ListItemIcon>
       
              <Checkbox
                edge="start"
                checked={item.executed}
                tabIndex={-1}
                disableRipple
                disabled={item.executed}
                onChange={e=> update(item, true)}
                // inputProps={{ 'aria-labelledby': labelId }}
                />
                </ListItemIcon>
            <ListItemText id={item.task_label} primary={item.task_label} primaryTypographyProps={{ style: {color: completed? "#ABACAB":"black", textDecoration: completed? "line-through": "initial"} }} />
            {!completed? null :
            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="comments" onClick={e=> update(item, false)}>
                <UndoIcon />
            </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>

        return (
            <div className={"servay_group"} key={`survey_q ${this.props.index}`}>
            <div className="inner_page_content_title">
               <h5>{this.state.data.label}</h5>
               <p><TimeAgo date={this.state.data.updated} /></p>
            </div>
            <div className="survey_group_questions">
                <List>
                    {this.state.data.surveyItems.filter(task => !task.executed).map((task, i) => tasklistitem(task, i, false))}
                    
                </List>
                {!this.state.data.surveyItems.filter(task => task.executed).length? null :
                <>
                <Divider/>
                <List >
                <ListSubheader component="div" id="nested-list-subheader">
                    Completed
                    </ListSubheader>
                    {this.state.data.surveyItems.filter(task => task.executed).map((task, i) => tasklistitem(task, i, true))}
                </List>
                </>
                }
        </div>
         </div>
        )
    }
}


