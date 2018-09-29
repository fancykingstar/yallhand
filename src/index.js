import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import {SideBarStore} from "./Stores/SideBarStore"

const Root = (
  <Provider SideBarStore={SideBarStore}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
 </Provider>
)

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
