import { observable, action, computed } from "mobx";
import {addCalculatedAttributes} from "../SharedCalculations/ContentCalculatedAttributes"
import _ from "lodash";
// const cardFilterToStage = {ok: "cardFilterPublished", partial: "cardFilterPublished", draft: "cardFilterDrafts", notOk: "cardFilterPublished", archived: "cardFilterArchived"};

class Store {
  @observable allPolicies = [];
  @observable userAvailablePolicies = [];
  // @observable channelFilter = { label: "All", chanID: null };
  // @observable cardFilters = {cardFilterPublished: true, cardFilterDrafts: true, cardFilterArchived: false};
  // @observable cardSort = "Newest";
  //currently active
  // @observable selectedPolicyID = "";
  // @observable selectedVariationID = "";

  @action
  loadPolicies(val) {
    return new Promise((resolve, reject) => {
    this.allPolicies = addCalculatedAttributes(val);
      resolve(true)
    })

  }

  // replacePolicy(val) {
  //   let policyList = this.allPolicies.filter(
  //     policy => policy.policyID !== val.policyID
  //   );
  //   policyList.push(val);
  //   this.loadPolicies(policyList);
  // }

  // updateCardFilter(e) {
  //   e.preventDefault();
  //   this.cardFilters[e.currentTarget.id] = !this.cardFilters[
  //     e.currentTarget.id
  //   ];
  // }

  // updateCardSort(val) {
  //   this.cardSort = val;
  //   val === "Newest" ? this.sortNewOld() : this.sortOldNew();
  // }

  // sortNewOld() {
  //   const sorted = this.allPolicies
  //     .slice()
  //     .sort((a, b) => b["updated"] - a["updated"]);
  //   this.allPolicies = sorted;
  // }

  // sortOldNew() {
  //   const sorted = this.allPolicies
  //     .slice()
  //     .sort((a, b) => a["updated"] - b["updated"]);
  //   this.allPolicies = sorted;
  // }

  // chanFilter(label, id) {
  //   this.channelFilter = { label: label, chanID: id };
  // }

  // toggleVariationID(variationID) {
  //   this.selectedVariationID = variationID;
  // }

  // togglePolicyID(policyID) {
  //   this.selectedPolicyID = policyID;
  // }

  // resetVariation() {
  //   this.selectedVariationID = "";
  // }

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

  loadUserPortalPolicies(val) {
    this.userAvailablePolicies = val;
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

  // cardFilterCount() {

  //   let cardFilterCountsLocal = { published: 0, drafts: 0, archived: 0 };
  //   this.allPolicies.forEach(policy => {
  //     let val = cardFilterToStage[policy.state].toLowerCase();
  //     let current = val.split("cardfilter")[1];
  //     cardFilterCountsLocal[current]++;
  //   });
  //   return cardFilterCountsLocal;
  // }
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

  // @computed
  // get _currentObjVariation() {
  //   if (
  //     this.allPolicies.length !== 0 &&
  //     this.selectedPolicyID !== "" &&
  //     this.selectedVariationID !== ""
  //   ) {
  //     let current = this._currentObj.variations;
  //     if (!Array.isArray(current)) {
  //       current = JSON.parse(current);
  //     }
  //     return current.filter(
  //       vari => vari.variationID === this.selectedVariationID
  //     )[0];
  //   } else {
  //     return null;
  //   }
  // }

  // @computed
  //filters policies displayed by channel  
  // get filteredPolicies() {
  //   const filteredPolicies = this.allPolicies.filter(
  //     policy => this.cardFilters[cardFilterToStage[policy.state]]
  //   );
  //   if (this.channelFilter.chanID !== null) {
  //     const channelpolicies = filteredPolicies.filter(
  //       policy => policy.chanID === this.channelFilter.chanID
  //     );
  //     return channelpolicies;
  //   }
  //   else {return filteredPolicies}
  // }

}

export const PoliciesStore = new Store();
