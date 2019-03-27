import { observable, action, computed } from "mobx";
import {addCalculatedAttributes} from "../SharedCalculations/ContentCalculatedAttributes"
import _ from "lodash";

class Store {
  @observable allPolicies = [];

  @action
  loadPolicies(val) {
    return new Promise((resolve, reject) => {
    this.allPolicies = addCalculatedAttributes(val);
      resolve(true)
    })

  }

  pushPolicies(val) {
    this.allPolicies.push(val);
  }

  sourcePolicyFriendly(id) {
    let policyFriendly = "";
    const getFriendly = () => {
      this.allPolicies.forEach(function(policy) {
        policy.variations.forEach(function(variation) {
          if (variation.variationID === id) {
            policyFriendly = policy.label;
          }
        });
      });
    }
    while (policyFriendly === "") {
      getFriendly()
      break;
    }
    return policyFriendly;
  }

  variationsToPolicies(variations) {
    const allPolicies = variations.map(variationID =>
      this.sourcePolicyFriendly(variationID)
    );
    return allPolicies.join(" ");
  }

  _toggleGlobalVariation(currentObj) {
    const current = Object.assign({}, this._getPolicy(currentObj))
    const globalPolicy = current.variations.filter(
      vari => vari.teamID === "global"
    );
    return globalPolicy.length === 0
      ? current.variations[0].variationID
      : globalPolicy[0].variationID
  }


  _getPolicy(id){
    if(this.allPolicies.filter(policy => policy.policyID === id).length > 0){
      return Object.assign({}, this.allPolicies.filter(policy => policy.policyID === id)[0])
    }
    else{return {}}
  }

  _getVariation(policyID, variationID){
    if(_.isEmpty(this._getPolicy(policyID))){return {}}
    else if(this._getPolicy(policyID).variations.filter(vari => vari.variationID === variationID).length > 0)
      {return Object.assign({}, this._getPolicy(policyID).variations.filter(vari => vari.variationID === variationID)[0])}
    else{return {}}
   
  }

  _getPolicyIDfromVariation(variationID){
    const filtered = this.allPolicies
      .filter(policy => policy.variations
        .filter(vari => vari.variationID === variationID).length === 1)
    return filtered.length === 0? {} : filtered[0].policyID 
  }

  @computed
  get _currentObj() {
    if (this.allPolicies.length !== 0 && this.selectedPolicyID !== "") {
      return this.allPolicies.filter(
        policy => policy.policyID === this.selectedPolicyID
      )[0];
    } else {
      return null;
    }
  }



}

export const PoliciesStore = new Store();
