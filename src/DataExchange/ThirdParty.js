import React from 'react';
import {AccountStore} from "../Stores/AccountStore";

export const getStripeAcct = async (id) => {
    fetch('https://api.stripe.com/v1/customers/' + id, {
      method: 'GET',
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {"Authorization":`Bearer ${process.env.REACT_APP_STRIPE}`,"Content-Type":"application/x-www-form-urlencoded"},
    }).then(response => response.json()).then(r=>AccountStore.loadStripe(r));
  }