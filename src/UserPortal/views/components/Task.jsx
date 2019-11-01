import React from 'react';

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
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';

import {surveys} from "../../../DataExchange/Down";
import { apiCall } from '../../../DataExchange/Fetch.js';
import { UserStore } from "../../../Stores/UserStore";

export class Task extends React.Component {
    constructor(props){
        super(props);
        this.props={};
        this.state={}; //only for completed
    }

    isCompleted(task,i) {
        const {surveyItems, instances, responses_by_instance} = this.props.data;
        const instanceID = instances[0].instanceID;
        const completed = () => {
            if(!responses_by_instance.length) return [];
            let anyRs = responses_by_instance.filter(i=>i.instanceID === instanceID);
            anyRs = !anyRs.length? {} : anyRs[0].data;
            return Object.keys(anyRs).filter(r => anyRs[r].response);
        }
        
        return completed().includes(task._id);
  
    }
    
    render() {
        const {label, surveyID, instances} = this.props.data;
        const instanceID = instances.length? instances[0].instanceID: "";

        const submit = async (item, val) => {
            const updated = Date.now();
            let response = {};
            response[item._id] = {updated, response: val};
            const payload = {surveyID, instanceID, response};
            await apiCall('surveys/response', 'POST', payload);
            await surveys(UserStore.user.accountID, UserStore.user.userID);
    
        }

        const tasklistitem = (item, i, completed) => 
            <ListItem key={"task_item_id" + i} dense button>
                 <ListItemIcon>
       
              <Checkbox
                edge="start"
                checked={completed}
                tabIndex={-1}
                disableRipple
                disabled={completed}
                onChange={e=> submit(item, true)}
                // inputProps={{ 'aria-labelledby': labelId }}
                />
                </ListItemIcon>
            <ListItemText id={item.q} primary={item.q} primaryTypographyProps={{ style: {color: completed? "#ABACAB":"black", textDecoration: completed? "line-through": "initial"} }} />
            {!completed? null :
            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="comments" onClick={e=> submit(item, false)}>
                <UndoIcon />
            </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>

            const content =    <div className={"servay_group"} key={`survey_q ${this.props.index}`}>
            <div className="inner_page_content_title">
               <h5>{this.props.data.label}</h5>
               <p><TimeAgo date={this.props.data.updated} /></p>
            </div>
            <div className="survey_group_questions">
                <List>
                    {this.props.data.surveyItems.filter((task, i) => !this.isCompleted(task, i)).map((task, i) => tasklistitem(task, i, false))}
                    
                </List>
                {!this.props.data.surveyItems.filter((task,i) => this.isCompleted(task, i)).length? null :
                <>
                <Divider/>
                <List >
                <ListSubheader component="div" id="nested-list-subheader">
                    Completed
                    </ListSubheader>
                    {this.props.data.surveyItems.filter((task,i) => this.isCompleted(task, i)).map((task, i) => tasklistitem(task, i, true))}
                </List>
                </>
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


