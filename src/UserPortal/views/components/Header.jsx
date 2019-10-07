import React from 'react';
import { Col } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import user_icon from "../../assets/images/user_icon.svg";

import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { UserStore } from '../../../Stores/UserStore';

class Header extends React.Component {
   constructor(props) {
      super(props);
      this.state = { user: null, profileMenuOpen: false }
      this.toggleProfileMenu = this.toggleProfileMenu.bind(this);
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
      console.log(user);
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
                        </div>
                        <div className="header_right">
                           <div className="header_search">
                              {/* <form>
                                 <div className="search_div">
                                    <input type="text" name="search" placeholder="Search"></input>
                                    <button><img src={search_icon} alt="" /></button>
                                 </div>
                              </form> */}
                              <div className="header_select">
                                 <Dropdown isOpen={this.state.profileMenuOpen} toggle={this.toggleProfileMenu}>
                                    <DropdownToggle tag="a" caret>
                                       {user ? <img src={user.img} alt="" /> : <AccountCircleIcon />}
                                       {user ? user.displayName : "User"}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                       <DropdownItem header>Header</DropdownItem>
                                       <DropdownItem disabled>Action</DropdownItem>
                                       <DropdownItem>Another Action</DropdownItem>
                                       <DropdownItem divider />
                                       <DropdownItem>Another Action</DropdownItem>
                                    </DropdownMenu>
                                 </Dropdown>
                                 {/* <select>
                                    <option>{user ? user.displayName : ""}</option>
                                    
                                 </select> */}
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

export default Header;
