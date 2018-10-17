import { observable, action } from "mobx";

class Store {
    @observable
    isAuthenticated = true;

    @observable
    account = []

    @observable
    previewTeam = 'team01'

    @observable
    previewTag = ''

    @action
    loadAccount() {
    const accountData = require("../MockData/Account.json");
    this.account = accountData}

    @action
    setPreviewTeam(val) {
        this.previewTag = val
    }

    setPreviewTag(val) {
        this.previewTag = val
    }
}

export const UserStore = new Store()