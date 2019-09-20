import React from 'react';
import {inject,observer} from "mobx-react";
import {Segment, Button, Form, Header} from 'semantic-ui-react';
import { SurveyItem } from "./SurveyItem";
import {isEmpty} from 'lodash';
import { ChooseTargeting } from "../Email/ChooseTargeting";
import { DateTimeSelect } from "../SharedUI/DateTimeSelect";

@inject("DataEntryStore")
@observer
export class SurveyNewEdit extends React.Component {
    constructor(props){
        super(props);
        this.state=({items: []});
        const {DataEntryStore} = this.props;
        const survey = DataEntryStore.survey;
        this.addItem = () => {
            const modItems = this.state.items.slice();
            const i = this.state.items.length;
            modItems.push(<SurveyItem 
                index={i}
                error={
                    // !isEmpty(DataEntryStore.survey)? !DataEntryStore.survey[0].valid && 
                    DataEntryStore.survey.saveAttempt
                    // : false
                } 
                echostate={e=>DataEntryStore.set("survey",i, e)}/>)
            this.setState({items:modItems})
        }
    }
    componentDidMount(){
        const {DataEntryStore} = this.props;
        DataEntryStore.reset("survey")
        if(!this.state.items.length) this.addItem();
    }
    render(){
        const {DataEntryStore} = this.props;
        const survey = DataEntryStore.survey;
        // const items = this.props.data? null : <SurveyItem error={!isEmpty(survey)? !survey[0].valid && this.state.saveAttempt: false} echostate={e=>DataEntryStore.set("survey",0, e)}/>
     

        return(
            <div>
                <Header as="h2"
                style={{padding: 0, margin: 0}}
                >
                Survey builder
                <Header.Subheader>
                    Configure and send surveys to your employees
                </Header.Subheader>
                </Header>
                <Segment>
                
                <Form>
                <Form.Input label="Survey Title (Required)"
                        // value={DataEntryStore.emailCampaign.sendSubject}
                        // onChange={(e, val) =>
                        // DataEntryStore.set("emailCampaign", "sendSubject", val.value)
                        // }
                    />
                    </Form>
        
                        <div style={{paddingTop: "10px"}}><ChooseTargeting label="Survey" /></div>
                        <div style={{paddingTop: "10px"}}><span style={{fontWeight: 800}}>Deadline</span></div>
                    <div style={{marginTop: "-5px"}}>
                    <DateTimeSelect 
                    // value={val => DataEntryStore.set("emailCampaign", "sendNext", val) } 
                    value={e=> console.log(e)}
                    includeTime />
                    </div>
                    <div>
                    <Button disabled={!isEmpty(survey)? !Object.values(survey).filter(y => y.valid).length : true} primary>Launch</Button>
                    <Button onClick={e=> DataEntryStore.set("survey","saveAttempt", true)} primary>Save</Button>
                    <Button>Cancel</Button>
                    <Button>Stop</Button>
                </div>


                   


                </Segment>
                {this.state.items}
                <div style={{padding: "20px 0 20px"}}>
                    <Button primary circular icon='plus' onClick={()=>this.addItem()} />
                </div>
                
            </div>
        )
    }
}