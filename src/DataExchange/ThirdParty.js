import React from 'react';
import {AccountStore} from "../Stores/AccountStore";
import { apiCall, apiCall_noBody, apiCall_del } from "./Fetch"
import {account} from "./Down"
import { modifyAccount } from "../DataExchange/Up";

const accountID = AccountStore.account.accountID;

export const getStripeAcct = async (id) => {
  const acct = await apiCall_noBody('accounts/billing/' + id, "GET")
  if(acct) AccountStore.set("stripe","data", acct)

}

export const getStripePlan = async (id) => {
  const plan = await apiCall_noBody('accounts/billing/plans', "GET")
  if(plan) AccountStore.set("stripe","plans", plan)
}

export const createCustomer = async () => {
  let acct = await apiCall("accounts/billing", "POST", {name: AccountStore.label, metadata:{accountID:AccountStore.account.accountID}, email: AccountStore.account.generalEmail}).then(r=>r.json());
  const subscription = await apiCall("accounts/subscription", "POST", {customer: acct.id, items: [{plan: process.env.REACT_APP_STRIPE_PLAN_ID, quantity: AccountStore._allActiveUsers.length}], trial_period_days: 14}).then(r=>r.json());
  await acct.subscriptions.data.push(subscription);
  AccountStore.set("stripe","data", acct);
  await modifyAccount({accountID:AccountStore.account.accountID,data:{stripe: acct.id},plan:"pro"}, false)
}

export const addPaymentMethod = async (id, source) => {
  const acct = await apiCall("accounts/billing/"+id, "PATCH", {source}).then(r=>r.json());
  AccountStore.set("stripe","data", acct);
}

export const endSubscription = async (id, payload) => {
  const subscription = await apiCall_noBody("accounts/subscription/end/"+id, "GET");
  console.log(subscription)
  // AccountStore.set("stripe","data", acct);
}

export const deletePaymentMethod = async (id, sourceId) => {
  await apiCall_noBody(`accounts/billing/${id}/source/${sourceId}`, "DELETE")
}

export const deleteSubscription= async (id) => {
  await apiCall_noBody('accounts/subscription/'+id, "DELETE")
}

export const getInvoicePreview = async (id) => {
  const inv = await apiCall_noBody(`/billing/upcoming/${id}`, "GET")
  if (!inv.error) AccountStore.set("stripe","invoice", inv);
}

export const createSubscription = async () => {
  let acct = AccountStore.stripe.data
  const subscription = await apiCall("accounts/subscription", "POST", {customer: acct.id, items: [{plan: process.env.REACT_APP_STRIPE_PLAN_ID, quantity: AccountStore._allActiveUsers.length}]}).then(r=>r.json());
  await acct.subscriptions.data.push(subscription);
  await AccountStore.set("stripe","data", acct);
}