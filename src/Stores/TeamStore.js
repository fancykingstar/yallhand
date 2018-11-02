import { observable, action } from "mobx";

class Store {
  @observable
  structure = []

  // @observable
  // structureDisplay = []

  @observable
  classes = []

  @observable
  //key teamID value friendly DisplayName
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

  // loadStructureDisplay() { 
  //     if (this.structure.length === 0) {this.loadStructure()}
  //     const tree = []
  // }

  loadClasses() {
    const classes = require("../MockData/Tags.json");
    this.classes  = classes
  };

  previewValidPath(id, type) {
    //type needs to be "team" or "tag"
    //returns object to transverse valid sub items in tags and teams when displaying to user
    //outputs {0: team, 1: sub-team/tag, 2:sub-team/tag of sub-team/tag}
    let teamPath = {0: '', 1: '', 2: ''}
    let currentDepth = type === 'team' ? this.structure.filter(team => team.teamID === id)[0].depth : this.classes.filter(tag => tag.tagID === id)[0].depth
    if (currentDepth === 0) {
      teamPath[currentDepth] = id
      return teamPath
    }
    else {
      let currentLevel = id
      while (currentDepth !== -1) {
        
        teamPath[currentDepth] = currentLevel
        currentLevel = type === 'team' ? this.structure.filter(team => team.teamID === currentLevel)[0].parent : this.classes.filter(tag => tag.tagID === currentLevel)[0].parent
        currentDepth--
      }
      return teamPath
    }
    
}





  
}

export const TeamStore = new Store();
