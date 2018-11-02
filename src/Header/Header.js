import React from "react";
import { Icon, Label, Dropdown } from "semantic-ui-react";
import {inject, observer} from "mobx-react"
import {withRouter, Link} from "react-router-dom"
import "./style.css";




@inject("TeamStore", "UserStore")
@observer
class Header extends React.Component {
  constructor(props) {
    super(props) 
  }
  componentDidMount() {
    const {TeamStore} = this.props
    TeamStore.loadStructure()
  }
  render() {
    const {TeamStore} = this.props
    const {UserStore} = this.props
    const allTeams = Object.keys(TeamStore.teamKey)
    const teamChange = (e, val) => {

      UserStore.setPreviewTeam(val.team)
      UserStore.setPreviewTag(val.tag)
      UserStore.setPreviewTeamPath(TeamStore.previewValidPath(val.team, 'team'))
      UserStore.setPreviewTagPath(TeamStore.previewValidPath(val.tag, 'tag'))
      this.props.history.push('/portal')
    }
    
    


    const previewPortalMenuTag = (team) => TeamStore.classes.map(tag => 
      <Dropdown.Item text={tag.label} value={tag.tagID} key={tag.tagID} onClick={e => teamChange(e, {'team': team, 'tag': tag.classID})} />
      )

    const previewPortalMenu = allTeams.map(team =>
      
        <Dropdown.Item>
          <Dropdown text={TeamStore.teamKey[team]}>
            <Dropdown.Menu>
              {previewPortalMenuTag(team)}
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
 
    )

    const previewPortalMenuNoDepth = allTeams.map(team => 
      <Dropdown.Item text={TeamStore.teamKey[team]} value={team} key={team} onClick={e => teamChange(e, {'team': team, 'tag': ''})}/>
      )

    const portalPreview = TeamStore.classes.length !== 0 ?  previewPortalMenu : previewPortalMenuNoDepth
    
    
    return (
      <div className="Header">
        <div className="AdminHeaderControls">
          <div className="Notification">
            <Label
              style={{ marginLeft: 11, marginTop: 8, position: "absolute" }}
              circular
              empty
              color="red"
            />
            <Icon color="grey" name="bell" size="large" />
            <Dropdown text='Employee Portal' pointing className='link item'>
             <Dropdown.Menu>
              {portalPreview}
            </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="MobileMenu">
          <Link to="/panel">
          <Icon name="bars" size="large" color="black" />
          </Link>
        </div>
      </div>
    );
  }
}
export default withRouter(Header)
