import { observable, action } from "mobx";
import {validDisplayPolicies} from '../SharedCalculations/ValidTeams'

class Store {
  @observable
  allPolicies = [];

  @observable
  filteredPolicies = [];

  @observable
  policyTitle= "";

  @observable
  toggledPolicy = ''

  @observable
  toggledVariation = ''

  @observable
  userAvailablePolicies = []

  @observable
  userAvailableFilteredPolicies = []

  @observable
  channelFilter = {'label': 'All', 'chanID': null};

  @observable
  cardFilters =  {cardFilterPublished: true,
            cardFilterDrafts: true,
            cardFilterArchived: false}

@observable
  cardFilterToStage = {
    "ok" : "cardFilterPublished",
      "partial" : "cardFilterPublished",
    "draft":"cardFilterDrafts" ,
    "notOk": "cardFilterPublished",
   "archived": "cardFilterArchived"
  }

  @observable
  addPolicyMod = false;

  @observable
  cardSort = "Newest"

  @observable
  cardFilterCounts = {}

  
  
  @action
  closeMod(e) {
    e.preventDefault();
    this.addPolicyMod = false;
  }

  openMod(e) {
    e.preventDefault();
    this.addPolicyMod = true;
  }

  addPolicy(e, accountInfo, chan) {
    e.preventDefault();
    const newPolicy = {
        "accountID": accountInfo.accountID,
        "policyID": Math.random().toString(16).slice(2, 8).toUpperCase(),
        "teamID": '',
        "chanID": chan,
        "label": this.policyTitle,
        "admins": [{"adminID": accountInfo.adminID, "displayName": accountInfo.displayName}],
        "keywords": [],
        "state": "draft",
        "variations": []
    }
    
    this.allPolicies.push(newPolicy)
    this.displayPolicies()
   

    this.closeMod(e);
  }

  displayPolicies() {
    this.filteredPolicies = this.allPolicies.filter(policy => this.cardFilters[this.cardFilterToStage[policy.state]])
    if (this.channelFilter.chanID !== null) {
        const channelpolicies = this.filteredPolicies.filter(policy => policy.chanID === this.channelFilter.chanID)
        this.filteredPolicies = channelpolicies
    }
  }

  loadPolicies() {
    const policies = require("../MockData/Policies.json");
    this.allPolicies = policies
    this.getMostRecent()
    // this.sortNewOld()
    this.displayPolicies()
  };

  updateCardFilter(e) {
      e.preventDefault()
      this.cardFilters[e.currentTarget.id] = !(this.cardFilters[e.currentTarget.id])
      this.displayPolicies()
  }
  updateCardSort(val) {
      this.cardSort = val
      val === 'Newest' ? this.sortNewOld() : this.sortOldNew()
  }
  getMostRecent() {
        let updatedPolicies = []
        for (let i in this.allPolicies) {
            let currentPolicy = this.allPolicies[i]
            const datesList = currentPolicy.variations.map(variation => Number(variation.updated))
            currentPolicy['updated'] = Math.max.apply(Math, datesList)
            updatedPolicies.push(currentPolicy)

        }
        this.allPolicies = updatedPolicies
    }
sortNewOld() {
    const sorted = this.allPolicies.slice().sort((a,b) => b['updated']-a['updated']);
    this.allPolicies = sorted
    this.displayPolicies()
 
}
sortOldNew() {
    const sorted = this.allPolicies.slice().sort((a,b) => a['updated']-b['updated']);
    this.allPolicies = sorted
    this.displayPolicies()
    

}
chanFilter(label, id) {
    //chanID
    this.channelFilter = {'label':label, 'chanID': id}
}

toggleVariation(variationID) {
    this.toggledVariation = variationID
}

togglePolicy(policyID) {
    this.toggledPolicy = policyID
}
  
resetVariation() {
    this.toggledVariation = ''
}

addTitle(val) {
    this.policyTitle = val;
  }

sourcePolicyFriendly(id) {
    let policyFriendly = ''
    while (policyFriendly === '') {
    this.allPolicies.forEach(function(policy) {
        policy.variations.forEach(function(variation) {
        
            if (variation.variationID === id) {
             
                policyFriendly = policy.label
            } 
        })
    })
    break;
    }
    return policyFriendly
}

variationsToPolicies(variations) {
    const allPolicies = variations.map(variationID => this.sourcePolicyFriendly(variationID))
    return allPolicies.join(' ')
}

loadUserPortalPolicies(val) {
    this.userAvailablePolicies = val
}
    
cardFilterCount() {
        if (this.allPolicies.length === 0) {this.loadPolicies()}
        let cardFilterCountsLocal = {'published': 0, 'drafts': 0, 'archived': 0}
        this.allPolicies.forEach(policy => {
            let val = this.cardFilterToStage[policy.state].toLowerCase()
            let current = val.split('cardfilter')[1]
            cardFilterCountsLocal[current] ++
            
        })
        this.cardFilterCounts = cardFilterCountsLocal
          
      }
    
    

}

export const PoliciesStore = new Store();
