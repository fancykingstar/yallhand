import {generateID} from "../SharedCalculations/GenerateID"

export const initContent = (chan, label) => {
    const newContent = {
      policyID: generateID(),
      chanID: chan,
      label: label,
    //   keywords: [],
    //   variations: []
    };
    return newContent;
  }
  
  export const initContentVariation =(
    label = "",
    contentRAW = [],
    contentHTML = [],
    teamID = "global",
    tags = []) => {
    const newVariation = {
      label: label,
      variationID: generateID(),
      contentRAW: contentRAW,
      contentHTML: contentHTML,
      stage: "draft",
      teamID: teamID,
      tags: tags,
    };
    return newVariation;
  }