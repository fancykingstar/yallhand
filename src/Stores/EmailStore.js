import { observable, action, computed } from "mobx";
import _ from "lodash";
class Store {
      ///This type of referencing only works using OBJECTS, not primitives
      keys = {
        queue: this.queue
    }
    // @observable
    // allBundles = []

    @observable
    allCampaigns = []

    @observable
    queue = {
            bundleID: "",
            isQueue: true,
            bundle: [],
            label: "",
            subject: "",
            draft: {},
            draftContentHTML: "",
            draftContentRAW: [],
            stage: "active",
            updated: "",
    }




    @action
    set(target, key, val){
        try {
        this.keys[target][key] = val
        }
        catch (error) {
            console.log("Is the request value set in UIStore Keys?", error);
          }
    }
    
    reset(target, overide = {}) {
      const overideKeys =
       !_.isEmpty(overide) ? Object.keys(overide) : []
        Object.keys(this.keys[target]).forEach(key => {
          if (overideKeys.length !== 0 && overideKeys.includes(key)) {
            this.keys[target][key] = overide[key]
          } else {
          switch (typeof this.keys[target][key]) {
            case "boolean":
              this.keys[target][key] = false;
              break;
            case "string":
              this.keys[target][key] = "";
              break;
            case "number":
              this.keys[target][key] = 0;
              break;
            case "object":
              Array.isArray(this.keys[target][key])
                ? (this.keys[target][key] = [])
                : (this.keys[target][key] = {});
              break;
            default:
              this.keys[target][key] = "";
              break;
          }
        }
        });
    
      }

    // loadBundles(allBundles) {
    //   return new Promise((resolve, reject) => {
    //     this.allBundles = allBundles
    //       resolve(true)
    //   }) 
    // }

    loadCampaigns(allCampaigns) {
      return new Promise((resolve, reject) => {
        this.allCampaigns = allCampaigns
          resolve(true)
      }) 
    }

    // _getBundle(id){
    //   return this.allBundles.filter(bundle => bundle.bundleID === id)[0]
    // }
    _getCampaign(id){
      return this.allCampaigns.filter(campaign => campaign.campaignID === id)[0]
    }

    // _doesBundleContain(id, bundleID){
    //   const collection = this._getBundle(bundleID).bundle
    //   const allIDs = []
    //   collection.forEach(content => allIDs.push(Object.values(content)[0]))
    //   return allIDs.includes(id)
    // }


    // @computed
    // get _activeBundles() {
    //   return this.allBundles.filter(bundle => bundle.stage === "active" && bundle.bundleID !== "queue")
    // }

  


    
   
}

export const EmailStore = new Store()