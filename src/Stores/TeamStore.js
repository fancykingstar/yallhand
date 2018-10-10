import { observable, action, computed } from "mobx";

class Store {
  @observable
  structure = []

  @observable
  structureDisplay = []

  @observable
  classes = []

  @observable
  teamKey = {}




  
  @action
  loadTeamKey() {
    this.structure.forEach(team => this.teamKey[team.teamID] = team.label)
  
  }

    loadStructure() {
    const structure = require("../MockData/Teams.json");
    this.structure  = structure
    this.loadTeamKey()
  };

  loadStructureDisplay() {
      if (this.structure.length === 0) {this.loadStructure()}
      const tree = []
  }

  loadClasses() {
    const classes = require("../MockData/Classes.json");
    this.classes  = classes
  };







  
}

export const TeamStore = new Store();
