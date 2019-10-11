
  export const calculateAnalytics = (allSurveys) => {
    const surveysNoStart = (survey) => survey.instances.length - survey.responses_by_instance.length;
    const surveysCompleted = (partially, survey) => survey.responses_by_instance.length? survey.responses_by_instance.filter(i=>partially? !i.completed: i.completed).length : 0
    const getPercentage = (array, val) => {
      const total = array.reduce(function(acc, val) { return acc + val; }, 0);
      return parseFloat(val/total * 100).toFixed(1);
    }
    
    let updatedSurveys = [];

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
      const allResponseData = survey.responses_by_instance.map(i => i.data);
      let newSurveyItems = [];
      
      survey.surveyItems.forEach(surveyItem=>{
        let allItemResponses = allResponseData
          .filter(itemResponse => Object.keys(itemResponse)[0] === surveyItem._id)
          .map(itemResponse => Object.values(itemResponse))
          // .map(itemResponse => {
          //   return itemResponse.map(r=>r.response)
          // })
          // .map(itemResponse => itemResponse.response);


        console.log("test", allItemResponses)

        let responses = _.countBy(allItemResponses); //{val: count}


        Object.keys(responses).forEach(res => responses[res] = {count: responses[res], percentage: getPercentage( Object.values(responses) ,responses[res])})
        const newSurveyItem = Object.assign(surveyItem, {_responses: responses})
        newSurveyItems.push(newSurveyItem);
      })
      ///
      surveyAnalytics.responses = newSurveyItems;
      updatedSurveys.push(Object.assign(survey, surveyAnalytics))
    })

    return updatedSurveys;
  }

