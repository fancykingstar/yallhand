import { observable, action, computed } from "mobx";
// import {calculateAnalytics} from "../SharedCalculations/CalculateSurveyAnalytics";
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

  


  loadTickets(allTickets) {
    return new Promise((resolve, reject) => {
    //   this.allTickets = calculateAnalytics(allTickets);
      this.allTickets = allTickets;
      resolve(true)
      // this.allSurveys.length === 0 ? reject(false) : resolve(true)
    })
  }


  _getTicket(ID) {
    return this.allTickets.filter(ticket => ticket.ticketID === ID)[0]
  }


}

export const TicketingStore = new Store()