import { observable, action, computed } from "mobx";
import {calculateTicketing} from "../SharedCalculations/CalculateTicketing";
import { AccountStore } from "../Stores/AccountStore";
import _ from "lodash";

class Store {
  @observable allTickets = []


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
    const overideKeys = !_.isEmpty(overide) ? Object.keys(overide) : []
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
        case "object":
          Array.isArray(this.keys[target][key])
            ? (this.keys[target][key] = [])
            : (this.keys[target][key] = {});
          break;
        default:
          this.keys[target][key] = "";
          break;
      }}
    });
  }

  


  async loadTickets(allTickets) {
    // return new Promise((resolve, reject) => {
      this.allTickets = await calculateTicketing(allTickets);
      // resolve(true)
      // this.allSurveys.length === 0 ? reject(false) : resolve(true)
    // })
  }


  _getTicket(ID) {
    const ticket = this.allTickets.filter(ticket => ticket.ticketID === ID)[0];
    return ticket;
  }


  @computed
  get _currentAssignees(){
    return [{name: "Unassigned", id: ""}, ...this.allTickets.filter(ticket => ticket._currentAssignee).map(ticket => ({name: AccountStore._getDisplayName(ticket._currentAssignee), id: ticket._currentAssignee}))];
  };

  @computed
  get _allStages(){
    return this.allTickets.filter(ticket => ticket._stage).map(ticket => {
      if (ticket._stage.includes('open')) return "open";
      else if (ticket._stage.includes('close')) return "closed";
      else return ticket._stage
    });
  };

  @computed
  get _allTitles(){
    return this.allTickets.filter(ticket => ticket.label || ticket._content).map(ticket => ticket.label || ticket._content.label);
  };


}

export const TicketingStore = new Store()