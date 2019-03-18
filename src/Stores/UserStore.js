import { observable, action } from "mobx";
import { getDefaultUserImg } from "../SharedCalculations/GetDefaultUserImg"
import _ from "lodash";

class Store {
  @observable
  isAuthenticated = false;

  @observable
  user = null;

  ///Persists between Admin and User Portal
  @observable previewTeam = "";
  @observable previewTeamPath = "";
  @observable previewTag = "";
  @observable previewTagPath = "";

  @action
  loadUser(val) {
    return new Promise((resolve, reject) => {
      let user = Object.assign({}, val)
      user.img === "" || user.img === undefined ? user.img = getDefaultUserImg(user.userID) : null
      this.user = user
      resolve(true)
    })
  }

  setPreviewTeam(val) {
    this.previewTeam = val;
  }

  setPreviewTag(val) {
    this.previewTag = val;
  }

  setPreviewTeamPath(val) {
    this.previewTeamPath = val;
  }

  setPreviewTagPath(val) {
    this.previewTagPath = val;
  }
}

export const UserStore = new Store();
