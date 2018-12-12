import { observable, action } from "mobx";

class Store {
  @observable
  structure = [];

  @observable
  structureSelect = [];

  @observable
  classes = [];

  @observable
  classesSelect = [];

  @observable
  //key teamID value friendly DisplayName
  teamKey = {};

  

  @action
  loadTeamKey() {
    this.structure.forEach(team => (this.teamKey[team.teamID] = team.label));
  }

  sortStructure(path, type) {
    let sortedStructure = [];
    const id = type === "team" ? "teamID" : "tagID";
    let sortedPath = path.sort();
    const depth0s = sortedPath.filter(item => item.depth === 0);
    depth0s.forEach(depth0 => {
      sortedStructure.push({
        key: depth0.label,
        value: depth0[id],
        text: depth0.label
      });
      const depth1s = sortedPath.filter(item => item.parent === depth0[id]);
      depth1s.forEach(depth1 => {
        let depth2s = sortedPath.filter(item => item.parent === depth1[id]);
        depth2s = depth2s.map(item => ({
          key: item.label,
          value: item[id],
          text: "-- " + item.label
        }));
        const group = [
          { key: depth1.label, value: depth1[id], text: "- " + depth1.label },
          ...depth2s
        ];
        group.forEach(item => sortedStructure.push(item));
      });
    });
    if (type !== "team") {
      sortedStructure.unshift({ key: "no-tag", value: "none", text: "none" });
    }

    return sortedStructure;
  }

  loadStructure() {
    const structure = require("../MockData/Teams.json");
    if(this.structure.filter(team => team.teamID === 'global').length === 0){
    structure.unshift({
      teamID: "global",
      label: "Global (All Teams)",
      parent: "self",
      depth: 0
     });}
    this.structureSelect = this.sortStructure(structure, "team");
    this.structure = structure;
    this.loadTeamKey();
  }

  loadClasses() {
    const classes = require("../MockData/Tags.json");
    this.classesSelect = this.sortStructure(classes, "tag");
    this.classes = classes;
  }



  previewValidPath(id, type) {
    //type needs to be "team" or "tag"
    //returns object to transverse valid sub items in tags and teams when displaying to user
    //outputs {0: team, 1: sub-team/tag, 2:sub-team/tag of sub-team/tag}

    let teamPath = { 0: "", 1: "", 2: "" };
    let currentDepth =
      type === "team"
        ? this.structure.filter(team => team.teamID === id)[0].depth
        : this.classes.filter(tag => tag.tagID === id)[0].depth;
    if (currentDepth === 0) {
      teamPath[currentDepth] = id;
      return teamPath;
    } else {
      let currentLevel = id;
      // const getParent = (type) => {
      //   // console.log(currentLevel, this.structure.filter(team => team.teamID === currentLevel)[0].parent)
      //   type === 'team' ? this.structure.filter(team => team.teamID === currentLevel)[0].parent : this.classes.filter(tag => tag.tagID === currentLevel)[0].parent
      // }
      while (currentDepth !== -1) {
        teamPath[currentDepth] = currentLevel;
        currentLevel =
          type === "team"
            ? this.structure.filter(team => team.teamID === currentLevel)[0]
                .parent
            : this.classes.filter(tag => tag.tagID === currentLevel)[0].parent;
        currentDepth--;
      }
      return teamPath;
    }
  }
}

export const TeamStore = new Store();
