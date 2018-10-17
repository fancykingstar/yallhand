import React from "react";
import { Icon, Label, Dropdown } from "semantic-ui-react";
import {inject, observer} from "mobx-react"
import {withRouter} from "react-router-dom"
import "./style.css";




@inject("TeamStore", "UserStore", "PoliciesStore")
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
      // const {PoliciesStore} = this.props
      // PoliciesStore.loadPolicies()
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
          <Icon name="bars" size="large" color="black" />
        </div>
      </div>
    );
  }
}
export default withRouter(Header)
