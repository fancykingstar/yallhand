import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'mobx-react'
// import Store from './Store'
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

const Root = (
    // <Provider Store={Store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
// </Provider>
)

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
