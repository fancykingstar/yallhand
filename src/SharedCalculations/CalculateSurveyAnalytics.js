import _ from "lodash";

  export const calculateAnalytics = (allSurveys) => {
    const surveysNoStart = (survey) => survey.instances.length - survey.responses_by_instance.length;
    const surveysCompleted = (partially, survey) => survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>partially? !i.completed: i.completed).length : 0
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
        _deadline: survey.instances.length === 0? "No Current Deadlines" : Math.max(...survey.instances.map(i=>i.deadline))
      }
      

      
      calculatedSurveys.push(Object.assign(survey, surveyAnalytics));

      
    })



    return  calculatedSurveys;
  }

