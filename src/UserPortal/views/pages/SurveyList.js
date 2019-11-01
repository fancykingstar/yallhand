import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import {Survey} from "../components/Survey";
import {SurveyStore} from "../../../Stores/SurveyStore";
import { EmptyPlaceholder } from '../components/EmptyPlaceholder';


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
                  {(SurveyData.length) ? 
                     SurveyData
                     .map((item, index) => <Survey data={item} index={index} usePaper/> ) : <EmptyPlaceholder type="survey"/> }
               </div>
            </div>
         </Layout>
      );
   }
}

export default SurveyList;
