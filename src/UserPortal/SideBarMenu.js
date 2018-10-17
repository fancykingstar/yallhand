import React from "react"
import {Menu} from "semantic-ui-react"
import {inject, observer} from "mobx-react"
import {NavLink} from "react-router-dom"

@inject("SideBarStore")
@observer
export class SideBarMenu extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
      const {SideBarStore} = this.props
        SideBarStore.loadChannels()

    }

    render() {
        const {SideBarStore} = this.props
        const channelList = SideBarStore.displayTitles.map(channel => (
            <Menu.Item
              name={channel}
              id={channel}
              onClick={e => SideBarStore.makeActive(e)}
            />
        ))
        return(
 
            <Menu vertical>
        <Menu.Item>
          <Menu.Header>Feed</Menu.Header>

          <Menu.Menu>
            <NavLink to="/portal" style={{color: "rgb(45, 45, 45)"}}>
            <Menu.Item
              name='Annoucements'
            /></NavLink>
           
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          {/* <NavLink to="/portal/learn" style={{color: "rgb(45, 45, 45)"}}> */}
          <Menu.Header>Learn</Menu.Header>
          {/* </NavLink> */}
          <Menu.Menu>
            {channelList}
            </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Resources</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              name='common'
            //   active={activeItem === 'shared'}
            //   onClick={this.handleItemClick}
            />
            <Menu.Item
              name='recently used'
            //   active={activeItem === 'dedicated'}
            //   onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Support</Menu.Header>

          <Menu.Menu>
            <Menu.Item name='email' >
              Directory
            </Menu.Item>
            <Menu.Item name='email' >
              Get Assistance
            </Menu.Item>

            
          </Menu.Menu>
        </Menu.Item>
      </Menu>

        )
    }
}




