import {observable, action} from 'mobx'

class TestStore {
    @observable myList = ['1','2','3'];
    @action
    addToList(newItem) {
        this.myList.push(newItem)
    }
} 

const Store = new TestStore();
export default Store;