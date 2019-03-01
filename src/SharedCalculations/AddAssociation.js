import _ from "lodash";

export const addAssociation = (assocs, type, ID, variID) => {
    let newAssocs = Object.assign({}, assocs)
    let duplicate = false
    if(_.isEmpty(assocs)){
      newAssocs.announcements = []
      newAssocs.policies = []
    }
    if(type === "policy"){
      if(newAssocs.policies.filter(policy => JSON.stringify(policy).includes(variID)).length > 0){
        duplicate = true}
      else{
       newAssocs.policies.filter(policy => policy.policyID === ID).length > 0? 
       newAssocs.policies.filter(policy => policy.policyID === ID)[0].variations.push(variID)
       : newAssocs.policies.push({"policyID": ID, "variations": [variID]})
    }
  }
  if(type === "announcement"){
   if(newAssocs.announcements.filter(annc => JSON.stringify(annc).includes(variID)).length > 0){
     duplicate = true}
   else{
    newAssocs.announcements.filter(annc => annc.anncID === ID).length > 0? 
    newAssocs.announcements.filter(annc => annc.anncID === ID)[0].variations.push(variID)
    : newAssocs.announcements.push({"anncID": ID, "variations": [variID]})
 }
}
  if(duplicate){return null}
  else{ return newAssocs}
 }