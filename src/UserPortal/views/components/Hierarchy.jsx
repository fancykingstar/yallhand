import React from 'react';
import Grid from '@material-ui/core/Grid';
import StaffDetail from './StaffDetail';
import DirectoryData from '../../data/directory.json';
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

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
      this.setState({
         StaffDetailsData: DirectoryData,
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
         this.setState({ boss });
         console.log(this.state.boss);
      }
   }
   update_boss_slide(newIndex, newBoss) {
      if (newIndex !== 0 && newIndex <= 3) {
         var { boss } = this.state;
         boss[newIndex] = newBoss;
         this.setState({ boss });
         console.log(this.state.boss);
         this.slider.slickNext();
      }
   }


   render() {
      const { boss, width } = this.state;

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
                              active={(boss[i + 1] === e.displayName_full)}
                              boss={{ index: (i + 1), boss: e.displayName_full }}
                              has_child={this.check_employee_has_child(e.displayName_full)}
                              key={j}
                              view="hierarchy"

                              profile={e.img}
                              name={e.displayName_full}
                              designation={e.title}
                              department={e.dept}
                              location={e.location}
                              contact={e.phone}
                              socials={e.socials} />)}
                     </Grid>)}
               </Slider>
            </Grid>
         );
      } else {
         return (
            <Grid className="hierarchy-wrap bg-white rounded-corners" container spacing={1}>
               {boss.map((iboss, i) =>
                  <Grid key={i} className="hierarchy-group" item xs={12} sm={3}>
                     {this.get_employee(iboss).map((e, j) =>
                        <StaffDetail
                           update_boss={this.update_boss}
                           active={(boss[i + 1] === e.displayName_full)}
                           boss={{ index: (i + 1), boss: e.displayName_full }}
                           has_child={this.check_employee_has_child(e.displayName_full)}
                           key={j}
                           view="hierarchy"

                           profile={e.img}
                           name={e.displayName_full}
                           designation={e.title}
                           department={e.dept}
                           location={e.location}
                           contact={e.phone}
                           socials={e.socials} />)}
                  </Grid>)}
            </Grid>
         );
      }

   }
}

export default Hierarchy;
