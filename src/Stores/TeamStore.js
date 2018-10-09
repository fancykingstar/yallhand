import { observable, action } from "mobx";

class Store {
  @observable
  structure = []

  @observable
  structureDisplay = []

  @observable
  classes = []


  
  @action
    loadStructure() {
    const structure = require("../MockData/Teams.json");
    this.structure  = structure
  };

  loadStructureDisplay() {
      if (this.structure.length === 0) {this.loadStructure()}
      const tree = []
      //for/if each level 1 create {parent: []}
      //for/if each level 2, find parent, push child {parent: [{child: ''}]}
      //for/if each level 3, find parent, push child {parent: [{child: [child]}]} 
  }

  loadClasses() {
    const classes = require("../MockData/Classes.json");
    this.classes  = classes
  };







  
}

export const TeamStore = new Store();
