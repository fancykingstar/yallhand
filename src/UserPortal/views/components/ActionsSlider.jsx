import React from 'react';
import { Container } from 'reactstrap';
import { TicketingStore } from "../../../Stores/TicketingStore";

import Slider from "react-slick";
import IconBox from "./IconBox";
import ActionsForm from "./ActionsForm";

import ActionsData from '../../data/actions.json';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

import Star from '../../assets/images/star.svg';
import ImportantDevicesRoundedIcon from '@material-ui/icons/ImportantDevicesRounded';

import AskManagement from '../../assets/images/actions/askManagement.svg';
import RefereCandidate from '../../assets/images/actions/refereCandidate.svg';
import anonymousReport from '../../assets/images/actions/anonymousReport.svg';
import compensationReview from '../../assets/images/actions/compensationReview.svg';
import reportSomething from '../../assets/images/actions/reportSomething.svg';

class ActionSlider extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         ActionsData: [],
         selectedActionData: {},
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

   showActionForm(data) {
      this.slider.slickGoTo(1);
      this.setState({ selectedActionData: data });
   }

   hideActionForm() {
      this.slider.slickGoTo(0);
   }

   handleActionFormSubmit(data) {
      console.log(data);
   }
   render() {
      const { generalActions } = this.state
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
      };

      return (
         <>
            {/** General Actions */}
            < Slider ref={slider => (this.slider = slider)
            } {...settings_components_slide}>
               <Container className="actions-container">
                  <div className="section_title shadow">
                     <h4>General Actions</h4>
                  </div>
                  <div className="page_content actions shadow">
                     <div className="announce_component faq_announce slick-align-left">
                        <Slider {...settings_multi}>

                        {TicketingStore.allTickets.map(ticket => 
                                   <IconBox
                                   key={"icon" + ticket.ticketID}
                                   user_img={Star}
                                   title={ticket.label}
                                   showAction={() => { this.showActionForm(Object.assign(ticket, { img: Star })) }} 
                                />
                           )}
                
                          {/* <IconBox
                           key={"i1"}
                           user_img={Star}
                           title={"Request for information"}
                           showAction={() => { this.showActionForm({ label: "Request for information", img: Star }) }} 
                        /> */}
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
            </Slider >
         </>
      );
   }
}

export default ActionSlider;
