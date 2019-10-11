import React from 'react';
import RecentData from '../../data/recent.json';
import { RenderHTMLContent, RenderTimeAgo } from '../../helpers/Helpers';

const user_icon_default = require("../../assets/images/user_icon.svg");
class Sidebar extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         RecentData: []
      }
   }
   componentDidMount() {
      this.setState({
         RecentData: RecentData
      })
   }
   render() {
      const { RecentData } = this.state
      return (
         <div className="side_bar_component">
            <div className="side_section_title section_title shadow">
               <h4>Recent</h4>
               {/* Sort filter remove for now */}
               {/* <div class="header_select">
                     <select>
                        <option>Sort</option>
                        <option>Recent</option>
                        <option>Popular</option>
                     </select>
                  </div> */}

            </div>
            <div className="sidebar_content">
               {RecentData.map((item, index) => {
                  return <div key={index} className="side_join_row">
                     <div className="side_join_img">
                        <img src={(item.img) ? item.img : user_icon_default} alt="" />
                     </div>
                     <div className="side_join_name">
                        <p>{RenderHTMLContent(item.msg)}</p>
                        <label>{RenderTimeAgo(item.updated)}</label>
                     </div>
                  </div>

               })}
            </div>
         </div>
      );
   }
}

export default Sidebar;
