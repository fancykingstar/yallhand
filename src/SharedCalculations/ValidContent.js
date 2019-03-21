export const validContent = (allItems, teamPath, tagPath) => {
  let displayItems = [];

  const publishedOnly = (allContent) => {
    let published = []
    console.log("allcontent", allContent)
    allContent.forEach(content => {
      const avail = content.variations.filter(vari => vari.stage === "published")
      if(avail.length > 0){
        let newContent = Object.assign({}, content)
        newContent.variations = avail
        published.push(newContent)
      } 
    })
    return published
  }

  const returnValidArrayByTag = (arry) => {
    let arryIndex = -1
    let pathIndex = 2
    const alltags = arry.map(i => i.tags[0])
    while (pathIndex > -1) {
      if(alltags.includes(tagPath[pathIndex])){
        arryIndex = alltags.indexOf(tagPath[pathIndex])
        pathIndex = pathIndex - 3
      }
      pathIndex--
    }
    return arryIndex
  }

  //Returns true if NO SELECTED TAGS or MATCHED TAG EXISTS IN TAG PATH
  const validTags = (allvaris) => {
    //return {status/data}
    let status = false;
    let data = {}
    let index = 2;
    let tagsMap = []
    if(allvaris.length > 0){
      tagsMap = allvaris.map(i => i.tags.length === 0? "none" : i.tags[0])
      while (status === false && index > -1) {
        if (tagsMap.includes(tagPath[index])) {
          status = true;
        } else {
          index--;
        }
    }
    }
  
    if(status === true){
      data = allvaris.filter(i => i.tags[0] === tagPath[index])[0]
    }
    else if(status === false && tagsMap.includes("none")){
      status = true
      data = allvaris.filter(i => i.tags.length === 0)[0]
    }
    return {status, data}
};
  //IF VALIDTAGS than ADD NEW POLICY WITH VARIATION TO DISPLAY ITEMS
  const addContent = (poli, varis) => {
    //varis is array of all eligable content BY TEAM
    const valid = validTags(varis)
    if (valid.status) {
        let updatedPolicy = poli;
        updatedPolicy["variations"] = [valid.data];
        displayItems.push(updatedPolicy);
    } 
  };

  //RETURNS BOOL & (IF THERE IS) DEEPEST MATCH OF VALUE AND PATH
  const checkPath = (val, path) => {
    let active = true
    let retrievedValue = false;
    let index = 2;
    while (retrievedValue === false && index > -1 && active) {
      if (path[index] === val) {
        retrievedValue = true;
        active = false;
      }
      else{index--}
    }
    return { status: retrievedValue, depth: index };
  };


  publishedOnly(allItems).forEach(content => {
      if (
        content.variations.length === 1 &&
        content.variations[0].teamID === "global"
      ) { addContent(content, content.variations) } 

      else {
        let allTeamIDs = content.variations.map(variation => variation.teamID);
        allTeamIDs = allTeamIDs.filter(id => { 
          let validID = checkPath(id, teamPath); 
          return validID["status"]; });

        if (allTeamIDs.length === 0) {
          let globalAvail = content.variations.filter( vari => vari.teamID === "global" ).length > 0
          if (globalAvail) {
            let globalVariation = content.variations.filter( vari => vari.teamID === "global"  );
            addContent(content, globalVariation);
          }
        } else {
          if (allTeamIDs.length === 1) {
            addContent( content, content.variations.filter(vari => vari.teamID === allTeamIDs[0]) );
          } else {
            let i = 2;
            while (i > -1) {
              if (allTeamIDs.includes(teamPath[i])) {
                addContent(
                  content,
                  content.variations.filter(
                    vari => vari.teamID === teamPath[i]
                  )
                );
                i = i - 3;
              } else {
                i--;
              }
            }
          }
        }
      }
  });
  return displayItems;
};


//LOGIC
// if there are variations
// if there is only one variation that is global, use that variation
// else create a mapped list of teamIDs from all variations
//     filter mapped list for vales in teamPath, skipping null
//     if filtered mapped list is zero, check for global and use if available
//     else 
//         if filtered mapped is one, use that variation
//         else
//              iterate through teamPath filtering mapped list from deepest to shallow. stop when match so deepest teamID is returned
//             use policy with deepest teamID

//When adding check to see if tag from variation matches tag in preview team path


