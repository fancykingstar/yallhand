import { observable, action } from 'mobx';
import _ from 'lodash';
import { calculateAnalytics } from '../SharedCalculations/CalculateSurveyAnalytics';

class Store {
  @observable allPolls = [];

  @action
  set(target, key, val) {
    try {
      this.keys[target][key] = val;
    } catch (error) {
      console.log('Is the request value set in UIStore Keys?', error);
    }
  }

  reset(target, overide = {}) {
    const overideKeys = !_.isEmpty(overide) ? Object.keys(overide) : [];
    Object.keys(this.keys[target]).forEach(key => {
      if (overideKeys.length !== 0 && overideKeys.includes(key)) {
        this.keys[target][key] = overide[key];
      } else {
        switch (typeof this.keys[target][key]) {
          case 'boolean':
            this.keys[target][key] = false;
            break;
          case 'string':
            this.keys[target][key] = '';
            break;
          case 'object':
            if (Array.isArray(this.keys[target][key])) {
              this.keys[target][key] = []
            } else {
              this.keys[target][key] = {};
            }
            break;
          default:
            this.keys[target][key] = '';
            break;
        }
      }
    });
  }

  loadPolls(allPolls) {
    return new Promise((resolve) => {
      this.allPolls = calculateAnalytics(allPolls);
      resolve(true);
      // this.allPolls.length === 0 ? reject(false) : resolve(true)
    });
  }

  _getPoll(ID) {
    return this.allPolls.filter(poll => poll.pollID === ID)[0];
  }

  _dropPoll(ID) {
    this.allPolls = this.allPolls.filter(i => i.pollID !== ID);
  }
}

export const PollStore = new Store();
