import { observable, action } from "mobx";

class Store {
    @observable
    isAuthenticated = true;

    @observable
    account = []

    @observable
    previewTeam = 'team01'

    @observable
    previewTeamPath = ''

    @observable
    previewTag = ''

    @observable
    previewTagPath = ''

    @action
    loadAccount() {
    const accountData = require("../MockData/Account.json");
    this.account = accountData}

    @action
    setPreviewTeam(val) {
        this.previewTeam = val
    }

    setPreviewTag(val) {
        this.previewTag = val
    }

    setPreviewTeamPath(val) {
        this.previewTeamPath = val
    }

    setPreviewTagPath(val) {
        this.previewTagPath = val
    }

   
}

export const UserStore = new Store()