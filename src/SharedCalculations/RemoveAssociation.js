import _ from "lodash";

export const removeAssociation = (assocs, type, ID, variID) => {
    let newAssocs = Object.assign({}, assocs)
    if(type === "policy"){
        let newVaris = newAssocs.policies
            .filter(policy => policy.policyID === ID)[0].variations
            .filter(vari => vari !== variID)
        newVaris.length === 0? newAssocs.policies = newAssocs.policies.filter(policy => policy.policyID !== ID)
        : newAssocs.policies.filter(policy => policy.policyID === ID)[0].variations = newVaris
        
  }
  if(type === "announcement"){
    let newVaris = newAssocs.announcements
        .filter(announcement => announcement.anncID === ID)[0].variations
        .filter(vari => vari !== variID)
    newVaris.length === 0? newAssocs.announcements = newAssocs.announcements.filter(announcement => announcement.anncID !== ID)
    : newAssocs.announcements.filter(announcement => announcement.anncID === ID)[0].variations = newVaris
    
}
return newAssocs
 }