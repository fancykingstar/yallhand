function UserPortalFilter(list, team, tag) {
    cardFilterToStage = {
        "ok" : "cardFilterPublished",
          "partial" : "cardFilterPublished",
        "draft":"cardFilterDrafts" ,
        "notOk": "cardFilterPublished",
       "archived": "cardFilterArchived"
      }
    const allItems = list
    allItems = allItems
        .filter(item => item.teamID === team)
        .filter(item => item.classID === tag)
        .filter(item => cardFiltertoStage[item.condition] === 'cardFilterPublished')

    return allItems
}

export default UserPortalFilter