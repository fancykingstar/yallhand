import React from 'react';
import { inject, observer } from "mobx-react";
import { Switch } from 'react-router-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from 'react-router';
import { loadAdmin } from "../DataExchange/LoadProfile";

import Home from './views/pages/Home';
import Actions from './views/pages/Actions';
import Directory from './views/pages/Directory';
import ContentDetail from './views/pages/ContentDetail';
import ContentList from "./views/pages/ContentList";
import SurveyList from "./views/pages/SurveyList";
import TaskList from "./views/pages/TaskList";
import PortalSearchResults from "./views/pages/PortalSearchResults";
import Settings from "./views/pages/Settings";
import Storage from "./views/pages/Storage";

import history from './helpers/history';

@inject("AnnouncementsStore", "PoliciesStore", "UserStore", "UIStore")
@observer
export class UserPortal extends React.Component {
    constructor(props){
    super(props)
    this.state={loaded: false}
  }
  componentDidMount() {
    const { UserStore } = this.props;
    if (UserStore.previewTeam !== "") {
      loadAdmin().then(()=>this.setState({loaded:true})) 
    }
    else {this.setState({loaded:true})}
  }

  componentWillMount() {
    const { location } = this.props;
    if (location.search && location.search.indexOf('data=') > -1) apiCall_pixel(`1x1pixel.gif${location.search}`);
  }
  componentWillUnmount() {
    const {UIStore} = this.props;
    UIStore.set("adminLoadingComplete", "all", false);
  }
    render() {
      const {UIStore} = this.props;
        return (
            
            <div className="UserPortal">
                {/* <Router history={history}> */}
                {!UIStore._adminLoadingComplete || !this.state.loaded ? (
      <div />
    ) : (
                    <Switch location={this.props.location}>
                        {/* <Router history={history}> */}
                            <Route path="/portal" exact component={Home} />
                            <Route path="/portal/actions" exact component={Actions} />
                            <Route path="/portal/announcements" exact component={ContentList} />
                            <Route path="/portal/learn" component={ContentList} exact/>
                            <Route path="/portal/surveys" component={SurveyList} exact/>
                            <Route path="/portal/tasks" component={TaskList} exact/>
                            <Route path="/portal/search" component={PortalSearchResults} exact />
                            <Route path="/portal/settings" component={Settings} exact />
                            <Route path="/portal/storage" component={Storage} exact />
                            {/* <Route path="/directory" exact component={Directory} />
                            <Route path="/content-detail/" exact component={ContentDetail} /> */}

                            <Route path="/portal/announcement/:id" render={props => <ContentDetail {...props} mode="announcement" />} exact />
                            <Route path="/portal/learn-detail/:id" render={props => <ContentDetail {...props} mode="policy" />} exact />

                        {/* </Router> */}
                    </Switch>)}
                {/* </Router> */}
            </div>
        );
    }
}

// export default App;
