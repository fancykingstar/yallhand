import { observable, action } from "mobx";

class Store {
    @observable
    isAuthenticated = true;

    @observable
    account = []

    @action
    loadAccount() {
    const accountData = require("../MockData/Account.json");
    this.account = accountData}

}

export const UserStore = new Store()