import { observable, action, computed } from "mobx";
import {AccountStore} from "../Stores/AccountStore";
import {giveMeKey} from "../SharedCalculations/GiveMeKey"
import { TeamControl } from "../QuadranceControls";

class Store {
  @observable
  structure = [];

  @observable
  //for UI elements
  structureSelect = [];

  @observable
  tags = [];

  @observable
  segmentation = [];

  @observable
   //for UI elements
  tagsSelect = [];

  @observable
  //key teamID value friendly DisplayName
  teamKey = {};

  @action
  loadTeamKey() {
    this.teamKey = {}
    this.structure.forEach(team => (this.teamKey[team.teamID] = team.label));
  }

  sortStructure(path, type) {
    let sortedStructure = [];
    const id = type === "team" ? "teamID" : "tagID";
    let sortedPath = path.sort();
    const depth0s = sortedPath.filter(item => item.depth === 0);
    depth0s.forEach(depth0 => {
      sortedStructure.push({
        key: giveMeKey(),
        value: depth0[id],
        text: depth0.label
      });
      const depth1s = sortedPath.filter(item => item.parent === depth0[id]);
      depth1s.forEach(depth1 => {
        let depth2s = sortedPath.filter(item => item.parent === depth1[id]);
        depth2s = depth2s.map(item => ({
          key: giveMeKey(),
          value: item[id],
          text: "-- " + item.label
        }));
        const group = [{key: giveMeKey(), value: depth1[id], text: "- " + depth1.label}, ...depth2s];
        group.forEach(item => sortedStructure.push(item));
      });
    });
    type !== "team" ? sortedStructure.unshift({key: "no-tag", value: "none", text: "Don't Limit By Tag"}) :
                      sortedStructure.unshift({key: "global key", value: "global", text: "Global (All Teams)"})

    return sortedStructure;
  }

  async loadStructure(allTeams) {
    const allUsers = await AccountStore._allActiveUsers;
    return new Promise((resolve, reject) => {
      allTeams.forEach(team => {
        team["count"] = allUsers.filter(user => user.teamID === team.teamID).length
      });
      const structureSortMap = allTeams.map(team => team.label).sort();
      let structure = structureSortMap.map(
        team => allTeams.filter(current => current.label === team)[0]
      );
  
      if (structure.filter(team => team.teamID === "global").length === 0) {
        structure.unshift({
          teamID: "global",
          label: "Global (All Teams)",
          parent: "self",
          depth: -1
        });
      }
      this.structureSelect = this.sortStructure(structure, "team");
      this.structure = structure;
      this.loadTeamKey();
      this.structure.length === 0 ? reject(false) : resolve(true)
  }) 
   

  }

  async loadTags(allTags) {
    const allUsers = await AccountStore._allActiveUsers;
    allTags.forEach(tag => {
      tag["count"] =  allUsers.filter(user => user.tags.length > 0? user.tags[0] === tag.tagID : false).length
    });
    const tagsSortMap = allTags.map(team => team.label).sort();
    let tags = tagsSortMap.map(
      team => allTags.filter(current => current.label === team)[0]
    );
    this.tagsSelect = this.sortStructure(tags, "tag");
    this.tags = tags;
    return new Promise((resolve, reject) => {
      resolve(true)
  }) 
  }


  async loadSegmentation(allsegments){
    this.segmentation = allsegments
  }

  previewValidPath(id, type) {
    //type needs to be "team" or "tag"
    //returns object to transverse valid sub items in tags and teams when displaying to user
    //outputs {0: team, 1: sub-team/tag, 2:sub-team/tag of sub-team/tag}
    let teamPath = { 0: "", 1: "", 2: "" };
    if(type === "team" && (id === "global" || this.structure.length === 1)){
      return { 0: "", 1: "", 2: "" }
    }
    else if(type === "tag" && (id === "none" || !this.tags.length)){
      return { 0: "", 1: "", 2: "" }
    }
    else if(type === "tag" && id === ""){
      return { 0: "", 1: "", 2: "" }
    }
    else {
    let currentDepth =
      type === "team"
        ? this.structure.filter(team => team.teamID === id)[0].depth
        : this.tags.filter(tag => tag.tagID === id)[0].depth;
    if (currentDepth === 0) {
      teamPath[currentDepth] = id;
      return teamPath;
    } else {
      let currentLevel = id;
      const buildDepth = () => {
        teamPath[currentDepth] = currentLevel;
        currentLevel =
          type === "team"
            ? this.structure.filter(team => team.teamID === currentLevel)[0]
                .parent
            : this.tags.filter(tag => tag.tagID === currentLevel)[0].parent;
        currentDepth--;
      };
      while (currentDepth !== -1) {
        buildDepth();
      }
      return teamPath;
    }}
  }
  _getParent(mode, id) {
      let toreturn = ""
      if(mode === "team"){
        const parent = this.structure.filter(team => team.teamID === id)[0].parent
        parent === "self" ? 
        toreturn = "global" : toreturn =  parent
      }
      else {
        const parent = this.tags.filter(tags => tags.tagID === id)[0].parent
        parent === "self" ? 
        toreturn = "self" : toreturn = parent
      }
    return toreturn
    }
    
   _getTeam(id){
    return this.structure.filter(team => team.teamID === id)[0]
   }
   _getTag(id){
    return (
    id === "none" || id === "self" ? {
    tagID: "none",
    label: "None",
    parent: "self",
    depth: -1} :
    this.tags.filter(team => team.tagID === id)[0]
    )
   }


 _getSegment(id){
    const item = this.segmentation.filter(s => s.segmentID === id);
    return item.length? item[0]:{};

   }
   

   @computed
   get _getTagsAsEditOptions(){
    let tagOptions = this.tags.map(tag => ({
      key: tag.tagID + giveMeKey(),
      text: tag.label,
      value: tag.tagID,
      disabled: tag.depth === TeamControl.maxDepth ? true : false
    }));
     tagOptions.unshift({
      key: "no-tag",
      text: "Create Base Tag...",
      value: "self",
      depth: -1,
      disabled: false
    });
    return tagOptions
   }
 
   @computed
   get _getTagsAsOptions(){
    let tagOptions = this.tags.map(tag => ({
      key: tag.tagID + giveMeKey(),
      text: tag.label,
      value: tag.tagID,
      disabled: tag.depth === TeamControl.maxDepth ? true : false
    }));
     tagOptions.unshift({
      key: "no-tag",
      text: "None",
      value: "self",
      depth: -1,
      disabled: false
    });
    return tagOptions
   }

   @computed
   get _getTeamsAsOptions(){
    return this.structure.map(team => ({
      key: team.teamID + giveMeKey(),
      text: team.label,
      value: team.teamID,
      disabled: team.depth === TeamControl.maxDepth ? true : false
    }));
   }

   @computed
   get _isTargetingAvail(){
     return (this.structure.length > 1 || this.tags.length > 0);
   }

}

export const TeamStore = new Store();