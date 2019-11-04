import _ from "lodash";
import {sortByUTC} from "./SortByUTC";

  export const calculateAnalytics = (allSurveys) => {
    const surveysNoStart = (survey) => survey.instances.length - survey.responses_by_instance.length;
    const surveysCompleted = (partially, survey) => survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>partially? !i.completed: i.completed).filter(i=>i.data).length : 0
    const surveysCancelled = (survey) => survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>!i.data).length : 0
    const getPercentage = (array, val) => {
      const total = array.reduce(function(acc, val) { return acc + val; }, 0);
      return parseFloat(val/total * 100).toFixed(1);
    }

    let calculatedSurveys = [];

    allSurveys.forEach(survey => {
      const surveyAnalytics = {
        _updated: survey.instances.length === 0? 0 :  Math.max(...survey.instances.map(i=>i.sent)),
        _surveys: survey.surveyItems.length,
        _instances: survey.instances.length,
        _noStart: surveysNoStart(survey),
        _partial: surveysCompleted(true, survey),
        _completed: surveysCompleted(false, survey),
        _cancelled: surveysCancelled(survey),
        _deadline: survey.instances.length === 0? "No Current Deadlines" : Math.max(...survey.instances.map(i=>i.deadline))
      }

      ///SurveyItems
      let calculatedSurveyItems = [];
      survey.surveyItems.forEach(surveyItem => {
        const id = surveyItem._id;

        //Collect Responses
        let allResponses = []; ///returns an array of responses [{id: {response:}}]
        let responsesByUser= {};
        survey.responses_by_instance.forEach(instance => {
        if(!instance.data) return;
        Object.keys(instance.data)
          .filter(res => res === id)
          .forEach(res => {
          const r = instance.data[res].response;
          allResponses.push(r);
          if(responsesByUser[r])  responsesByUser[r] = [...responsesByUser[r], ...[survey.instances.filter(i=>i.instanceID === instance.instanceID)[0].userID]];
          else responsesByUser[r] = [survey.instances.filter(i=>i.instanceID === instance.instanceID)[0].userID];
        })
      });
      const counts = _.countBy(allResponses);
      let results = {};
      Object.keys(counts).forEach(res => {
        results[res] = {
          count: counts[res],
          percentage: getPercentage(Object.values(counts), counts[res]), 
          users: responsesByUser[res],
        }
      })
      const _participation_percent = getPercentage([survey.instances.length], allResponses.length)
      const _inactive_users = survey.instances
        .filter(inst => !survey.responses_by_instance.map(x=>x.instanceID).includes(inst.instanceID))
        .map(inst => inst.userID);
      calculatedSurveyItems.push(Object.assign(surveyItem, {_responses: results, _participation_percent, _inactive_users}))
      })
      surveyAnalytics.surveyItems = calculatedSurveyItems;
      calculatedSurveys.push(Object.assign(survey, surveyAnalytics));
    })
    return sortByUTC(calculatedSurveys, "newest");
  }

