export const stringsToObjs_policy = (payload) => {
    let newPayload = payload
 
    newPayload.variations = JSON.parse(payload.variations.split("'").join('"'))
    return newPayload
}

export const policiesMapper = (allPolicies) => {
    return allPolicies.map(policy => stringsToObjs_policy(policy))
} 