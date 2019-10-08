import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import user_icon from "../../assets/images/user_icon.svg";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {withRouter} from 'react-router';
import { Col, Button } from 'reactstrap';
import search_icon from "../../assets/images/search_icon.svg";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {UserStore} from '../../../Stores/UserStore';
import SearchFrame from "../pages/SearchFrame";

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
                           {/* {UserStore.user.isAdmin && */}
                                  <div>
                                    <Button size="sm" onClick={()=> this.props.history.push('/panel')}>Admin Panel</Button>
                                  </div>
                           {/* } */}
                        <div className="header_right">
                           <div className="header_search">
                             <SearchFrame/>
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

export default withRouter(Header);
