import React from "react"
import {inject, observer} from "mobx-react"
import {Dropdown} from "semantic-ui-react"
import { giveMeKey } from "../SharedCalculations/GiveMeKey";

@inject("TeamStore")
@observer
export class PortalSelect extends React.Component {
  render(){
  const {TeamStore} = this.props;
    const allTeams = Object.keys(TeamStore.teamKey)
    const allTags = TeamStore.tags.slice()
    allTags.unshift({label: "No Tag", tagID: "none"})
    const previewPortalMenuTag = (team) => allTags.map(tag => 
        <Dropdown.Item text={tag.label} value={tag.tagID} key={giveMeKey()} onClick={e => this.props.teamChange(e, {'team': team, 'tag': tag.tagID})} />
        )

      const previewPortalMenu = allTeams.map(team =>
        
          <Dropdown.Item key={"portalView" + giveMeKey()}>
            <Dropdown text={TeamStore.teamKey[team]}>
              <Dropdown.Menu>
                {previewPortalMenuTag(team)}
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
   
      )
  
      const previewPortalMenuNoDepth = allTeams.map(team => 
        <Dropdown.Item text={TeamStore.teamKey[team]} value={team} key={team} onClick={e => this.props.teamChange(e, {'team': team, 'tag': ''})}/>
        )
  
      const portalPreview = TeamStore.tags.length !== 0 ?  previewPortalMenu : previewPortalMenuNoDepth
      
    return(
      <div className="portal-preview-dropdown">
        <Dropdown text='User Portal View' pointing className='link item' direction="left">
        <Dropdown.Menu>
        {portalPreview}
        </Dropdown.Menu>
        </Dropdown>
      </div>
    )
}}