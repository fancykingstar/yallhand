import { observable, action } from "mobx";

class Store {
  @observable
  active = 'All';
  @observable
  channelTitles = [];
  @observable
  displayTitles = [];
  @observable
  addChannelMod = false;
  @observable
  newTitle = "";
  @observable
  channelKeys = {'All': null}

  @action
  makeActive(e) {
    this.active = e.currentTarget.id;
  }

  
  checkActive = chan => {
    return chan === this.active ? true : false;
  };

  closeMod(e) {
    e.preventDefault();
    this.addChannelMod = false;
  }

  openMod(e) {
    e.preventDefault();
    this.addChannelMod = true;
  }

  addChannel(e) {
    e.preventDefault();
    this.channelTitles.push(this.newTitle);
    this.displayTitles = this.channelTitles;
    this.channelKeys[this.newTitle] = Math.random().toString(16).slice(2, 8).toUpperCase()
    console.log(this.channelKeys[this.newTitle])
    this.closeMod(e);
  }
  loadChannels = chanObj => {
    const channels = require("../MockData/Channels.json");
    this.channelTitles = channels.map(channel => channel.label)
    this.displayTitles = this.channelTitles;
    for (let i in channels) {this.channelKeys[channels[i]['label']] = channels[i]['chanID']}
  };
  delChannel(oldItem) {
    const newList = this.channelTitles.filter(e => e !== oldItem);
    this.channelTitles = newList;
  }
  addTitle(val) {
    this.newTitle = val;
  }
  handleSearch = term => {
    if (term) {
      this.displayTitles = this.channelTitles.filter(channel =>
        channel.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      this.displayTitles = this.channelTitles;
    }
  };
}

export const SideBarStore = new Store();
