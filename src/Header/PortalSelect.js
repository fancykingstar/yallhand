import React from "react"
import {Dropdown} from "semantic-ui-react"
import {TeamStore} from "../Stores/TeamStore"

export const PortalSelect = (props) => {
    const allTeams = Object.keys(TeamStore.teamKey)
    const previewPortalMenuTag = (team) => TeamStore.tags.map(tag => 
        <Dropdown.Item text={tag.label} value={tag.tagID} key={tag.tagID} onClick={e => props.teamChange(e, {'team': team, 'tag': tag.tagID})} />
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
        <Dropdown.Item text={TeamStore.teamKey[team]} value={team} key={team} onClick={e => props.teamChange(e, {'team': team, 'tag': ''})}/>
        )
  
      const portalPreview = TeamStore.tags.length !== 0 ?  previewPortalMenu : previewPortalMenuNoDepth
      
    return(
        <Dropdown text='Employee Portal' pointing className='link item' direction="left">
        <Dropdown.Menu>
        {portalPreview}
        </Dropdown.Menu>
        </Dropdown>
    )
}