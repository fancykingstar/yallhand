import { observable } from "mobx";

class Store {
    @observable
    isAuthenticated = true;
}

export const UserStore = new Store()