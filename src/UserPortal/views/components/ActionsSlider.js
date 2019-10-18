import React from 'react';
import { Container } from 'reactstrap';
import Layout from '../../layouts/DefaultLayout';

import Slider from "react-slick";
import IconBox from "../components/IconBox";
import ActionsForm from "../components/ActionsForm";
import IconButton from '@material-ui/core/IconButton';

import ActionsData from '../../data/actions.json';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

import { Svg } from "../../helpers/Helpers";
import Star from '../../assets/images/star.svg';

import AskManagement from '../../assets/images/actions/askManagement.svg';
import RefereCandidate from '../../assets/images/actions/refereCandidate.svg';
import anonymousReport from '../../assets/images/actions/anonymousReport.svg';
import compensationReview from '../../assets/images/actions/compensationReview.svg';
import reportSomething from '../../assets/images/actions/reportSomething.svg';

class ActionSlider extends React.Component {
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
         checked: true,
         minHeight: "300px"
      }
   }
   componentDidMount() {
      this.setState({
         FeaturedActions: ActionsData.featured,
         generalActions: ActionsData.general,
         CompanyActions: ActionsData.company,
         ActionsData: ActionsData
      });
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
   handleInputChange(evt) {
      const value =
         evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
      this.setState({
         [evt.target.name]: value
      });
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
         // draggable: false,
         arrows: false,
         infinite: false,
         speed: 500,
         swipeToSlide: false,
         // swipe: false,
         slidesToShow: 1,
         slidesToScroll: 1,

         afterChange: () =>
            this.setState(state => ({ updateCount: state.updateCount + 1 })),
         beforeChange: (current, next) => this.setState({ slideIndex: next })
      };

      return (
         <div id="actions-slider" className=" actions-slides">
            <Slider ref={slider => (this.slider = slider)} {...settings_components_slide} >
               <Container className="actions-container"  >
                  <div className="section_title shadow">
                     <h4>General Actions</h4>
                  </div>
                  <div className="page_content  actions-slides actions shadow" >
                     <div className="announce_component faq_announce slick-align-left">
                        <Slider {...settings_multi}>
                           <IconBox
                              key={"AA"}
                              micon="star"
                              user_img={Star}
                              title={"Open Enrollment: Ask Anything"} showAction={() => { this.showActionForm({ label: "Open Enrollment: Ask Anything", img: Star }) }} />
                           {/* {(generalActions) ? generalActions.map((item, index) => {
                       var img = item.img;
                       if (index === 0) { img = Star; }
                       if (index === 1 || index === 4) { img = RefereCandidate; }
                       if (index === 2 || index === 7) { img = AskManagement; }
                       if (index === 3) { img = anonymousReport; }
                       if (index === 5) { img = compensationReview; }
                       if (index === 6 || index >= 8) { img = reportSomething; }
                       return <IconBox
                          key={index}
                          micon="star"
                          user_img={img}
                          title={item.label} showAction={() => { this.showActionForm({ label: item.label, img: img }) }} />
                    }) : ('')} */}

                        </Slider>
                     </div>
                  </div>

               </Container>
               <Container id="action-form" elevation={4} className="action-form">
                  <ActionsForm
                     onSubmit={this.handleActionFormSubmit}
                     onCancel={this.hideActionForm.bind(this)}
                     actionDetail={this.state.selectedActionData}
                  />
               </Container>
            </Slider>
         </div >
      );
   }
}

export default ActionSlider;
