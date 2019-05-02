import React from "react"
import {TeamStore} from "../Stores/TeamStore"
import { TeamControl } from "../QuadranceControls";
import { giveMeKey } from "../SharedCalculations/GiveMeKey"


const teampath = (type) => {
    let index = 0
    let path = {}
    while(index <= TeamControl.maxDepth){
        path[index] = ""
        index = index + 1
    }
    type === "team"? path[0] = "global" : null
    return path
}
const buildSelectOptions = (arry, depth) => {
    const output = []
    const textSpace = `${"--".repeat(depth - 1)} `
    arry.forEach(i => {
        output.push({
        key: i.label + giveMeKey(),
        value: i.teamID !== undefined? i.teamID : i.tagID,
        text: i.label
        // text: depth === 0 || depth === 1? i.label : textSpace + i.label
    })})
    return output
}




export const sortStructure = (path, type) => {
    //For displaying
    let sortedStructure = [];
    let sortedPath = path.sort();
    let index = 1
    sortedPath.forEach(i => {
        sortedStructure =  [...sortedStructure, ...buildSelectOptions([i], index)]
    })
    // while (index <= TeamControl.maxDepth){
    //     const pathByDepth = sortedPath.filter(item => item.depth === index)
        // sortedStructure =  [...sortedStructure, ...buildSelectOptions(pathByDepth, index)]
        // index = index + 1
    // }
    type !== "team"? 
      sortedStructure.unshift({ key: "no-tag", value: "none", text: "Don't Limit By Tag" })
      : null
      return sortedStructure;
  }

export const previewValidPath = (id, type) => {
    let path = teampath(type)
    if(id === "global" || id === "none"){
      return path
    }
    else {
    let currentDepth =
      type === "team"
        ? TeamStore.structure.filter(team => team.teamID === id)[0].depth
        : TeamStore.tags.filter(tag => tag.tagID === id)[0].depth;
    if (currentDepth === 1) {
      path[currentDepth] = id;
      return path;
    } else {
        let currentID = id;
        while (currentDepth !== 0) {
            path[currentDepth] = currentID;
            currentID = TeamStore._getParent(type, currentID)
            currentDepth--;
        }
        return path;
      }}
  }