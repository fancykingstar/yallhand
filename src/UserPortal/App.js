import React from 'react';
import { Switch } from 'react-router-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from 'react-router';

import Home from './views/pages/Home';
import Actions from './views/pages/Actions';
import Directory from './views/pages/Directory';
import ContentDetail from './views/pages/ContentDetail';


import history from './helpers/history';

export class UserPortal extends React.Component {
    render() {
        return (
            <div className="UserPortal">
                <Home/>
                {/* <Router history={history}>
                    <Switch>
                        <Router history={history}>
                            <Route path="/" exact component={Home} />
                            <Route path="/actions" exact component={Actions} />
                            <Route path="/directory" exact component={Directory} />
                            <Route path="/content-detail" exact component={ContentDetail} />

                        </Router>
                    </Switch>
                </Router> */}
            </div>
        );
    }
}

// export default App;
