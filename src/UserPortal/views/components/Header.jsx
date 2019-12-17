import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Dropdown as SemanticDropdown} from 'semantic-ui-react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { withRouter } from 'react-router';
import { Col, Button } from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { UserStore } from '../../../Stores/UserStore';
import { ChannelStore } from "../../../Stores/ChannelStore";
import { deleteUser } from "../../../DataExchange/Fetch";


class Header extends React.Component {
   constructor(props) {
      super(props);
      this.state = { user: null, profileMenuOpen: false }
      this.toggleProfileMenu = this.toggleProfileMenu.bind(this);
   }

   logout() {
      const { UserStore, UIStore } = this.props
      deleteUser()
      if (UIStore.isScreenLoading) UIStore.toggleScreenLoading()
      UserStore.isAuthenticated = false;
      this.props.history.push("/");
   }

   componentDidMount() {

      this.setState({ user: UserStore.user })
   }
   toggleProfileMenu() {
      this.setState(prevState => ({
         profileMenuOpen: !prevState.profileMenuOpen
      }));
   }
   render() {
      const pageTitle = this.props.pageTitle;
      const user = this.state.user;

      return (
         <div className="page-header">
            <div className="container">
               <div className="row">
                  <Col sm="12" >
                     <div className="header_inner">
                        <div className="toggle_nav">
                           <IconButton
                              color="inherit"
                              aria-label="open drawer"
                              edge="start"
                              onClick={() => this.props.toggleMenu()}
                           >
                              <MenuIcon fontSize="inherit" />
                           </IconButton>
                           <Typography variant="h4" className="page-title" noWrap>{pageTitle}</Typography>
                           {this.props.updateFilter &&
                            <SemanticDropdown style={{marginLeft: 5}} icon="chevron down">
                            <SemanticDropdown.Menu>
                               <SemanticDropdown.Item text="Newest" onClick={()=>this.props.updateFilter({sort: "new"})} />
                               <SemanticDropdown.Item text="Oldest" onClick={()=>this.props.updateFilter({sort: "old"})} />
                               <SemanticDropdown.Divider/>
                               {ChannelStore._channelSelect.map(chan => <SemanticDropdown.Item text={chan.text} key={chan.key} onClick={()=>this.props.updateFilter({channel: chan.value})}  />  )}
                            
                            </SemanticDropdown.Menu>
                         </SemanticDropdown>
                           }
                        </div>
                        <div className="header_right">
                           <div className="header_search">
                              {/* <SearchFrame/> */}
                              <div className="header_select">
                                 <Dropdown isOpen={this.state.profileMenuOpen} toggle={this.toggleProfileMenu}>
                                    <DropdownToggle tag="a" caret>
                                       <div className="user-avatar-icon">{user ? <img src={user.img} alt="" /> : <AccountCircleIcon />}</div>
                                       {user ? user.displayName : "User"}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                       <DropdownItem header>{UserStore.user.displayName_full}</DropdownItem>
                                       <DropdownItem onClick={() => this.props.history.push("/portal/settings")}>Settings...</DropdownItem>
                                       <DropdownItem onClick={() => this.logout()}>Log Out</DropdownItem>
                                    </DropdownMenu>
                                 </Dropdown>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Col>
               </div>
            </div>
         </div >
      );
   }
}

export default withRouter(Header);
