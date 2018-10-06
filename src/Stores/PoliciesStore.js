import { observable, action, computed } from "mobx";

class Store {
  @observable
  allPolicies = [];

  @observable
  filteredPolicies = [];

  @observable
  toggledVariation = ''

  @observable
  channelFilter = {'label': 'All', 'chanID': null};

  @observable
  cardFilters =  {cardFilterPublished: true,
            cardFilterDrafts: true,
            cardFilterArchived: false}

  cardFilterToStage = {
    "ok" : "cardFilterPublished",
      "partial" : "cardFilterPublished",
    "draft":"cardFilterDrafts" ,
    "notOk": "cardFilterPublished",
   "archived": "cardFilterArchived"
  }

  @observable
  cardSort = "Newest"
  
  @action
  displayPolicies() {
    this.filteredPolicies = this.allPolicies.filter(policy => this.cardFilters[this.cardFilterToStage[policy.condition]])
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
  
resetVariation() {
    this.toggledVariation = ''
}

sourcePolicyFriendly(id) {
    let policyFriendly = ''
    while (policyFriendly === '') {
    this.allPolicies.forEach(function(policy) {
        policy.variations.forEach(function(variation) {
            console.log(id)
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

}

export const PoliciesStore = new Store();
