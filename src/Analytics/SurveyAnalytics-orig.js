import React from "react"
import { Header } from "semantic-ui-react";
import {SurveyStore} from "../Stores/SurveyStore";
import TimeAgo from 'react-timeago'
import MUIDataTable from "mui-datatables";
import _ from "lodash";

export class SurveyAnalytics extends React.Component {
    render(){
       
        const surveysNoStart = (survey) => {
            return survey.instances.length - survey.responses_by_instance.length;
        };
        
        const surveysCompleted = (partially, survey) => {
            return survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>partially? !i.completed: i.completed).length : 0
        };

        const surveysDuration = (survey) => {
            return 
        }
      
      
        const columns = ["Title","Last Sent","Question Count", "Surveys Sent", "Not Started","Partially Completed", "Completed", "Deadline"];
        const data = 
            SurveyStore.allSurveys.map(survey => 
                [survey.label, 
                    survey.instances.length === 0? "Never" : <TimeAgo date={Math.max(...survey.instances.map(i=>i.sent))} />, 
                    survey.surveyItems.length, 
                    survey.instances.length,
                    surveysNoStart(survey),
                    surveysCompleted(true, survey),
                    surveysCompleted(false, survey),
                    survey.instances.length === 0? "No Current Deadlines" : <TimeAgo date={Math.max(...survey.instances.map(i=>i.deadline))} />, 

                
                    // survey.recipients.length, 0, 0, 0, 0
                ])
            
        const options = {
        elevation: 1,
        selectableRows: "none",
        filter:true,
        filterType: 'dropdown',
        filterList: [["active"]],
        print: false,
        responsive: "scrollMaxHeight",
        viewColumns: false,
        download: false,
        //   onRowClick: (i, data) => handleClick(SurveyStore.allSurveys[data.rowIndex])
        };
        return(
            <React.Fragment>
            <div>
            
            <Header
            as="h2"
            content="Survey Performance"
            />
              <div style={{ marginTop: 15 }}>
          <MUIDataTable
            data={data}
            columns={columns}
            options={options}
          />
        </div>
       
      </div>
      </React.Fragment>
        )
    }
}
