import React from "react";
import { Icon, Label, Dropdown } from "semantic-ui-react";
import {inject, observer} from "mobx-react"
import {withRouter} from "react-router-dom"
import { buildEmail } from "../Scripts/BuildEmail"
import "./style.css";
import { UIStore } from "../Stores/UIStore";




@inject("TeamStore", "UserStore", "UIStore")
@observer
class Header extends React.Component {
  render() {


    const {TeamStore, UserStore, UIStore} = this.props
    const allTeams = Object.keys(TeamStore.teamKey)
    const teamChange = (e, val) => {

      UserStore.setPreviewTeam(val.team)
      UserStore.setPreviewTag(val.tag)
      UserStore.setPreviewTeamPath(TeamStore.previewValidPath(val.team, 'team'))
      UserStore.setPreviewTagPath(TeamStore.previewValidPath(val.tag, 'tag'))
      this.props.history.push('/portal')
    }
    
    
    const backToPanel = () => {
      this.props.history.push("/panel/dashboard")
    }

    const previewPortalMenuTag = (team) => TeamStore.tags.map(tag => 
      <Dropdown.Item text={tag.label} value={tag.tagID} key={tag.tagID} onClick={e => teamChange(e, {'team': team, 'tag': tag.tagID})} />
      )

    const previewPortalMenu = allTeams.map(team =>
      
        <Dropdown.Item key={TeamStore.teamKey[team]}>
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

    const portalPreview = TeamStore.tags.length !== 0 ?  previewPortalMenu : previewPortalMenuNoDepth
    
    
    return (
      <div className="Header">
        <div className="AdminHeaderControls">
          <div className="Notification">
            {/* <Label
              style={{ marginLeft: 11, marginTop: 8, position: "absolute" }}
              circular
              empty
              color="red"
            />
            <Icon color="grey" name="bell" size="large" /> */}
            <Dropdown text='Employee Portal' pointing className='link item'>
             <Dropdown.Menu>
              {portalPreview}
            </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div 
          className="MobileMenu" 
          onClick={e => UIStore.set("responsive", "mobileNav", !UIStore.responsive.mobileNav)}
          style={!UIStore.responsive.isMobile? {display: "none"} : null }
          >
   
          <Icon name="bars" size="large" style={UIStore.responsive.mobileNav? {color:"blue"}:{color:"black"}}  />
        </div>
      </div>
    );
  }
}
export default withRouter(Header)
