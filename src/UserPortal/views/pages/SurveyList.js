import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import {Survey} from "../components/Survey";
import {SurveyStore} from "../../../Stores/SurveyStore";
import Paper from '@material-ui/core/Paper';


class SurveyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           SurveyData: [],
         
        }
     }
     componentDidMount() {
        this.setState({
           SurveyData: SurveyStore.allSurveys,
        
        })
     }


   render() {
       const {SurveyData} = this.state;
      return (
         <Layout pageTitle={"Surveys"}>
            <div style={{paddingTop: 20}} className="container">
               <div className="page_container">
          
               {(SurveyData.length) ? SurveyData.map((item, index) => 
                              
                              <Paper style={{padding: 20, borderRadius: 8}} elevation={4}>
                              <Survey data={item} index={index}/>
                              </Paper>
                           ) : ('')}
               </div>
            </div>
         </Layout>
      );
   }
}

export default SurveyList;
