import React from "react";
import ProfileInfo from "./ProfileInfo"
import ProfileLogin from "./ProfileLogin"
import PrimaryLogins from "./PrimaryLogins"
import { withRouter } from "react-router-dom";
import "./style.css";
import {inject, observer} from "mobx-react"

@inject("UIStore")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: (props.location.pathname === '/login') ? 'reauth' : 'register',
      item: {
        code: null
      }
    };
  }

  componentWillMount() {
    this.ckeckForCode()
  }

  next (str, item) {
    if (item) this.setState({view: str, item: item})
    else this.setState({view: str})
  }

  ckeckForCode () {
    const { item } = this.state
    const { location } = this.props

    if (location.search && location.search.indexOf('inviteCode') > -1 && !item.code) {
      this.setState({item: {code: location.search.replace('?inviteCode=', '')}})
    }
  }

  render() {
    const { UIStore } = this.props
    const { item } = this.state
    const views = {
      "reauth": <PrimaryLogins stage="reauth" next={(...args) => this.next(...args)}/>,
      "reauthEmail": <PrimaryLogins stage="reauthEmail"/>,
      "register": <PrimaryLogins stage="register" code={item.code} next={(...args) => this.next(...args)}/>,
      "profileinfo": <ProfileInfo gmail={false} item={item}/>,
      "profileinfoGmail": <ProfileInfo gmail={true} item={item}/>,
      "login": <ProfileLogin gmail={false}/>,
    }

    return (
      <div className="LoginFrame">
        {!UIStore.isScreenLoading && views[this.state.view]}
      </div>
    );
  }
}

export default withRouter(Login);