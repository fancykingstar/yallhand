export const validContent = (allItems, teamPath, tagPath) => {
  let displayItems = [];
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
  const addPolicy = (poli, vari) => {
    if (validTags(vari.tags) === true) {
        let updatedPolicy = poli;
        updatedPolicy["variations"] = [vari];
        displayItems.push(updatedPolicy);
    } 
  };
  const checkPath = (val, path) => {
    let retrievedValue = false;
    let index = 2;
    while (retrievedValue === false && index > -1) {
      if (path[index] === val) {
        retrievedValue = true;
        index = index - 3; //CHECK THIS
      }
      index--;
    }
    return { status: retrievedValue, depth: index };
  };
  allItems.forEach(policy => {
    if (policy.variations.length > 0) {
      if (
        policy.variations.length === 1 &&
        policy.variations[0].teamID === "global"
      ) {
        addPolicy(policy, policy.variations[0])
      } else {
        let allTeamIDs = policy.variations.map(variation => variation.teamID);
        allTeamIDs = allTeamIDs.filter(id => {
          let validID = checkPath(id, teamPath);
          return validID["status"];
        });
        if (allTeamIDs.length === 0) {
          let globalAvail = policy.variations.filter(
            vari => vari.type === "global"
          );
          globalAvail = globalAvail.length > 0;
          if (globalAvail) {
            let globalVariation = policy.variations.filter(
              variation => variation.type === "global"
            )[0];
            addPolicy(policy, globalVariation);
          }
        } else {
          if (allTeamIDs.length === 1) {
            addPolicy(
              policy,
              policy.variations.filter(vari => vari.teamID === allTeamIDs[0])[0]
            );
          } else {
            let i = 2;
            while (i > -1) {
              if (allTeamIDs.includes(teamPath[i])) {
                addPolicy(
                  policy,
                  policy.variations.filter(
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


