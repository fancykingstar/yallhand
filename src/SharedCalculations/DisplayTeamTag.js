import {TeamStore} from "../Stores/TeamStore"
export const displayTeamTag = (teamID, tags) => {
    const teamLabel = teamID === "global"? "Global (all teams)" : TeamStore._getTeam(teamID) === undefined? "(Deleted Team)" : TeamStore._getTeam(teamID).label
    const tagLabel = tags.length === 0? "No Tags" : TeamStore._getTag(tags[0]) === undefined? "(Deleted Tag)" : TeamStore._getTag(tags[0]).label
    
    return (`${teamLabel} / ${tagLabel}`)
}