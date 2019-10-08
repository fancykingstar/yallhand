import React from 'react';
import {withRouter} from 'react-router';
import { Col, Button } from 'reactstrap';
import search_icon from "../../assets/images/search_icon.svg";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {UserStore} from '../../../Stores/UserStore';
import SearchFrame from "../pages/SearchFrame";

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
                           {/* {UserStore.user.isAdmin && */}
                                  <div>
                                    <Button size="sm" onClick={()=> this.props.history.push('/panel')}>Admin Panel</Button>
                                  </div>
                           {/* } */}
                        <div className="header_right">
                           <div className="header_search">
                             <SearchFrame/>
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

export default withRouter(Header);
