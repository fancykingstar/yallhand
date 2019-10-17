import React from 'react';
import { Container } from 'reactstrap';
import Layout from '../../layouts/DefaultLayout';

import Slider from "react-slick";
import IconBox from "../components/IconBox";

import ActionsForm from "../components/ActionsForm";


import ActionsData from '../../data/actions.json';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

import Star from '../../assets/images/star.svg';
import StarIcon from '@material-ui/icons/Star';

import AskManagement from '../../assets/images/actions/askManagement.svg';
import RefereCandidate from '../../assets/images/actions/refereCandidate.svg';
import anonymousReport from '../../assets/images/actions/anonymousReport.svg';
import compensationReview from '../../assets/images/actions/compensationReview.svg';
import reportSomething from '../../assets/images/actions/reportSomething.svg';

import VacationLeave from '../../assets/images/actions/VacationLeave.svg';
import WeekendOfficeAccess from '../../assets/images/actions/WeekendOfficeAccess.svg';
import computerIssue from '../../assets/images/actions/computerIssue.svg';
import parentalLeaveInfo from '../../assets/images/actions/parentalLeaveInfo.svg';
import reimbursement from '../../assets/images/actions/reimbursement.svg';
import printer from '../../assets/images/actions/printer.svg';

class Actions extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         slideIndex: 0,
         updateCount: 0,
         showActionForm: false,
         showActionFormCompany: false,
         ActionsData: [],
         selectedActionData: {},
         selectedActionDataCompany: {},
         colleague: 'Dylan Spencer',
         props_for: 'Teamwork',
         description: '',
         checked: true
      }
   }
   componentDidMount() {
      this.setState({
         FeaturedActions: ActionsData.featured,
         generalActions: ActionsData.general,
         CompanyActions: ActionsData.company,
         ActionsData: ActionsData
      })
   }

   showActionForm(item) {
      this.slider.slickGoTo(1);
      this.setState({
         showActionForm: true,
         selectedActionData: item
      });
   }
   showActionFormCompany(item) {
      this.sliderCompany.slickGoTo(1);
      this.setState({
         showActionFormCompany: true,
         selectedActionDataCompany: item
      });
   }
   hideActionForm() {
      this.slider.slickGoTo(0);
      this.setState({ showActionForm: false });
   }
   hideActionFormCompany() {
      this.sliderCompany.slickGoTo(0);
      this.setState({ showActionFormCompany: false });
   }

   handleActionFormSubmit(data) {
      console.log(data);
   }
   render() {
      const { FeaturedActions, generalActions, CompanyActions } = this.state
      const settings = {
         dots: false,
         infinite: false,
         slidesToShow: 5,
         slidesToScroll: 1,
         nextArrow: <SampleNextArrow />,
         prevArrow: <SamplePrevArrow />,

         responsive: [
            {
               breakpoint: 1600,
               settings: {
                  slidesToShow: 4,
               }
            },
            {
               breakpoint: 1440,
               settings: {
                  slidesToShow: 4,
               }
            },
            {
               breakpoint: 1280,
               settings: {
                  slidesToShow: 3,
               }
            },

            {
               breakpoint: 800,
               settings: {
                  slidesToShow: 2,
               }
            },
            {
               breakpoint: 480,
               settings: {
                  slidesToShow: 1,
               }
            }
         ]
      };
      const settings_multi = {
         dots: false,
         infinite: false,
         slidesToShow: 6,
         slidesToScroll: 1,
         nextArrow: <SampleNextArrow />,
         prevArrow: <SamplePrevArrow />,
         rows: 2,
         slidesPerRow: 1,
         responsive: [
            {
               breakpoint: 1600,
               settings: {
                  slidesToShow: 4,
               }
            },
            {
               breakpoint: 1440,
               settings: {
                  slidesToShow: 4,
               }
            },
            {
               breakpoint: 1024,
               settings: {
                  slidesToShow: 3,
               }
            },
            {
               breakpoint: 768,
               settings: {
                  slidesToShow: 2,
               }
            },
            {
               breakpoint: 480,
               settings: {
                  slidesToShow: 1,
               }
            }
         ]
      };
      const settings_components_slide = {
         dots: false,
         draggable: false,
         arrows: false,
         infinite: false,
         speed: 500,
         swipeToSlide: false,
         slidesToShow: 1,
         slidesToScroll: 1,
         afterChange: () =>
            this.setState(state => ({ updateCount: state.updateCount + 1 })),
         beforeChange: (current, next) => this.setState({ slideIndex: next })
      };

      return (
         <Layout pageTitle="Actions" >
            <div className="home_container">
               {/** Featured actions */}
               {/* <Container>
                  <div className="section_title shadow">
                     <h4>Featured</h4>
                  </div>
                  <div className="page_content shadow">
                     <div className="announce_component faq_announce slick-align-left">
                        <Slider {...settings}>
                           {(FeaturedActions) ? FeaturedActions.map((item, index) => {
                              return <IconBox
                                 key={index}
                                 micon="star"
                                 box_type="image-full-width"
                                 main_class={"box"}
                                 user_img={<StarIcon />}
                                 title={item.label} />
                           }) : ('')}
                        </Slider>
                     </div>
                  </div>
               </Container> */}
               {/** General Actions */}
               <Slider ref={slider => (this.slider = slider)} {...settings_components_slide}>
                  <Container className="actions-container">
                     <div className="section_title shadow">
                        <h4>General Actions</h4>
                     </div>
                     <div className="page_content actions shadow">
                        <div className="announce_component faq_announce slick-align-left">
                           <Slider {...settings_multi}>
                              {(generalActions) ? generalActions.map((item, index) => {
                                 var img = item.img;
                                 // set default img if not return from data
                                 if (index === 0) { img = Star; }
                                 if (index === 1 || index === 4) { img = RefereCandidate; }
                                 if (index === 2 || index === 7) { img = AskManagement; }
                                 if (index === 3) { img = anonymousReport; }
                                 if (index === 5) { img = compensationReview; }
                                 if (index === 6 || index >= 8) { img = reportSomething; }
                                 return <IconBox
                                    key={index}
                                    user_img={img}
                                    title={item.label}
                                    showAction={() => { this.showActionForm({ label: item.label, img: img }) }} />
                              }) : ('')}
                           </Slider>
                        </div>
                     </div>
                  </Container>
                  <Container elevation={4} className="action-form">
                     <ActionsForm
                        onSubmit={this.handleActionFormSubmit}
                        onCancel={this.hideActionForm.bind(this)}
                        actionDetail={this.state.selectedActionData}
                     />
                  </Container>
               </Slider>
               {/** Company Actions */}
               {/* <Slider ref={sliderCompany => (this.sliderCompany = sliderCompany)} {...settings_components_slide}>
                  <Container>
                     <div className="section_title shadow">
                        <h4>Company Actions</h4>
                     </div>
                     <div className="page_content actions shadow">
                        <div className="announce_component faq_announce slick-align-left">

                           <Slider {...settings_multi}>
                              {(CompanyActions) ? CompanyActions.map((item, index) => {
                                 var img = item.img;
                                 if (index === 0) { img = printer; }
                                 if (index === 1) { img = reimbursement }
                                 if (index === 2) { img = parentalLeaveInfo }
                                 if (index === 3) { img = computerIssue; }
                                 if (index === 4) { img = WeekendOfficeAccess; }
                                 if (index === 5) { img = VacationLeave; }
                                 if (index === 6) { img = computerIssue; }
                                 if (index === 7 || index === 8 || index === 9) { img = printer; }
                                 return <IconBox
                                    key={index}
                                    iClass="icon-red"
                                    user_img={img}
                                    title={item.label} showAction={() => { this.showActionFormCompany({ label: item.label, img: img }) }} />
                              }) : ('')}
                           </Slider>
                        </div>
                     </div>
                  </Container>
                  <Container elevation={4} className="action-form">
                     <ActionsForm
                        onSubmit={this.handleActionFormSubmit}
                              onCancel={this.hideActionFormCompany.bind(this)}
                        actionDetail={this.state.selectedActionDataCompany}
                     />
                  </Container>
               </Slider> */}
            </div>
         </Layout>
      );
   }
}

export default Actions;
