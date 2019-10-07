import React from "react"

import {TeamStore} from "../Stores/TeamStore";
import {AccountStore} from "../Stores/AccountStore";

const getParent = (allStructure, id, idlabel) => id === "global"? "self" : allStructure.filter(i=>i[idlabel] === id)[0].parent



export const EligibleUsersByTeamTag = (team, tag) => {
    // const allTeams = TeamStore.structure;
    // const allTags = TeamStore.tags;

    // console.log("allTeams", allTeams.length)
    // let validTeams = [];
    // let validTags = [];
    // let nextTeam = team;
    // let nextTag = tag;
    // if (nextTeam === "global") {
    //     validTeams = ["global"]
    // }
    // else while (nextTeam !== "self") {
    //     validTeams.push(nextTeam)
    //     nextTeam = getParent(allTeams, nextTeam, "teamID")
    // }
    // if (nextTag) {
    //     while (nextTag !== "self") {
    //         validTags.push(nextTag)
    //         nextTeam = getParent(allTags, nextTeam)
    //     }
    // }

    let eligibleUsers = AccountStore._allActiveUsers.filter(user => user.teamID === team)
    if (tag) eligibleUsers = eligibleUsers.filter(user => user.tags.length? user.tags[0] === tag : false)
           
    return eligibleUsers;



}