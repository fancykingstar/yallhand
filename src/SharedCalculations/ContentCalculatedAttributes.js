const addPolicyState = (policy) => {
    const stages = new Set(policy.variations.map(pol => pol.stage));
    if (stages.has("published") && stages.size === 1) {
      return "ok";
    } else if (stages.has("published") && stages.size > 1) {
      return "partial";
    } else if (stages.has("draft") && stages.size === 1) {
      return "draft";
    } else if (stages.has("archived") && stages.size === 1) {
      return "archived";
    } else {
      return "notOk";
    }
  }

export const addCalculatedAttributes = (allContentItems) => {
    let updatedContentItems = [];
    for (let i in allContentItems) {
      let currentPolicy = allContentItems[i];
      const datesList = currentPolicy.variations.map(variation =>
        Number(variation.updated)
      );
      currentPolicy["updated"] = Math.max.apply(Math, datesList);
      currentPolicy["state"] = addPolicyState(currentPolicy);
      const admins = currentPolicy.variations.map(
        vari => vari.userID
          // vari => vari.admin.userID
      );
      currentPolicy["admins"] = [...new Set(admins)]
      updatedContentItems.push(currentPolicy);
    }
    return updatedContentItems;
  }

  