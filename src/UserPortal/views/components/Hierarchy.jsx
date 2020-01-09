import React from 'react';
import Grid from '@material-ui/core/Grid';
import {inject, observer} from "mobx-react"
import StaffDetail from './StaffDetail';
import DirectoryData from '../../data/directory.json';
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';
import superviseduser_icon from "../../assets/images/superviseduser_grey.svg";
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

@inject("AccountStore")
@observer
class Hierarchy extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         width: 0, height: 0,
         StaffDetailsData: [],
         boss: ["self"]
      }
      this.update_boss = this.update_boss.bind(this);
      this.update_boss_slide = this.update_boss_slide.bind(this);
   }

   componentDidMount() {
      const { AccountStore } = this.props;
      const allUsers = AccountStore._allActiveUsers || [];
      let users = allUsers.map(user => {
         if (typeof user.boss == 'undefined' || user.boss == "" || user.boss === user.userID) user = {...user, boss: "self"};
         return user;
      });

      this.setState({
         StaffDetailsData: users,
      });
      this.setState({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", this.updateWindowDimensions);
   }
   componentWillUnmount() {
      window.removeEventListener("resize", this.updateWindowDimensions);
   }
   updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
   };

   get_employee(boss) {
      var { StaffDetailsData } = this.state;
      boss = typeof boss !== 'undefined' ? boss : 'self';
      var returnData = StaffDetailsData.filter(item => item.boss === boss);
      return returnData;
   }

   check_employee_has_child(boss) {
      var { StaffDetailsData } = this.state;
      boss = typeof boss !== 'undefined' ? boss : 'self';
      var returnData = StaffDetailsData.filter(item => item.boss === boss);
      if (returnData.length > 0) {
         return true;
      } else {
         return false;
      }
   }

   update_boss(newIndex, newBoss) {
      if (newIndex !== 0 && newIndex <= 3) {
         var { boss } = this.state;
         boss[newIndex] = newBoss;
         var b = []
         for (var i = 0; i <= newIndex; i ++) {
            b.push(boss[i]);
         }
         this.setState({ boss: b });
      }
   }
   update_boss_slide(newIndex, newBoss) {
      if (newIndex !== 0 && newIndex <= 3) {
         var { boss } = this.state;
         boss[newIndex] = newBoss;
         var b = []
         for (var i = 0; i <= newIndex; i ++) {
            b.push(boss[i]);
         }
         this.setState({ boss: b });
         this.slider.slickNext();
      }
   }

   socials = (user) => {
      let socials = {}
      if(user.profile.Twitter !== "" && user.profile.Twitter !== undefined) { socials = { ...socials, "github": `https://twitter.com/${user.profile.Twitter}` } }
      if(user.profile.Medium !== "" && user.profile.Medium !== undefined) { socials = { ...socials, "medium": `https://medium.com/@${user.profile.Medium}` } }
      if(user.profile.Github !== "" && user.profile.Github !== undefined) { socials = { ...socials, "twitter": `https://github.com/${user.profile.Twitter}` } }
      if(user.profile.LinkedIn !== "" && user.profile.LinkedIn !== undefined) { socials = { ...socials, "linkedin": `https://linkedin.com/${user.profile.LinkedIn}` } }
      return socials
   }

   render() {
      const { boss, width } = this.state;
      const { AccountStore } = this.props;

      if (width < 600) {
         const settings = {
            dots: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: false,
            prevArrow: <SamplePrevArrow />,
         };
         return (
            <Grid className="hierarchy-wrap slider bg-white rounded-corners " >
               <Slider ref={slider => (this.slider = slider)} {...settings}>
                  {boss.map((iboss, i) =>
                     <Grid key={i} className="hierarchy-group">
                        {this.get_employee(iboss).map((e, j) =>
                           <StaffDetail
                              update_boss={this.update_boss_slide}
                              active={(boss[i + 1] === e.userID)}
                              boss={{ index: (i + 1), boss: e.userID }}
                              has_child={this.check_employee_has_child(e.userID)}
                              key={j}
                              view="hierarchy"

                              profile={e.img}
                              name={e.displayName_full}
                              designation={e.profile.Title}
                              department={e.profile.Department}
                              location={e.profile.Location}
                              contact={e.phone}
                              email={e.email}
                              socials={this.socials(e)} />)}
                     </Grid>)}
               </Slider>
            </Grid>
         );
      } else {
         return (
            <>
               <Grid className="rounded-corners" container spacing={1}>
                  {boss.map((iboss, i) => {
                     const user = AccountStore._getUser(iboss)
                     let department = user ? user.profile['Department'] ? user.profile['Department'] : "" : ""
                     let boss = user ? user.displayName_full + " (" + department + ")" : ""
                     return <Grid className="hierarchy-group" item xs={12} sm={3} key={i}>
                        <ListItem style={{ display: i === 0 ? "none" : "flex" }} className="justify-content-center">
                           <ListItemIcon style={{ marginRight: "-3px" }}>
                              <img src={superviseduser_icon} alt="" width="20" />
                           </ListItemIcon>
                           <ListItemText secondary={<Typography type="body2" style={{ fontFamily: "Rubik", color: "#88878f" }}>{boss}</Typography>} style={{ flex: "inherit" }} />
                        </ListItem>
                     </Grid>
                     }
                  )}
               </Grid>
               <Grid className="hierarchy-wrap bg-white rounded-corners" container spacing={1}>
                  {boss.map((iboss, i) => 
                     <Grid key={i} className="hierarchy-group" item xs={12} sm={3}>
                        {this.get_employee(iboss).map((e, j) =>
                           <StaffDetail
                              update_boss={this.update_boss}
                              active={(boss[i + 1] === e.userID)}
                              boss={{ index: (i + 1), boss: e.userID }}
                              has_child={this.check_employee_has_child(e.userID)}
                              key={j}
                              view="hierarchy"

                              profile={e.img}
                              name={e.displayName_full}
                              designation={e.profile.Title}
                              department={e.profile.Department}
                              location={e.profile.Location}
                              contact={e.phone}
                              email={e.email}
                              socials={this.socials(e)} />)}
                     </Grid>)}
               </Grid>
            </>
         );
      }

   }
}

export default Hierarchy;
