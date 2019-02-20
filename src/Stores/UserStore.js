import { observable, action } from "mobx";
import _ from "lodash";

class Store {
  @observable
  isAuthenticated = true;

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
      this.user = val;
      _.isEmpty(this.user) ? reject(false) : resolve(true);
    });
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
