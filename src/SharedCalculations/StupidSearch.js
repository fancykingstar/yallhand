import _ from 'lodash';
import { getDisplayTags } from './GetDisplayTags';
import { getDisplayTeams } from './GetDisplayTeams';

const reject = [
    "accountid",
    "adminid",
    "displayName_full",
    "displayName",
    'teamID',
    "tags",
    // "email",
    "img",
    // "profile",
    // "title",
    // "dept",
    // "location",
    // "LandLine",
    // "mobile",
    // "aboutMe",
    // "networks",
    // "twitter",
    // "medium",
    // "github",
    // "linkedIn"
]

const replace = (item, allTeams, allTags) => {
    let tempItem = Object.assign({},item)
    tempItem["tags"] = getDisplayTags(item.tags, allTags)
    tempItem["teamID"] = getDisplayTeams(item.teamID, allTeams)
    return tempItem
}

export const initSearchObj = (list, key, allTeams=null, allTags=null, replaceTeamsTags=false) => {
    let searchObj = {}
    list.forEach(item => {
        if(replaceTeamsTags) {
            const newItem = replace(item, allTeams, allTags)
            let str = JSON.stringify(newItem).toLowerCase()
            reject.forEach(word => {if(str.includes(word)){str = str.replace(word, " ")}})
            searchObj[item[key]] = str.toLowerCase()
        }
        else {
            let str = JSON.stringify(item).toLowerCase()
            reject.forEach(word => {if(str.includes(word)){str = str.replace(word, " ")}})
            searchObj[item[key]] = str.toLowerCase()
        }
    });
    return searchObj
}


export const stupidSearch = (searchObj, term) => {
    // const termFormatted = term.toLowerCase().trim()
    let results = []
    Object.keys(searchObj).forEach( (key, i) => 
        _.includes(searchObj[key], term) ? results.push(key) : null )
    return results
} 