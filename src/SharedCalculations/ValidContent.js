export const validContent = (allItems, teamPath, tagPath) => {
  let displayItems = [];

  const publishedOnly = (allContent) => {
    let published = []
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

  //Returns true if NO SELECTED TAGS or MATCHED TAG EXISTS IN TAG PATH
  const validTags = (alltags) => {
    let tagStatus = false;
    if (alltags.length === 0) {
      tagStatus = true;
    } else {
      let index = 2;
      while (tagStatus === false && index > -1) {
        if (alltags.includes(tagPath[index])) {
          tagStatus = true;
        } else {
          index--;
        }
      } 
    }
    return tagStatus
};
  //IF VALIDTAGS than ADD NEW POLICY WITH VARIATION TO DISPLAY ITEMS
  const addContent = (poli, vari) => {
    if (validTags(vari.tags)) {
        let updatedPolicy = poli;
        updatedPolicy["variations"] = [vari];
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
      ) { addContent(content, content.variations[0]) } 

      else {
        let allTeamIDs = content.variations.map(variation => variation.teamID);
        allTeamIDs = allTeamIDs.filter(id => { 
          let validID = checkPath(id, teamPath); 
          return validID["status"]; });

        if (allTeamIDs.length === 0) {
          let globalAvail = content.variations.filter( vari => vari.teamID === "global" ).length > 0
          if (globalAvail) {
            let globalVariation = content.variations.filter( vari => vari.teamID === "global"  )[0];
            addContent(content, globalVariation);
          }
        } else {
          if (allTeamIDs.length === 1) {
            addContent( content, content.variations.filter(vari => vari.teamID === allTeamIDs[0])[0] );
          } else {
            let i = 2;
            while (i > -1) {
              if (allTeamIDs.includes(teamPath[i])) {
                addContent(
                  content,
                  content.variations.filter(
                    vari => vari.teamID === teamPath[i]
                  )[0]
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


