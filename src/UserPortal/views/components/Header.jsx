import React from 'react';
import { Col } from 'reactstrap';
import search_icon from "../../assets/images/search_icon.svg";
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {UserStore} from '../../../Stores/UserStore';

class Header extends React.Component {
   constructor(props){
      super(props);
      this.state={user: null}
   }
   componentDidMount(){

      this.setState({user: UserStore.user})
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
                                 <select>
                                    <option>{user? user.displayName: ""}</option>
                                    {/* <option>Edward1</option>
                                    <option>Edward2</option> */}
                                 </select>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Col>
               </div>
            </div>
         </div>
      );
   }
}

export default Header;
