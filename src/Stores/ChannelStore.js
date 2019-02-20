import { observable, action, computed } from "mobx";


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
      this.allChannels.length === 0 ? reject(false) : resolve(true)
}) 
  };
  // delChannel(oldItem) {
  //   const newList = this.channelTitles.filter(e => e !== oldItem);
  //   this.channelTitles = newList;
  // }

  // loadChannelSelectOptions = () => {
  //   const options = this.displayTitles.map(chan => ({'key': chan, 'text': chan, 'value': this.channelKeys[chan]}))
  //   options.unshift({'key': 'all channels', 'text': 'All Channels', 'value': 'All'})
  //   this.channelSelectOptions = options
  // }

  // handleSearch = term => {
  //   if (term) {
  //     this.displayTitles = this.channelTitles.filter(channel =>
  //       channel.toLowerCase().includes(term.toLowerCase())
  //     );
  //   } else {
  //     this.displayTitles = this.channelTitles;
  //   }
  // };

  _getChannel(id) {
    return this.allChannels.filter(chan => chan.chanID === id)[0] 
  }
  @computed
  get _channelSelect() {
    const options =  ChannelStore.allChannels.map(chan =>({"key": "chan" + chan.label, "text": chan.label, "value": chan.chanID}))
    options.unshift({"key": "allChan", "text": "All", "value": "All"})
    return options
  }


}

export const ChannelStore = new Store();
