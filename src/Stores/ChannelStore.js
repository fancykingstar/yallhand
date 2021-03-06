import { observable, action, computed } from "mobx";
import { giveMeKey } from "../SharedCalculations/GiveMeKey";
import { UserStore } from "../Stores/UserStore";



class Store {
  @observable
  allChannels=[]

  @action
  set(target, val) {
   const targets = {
      "allChannels": this.allChannels = val
    }
    targets[target] = val
  }


  loadChannels = channels => {
    return new Promise((resolve, reject) => {
      this.set("allChannels", channels)
      resolve(true)
}) 
  };

  _getChannel(id) {
    return this.allChannels.filter(chan => chan.chanID === id)[0] 
  }

  _getLabel(id) {
    if(id === "All") return "All"
    const chan = this._getChannel(id);
    return chan? chan.label : "Other"

  }
  @computed
  get _channelSelect() {
    const channelLimits =  UserStore.user && UserStore.user.adminLimits && UserStore.user.adminLimits.channels? UserStore.user.adminLimits.channels : [];
    const options =  ChannelStore.allChannels.map(chan =>({"key": "chan" + giveMeKey(), "text": chan.label, "value": chan.chanID}))
    if(!channelLimits.length) options.unshift({"key": "allChan", "text": "All", "value": "All"})
    return options
  }

  @computed
  get _channelSelectNoAll() {
    return ChannelStore.allChannels.map(chan =>({"key": "chan" + giveMeKey(), "text": chan.label, "value": chan.chanID}))
   
  }


}

export const ChannelStore = new Store();
