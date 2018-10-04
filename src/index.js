import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import {SideBarStore} from "./Stores/SideBarStore";
import {PoliciesStore} from "./Stores/PoliciesStore";
import {UserStore} from "./Stores/UserStore"

const Root = (
  <Provider SideBarStore={SideBarStore} PoliciesStore={PoliciesStore} UserStore={UserStore}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
 </Provider>
)

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
