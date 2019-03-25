import React from "react"
import {Menu, Dropdown } from "semantic-ui-react"

export class SuperAdminNav extends React.Component {
  constructor(props){
    super(props)
    this.state={active: "accounts"}
  }
    render(){
      const handleItemClick = (val) => {
        this.setState({active: val})
        this.props.updateNav(val)
       
      }
        return(
            <div>
                <Menu inverted>

      <Dropdown item simple text='Accounts' direction='right' 
       options={ [ { "text": "Edit...", "value": "edit account"}, { "text": "Create...", "value": "create account"} ] } 
       onChange={(e, val) => handleItemClick(val.value)}
        />
         <Menu.Item
          name='users'
          onClick={e => handleItemClick("users")}
          active={this.state.active === "users"}
        >
          Users
        </Menu.Item>
        <Menu.Item
          name='analytics'
          onClick={e => handleItemClick("analytics")}
          active={this.state.active === "analytics"}
        >
          Analytics
        </Menu.Item>
        <Menu.Item
          name='test'
          onClick={e => handleItemClick("test")}
          active={this.state.active === "test"}
        >
          Test Features
        </Menu.Item>
      </Menu>

            </div>
        )
    }
}