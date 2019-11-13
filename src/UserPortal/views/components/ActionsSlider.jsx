import React from 'react';
import { Container } from 'reactstrap';
import { TicketingStore } from "../../../Stores/TicketingStore";

import Slider from "react-slick";
import IconBox from "./IconBox";
import ActionsForm from "./ActionsForm";

import ActionsData from '../../data/actions.json';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

// import Star from '../../assets/images/star.svg';
import {getIcon} from "../../../SharedUI/SVGIconStorage";
import ImportantDevicesRoundedIcon from '@material-ui/icons/ImportantDevicesRounded';

import {UserStore} from "../../../Stores/UserStore";
import {createTicket} from "../../../DataExchange/Up";
import {ticketOpen} from "../../../DataExchange/PayloadBuilder";

// import AskManagement from '../../assets/images/actions/askManagement.svg';
// import RefereCandidate from '../../assets/images/actions/refereCandidate.svg';
// import anonymousReport from '../../assets/images/actions/anonymousReport.svg';
// import compensationReview from '../../assets/images/actions/compensationReview.svg';
// import reportSomething from '../../assets/images/actions/reportSomething.svg';

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

   async handleActionFormSubmit(data) {
      const payload = {parent: this.state.selectedActionData.ticketID, stage: "open", activity: [{data, stage: "open", updated: Date.now(), userID: UserStore.user.userID}]};
      await createTicket(ticketOpen(payload)).then(res => res.json());
      this.slider.slickGoTo(0);
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

                        {TicketingStore.allTickets.filter(ticket=>ticket.isTemplate).map(ticket => 
                                   <IconBox
                                   key={"icon" + ticket.ticketID}
                                   user_img={getIcon("Star")}
                                   title={ticket.label}
                                   showAction={() => { this.showActionForm(Object.assign(ticket, { img: getIcon("Star") })) }} 
                                />
                           )}

                 </Slider>
                     </div>
                  </div>
               </Container>
               <Container elevation={4} className="action-form">
                  <ActionsForm
                     onSubmit={this.handleActionFormSubmit.bind(this)}
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
