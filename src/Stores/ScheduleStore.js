import { observable, action } from "mobx";
// import _ from "lodash";
class Store {

    @observable
    allScheduled = {}

    @action
    
    loadScheduled(sched) {
      return new Promise((resolve, reject) => {
        this.allScheduled = sched
          resolve(true)
    }) 
  } 


    _getSchedule(ID) {
      return this.allScheduled.filter(user => user.scheduleID === ID)[0]
    }



   
    
   
}

export const ScheduleStore = new Store()