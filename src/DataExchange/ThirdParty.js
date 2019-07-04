import React from 'react';
import {AccountStore} from "../Stores/AccountStore";
import { apiCall, apiCall_noBody, apiCall_del } from "./Fetch"
import {account} from "./Down"
import { modifyAccount } from "../DataExchange/Up";

const accountID = AccountStore.account.accountID;

export const getStripeAcct = async (id) => {
  const acct = await apiCall_noBody('accounts/billing' + id, "GET")
  if(acct) AccountStore.set("stripe","data", acct)
}

export const getStripePlan = async (id) => {
  const plan = await apiCall_noBody('accounts/billing/plans', "GET")
  if(plan) AccountStore.set("stripe","plans", plan)
}

export const createCustomer = async () => {
  const acct = await apiCall("accounts/billing", "POST", {name: AccountStore.label, metadata:{accountID:AccountStore.account.accountID}, email: AccountStore.account.generalEmail}).then(r=>r.json());
  AccountStore.set("stripe","data", acct);
  await modifyAccount({accountID:AccountStore.account.accountID,data:{stripe: acct.id}}, false)
  
}