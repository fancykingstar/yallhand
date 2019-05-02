import {apiCall, apiCall_noBody} from "./Fetch"

export const writePolicy = (policy, variation, activeAdmin) => {
        return new Promise((resolve, reject) => {
        let payload = policy
        const variationLocal = variation
        payload.variations.length === 0 ? payload.variations = [variationLocal] : payload.variations.push(variationLocal)
        payload.variations = JSON.stringify(payload.variations)
        if(payload.chanID === null) {payload.chanID = ""}
        if(payload.img === null) {payload.img = ""}
        apiCall("policies/" + payload.accountID, "POST", payload).then(response => {
        if(response.status === 200) {
            resolve({"data": payload, "response": response})
        }
        else {
            reject(console.log(response))
        }
        })})
}

// export const modifyPolicy = (policy, variation, activeAdmin) => {
//         return new Promise((resolve, reject) => {
//         let payload = policy
//         const variationLocal = variation
//         payload.variations = policy.variations.filter(vari => vari.variationID !== variationLocal.variationID)
//         payload.variations.push(variationLocal)
//         payload.variations = JSON.stringify(payload.variations)
//         delete payload["admins"]
//         delete payload["updated"]
//         delete payload["state"]
//         apiCall("policies/" + payload.policyID, "PUT", payload).then(response => {
//                 if(response.status === 200 || response.status === 204) {
//                     resolve({"data": payload, "response": response})
//                 }
//                 else {
//                     reject(console.log(response))
//                 }
//                 })
//             })
// }
export const modifyPolicy = (policy, variation) => {
    return new Promise((resolve, reject) => {
    let payload = {}
    payload["accountID"] = policy.accountID
    payload["policyID"] = policy.policyID
    const variationLocal = variation
    payload.variations = policy.variations.filter(vari => vari.variationID !== variationLocal.variationID)
    payload.variations.push(variationLocal)
    payload.variations = JSON.stringify(payload.variations)
    apiCall("policies/" + payload.policyID, "PATCH", payload).then(response => {
            if(response.status === 200 || response.status === 204) {
                let returnData = policy
                returnData.variations = payload.variations
                resolve({"data": returnData, "response": response})
            }
            else {
                reject(console.log(response))
            }
            })
        })
}

export const patchPolicy = (policyID, accountID, object) => {
    let payload = object
    payload["accountID"] = accountID
    payload["policyID"] = policyID
    return new Promise((resolve, reject) => {
    apiCall("policies/" + policyID, "PATCH", payload).then(response => {
        if(response.status === 200 || response.status === 204) {
            resolve({"data": payload, "response": response})
        }
        else {
            reject(console.log(response))
        }
        })
})}


export const getAdminPolicies = async (accountID, userID) => {
        return await apiCall_noBody("policies/" + accountID, "GET")
}


export const getUserPolicies = () => {}

export const updatePolicy = () => {}

