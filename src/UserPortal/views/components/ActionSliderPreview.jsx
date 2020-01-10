import React from 'react';
import { Container } from 'reactstrap';

import Slider from "react-slick";

import ActionsForm from "./ActionsForm";
import ActionsContent from "./ActionsContent";

import ActionsData from '../../data/actions.json';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

import CircleIcons from './CircleIcons';

class ActionSliderPreview extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         ActionsData: [],
         selectedActionData: {},
         loading: false,
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

   proceed() {
      this.slider.slickGoTo(2);
   }

   backToActions() {
      this.slider.slickGoTo(0);
   }

   hideActionForm() {
      const {assoc} = this.state.selectedActionData;
      this.slider.slickGoTo(assoc && assoc.length? 1: 0);
   }


   // uploadFiles = async (files, ticket) => {
   //    this.setState({loading: true});
   //    let resources = [];
   //    for (let index = 0; index < files.length; index++) {
   //       const file = files[index];
   //       await S3Upload("authenticated-read", "gramercy", GenerateFileName(AccountStore.account, file.name), file, newFile(file.name, {tickets: [ticket.ticketID]}, true))
   //       .then((r) => {
   //       resources.push(r);
   //       })
   //       }
   //    let filesLabel = Object.keys(ticket.activity[0].data).filter(i=>isBoolean(ticket.activity[0].data[i]))[0];
   //    let filesObj = {};
   //    filesObj[filesLabel] = resources.map(file=>file.resourceID);
   //    let activityData = Object.assign(ticket.activity[0].data, filesObj);
   //    const activity = Object.assign(ticket.activity[0], {data: activityData} );
   //    const newTicket = Object.assign(ticket, {activity: [activity]});
   //    await modifyTicket(newTicket);

   //    this.setState({loading: false});
   //  }
   
  

   async handleActionFormSubmit(toSubmit) {
      let data = Object.assign({}, toSubmit);
      let files = [];
      if (toSubmit.files) {
         files = toSubmit.files;
      }
      delete data.files;


      // const payload = {parent: this.state.selectedActionData.ticketID, activity: [{data, views:[], stage: "open-pending", updated: Date.now(), userID: UserStore.user.userID}]};
      // const res = await createTicket(ticketOpen(payload)).then(res => res.json());
      // if (files.length) this.uploadFiles(files, res)


      this.slider.slickGoTo(0);
   }

   eachCircleIcon = { marginBottom: "20px" }
   render() {
      const { generalActions, } = this.state
      const {selectedActionData} = this.state;
      const settings_multi = {
         dots: false,
         infinite: false,
         slidesToShow: 4,
         slidesToScroll: 1,
         nextArrow: <SampleNextArrow />,
         prevArrow: <SamplePrevArrow />,
         rows: 2,
         slidesPerRow: 1,
         responsive: [
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
               breakpoint: 1024,
               settings: {
                  slidesToShow: 2,
               }
            },
            {
               breakpoint: 768,
               settings: {
                  slidesToShow: 3,
               }
            },
            {
               breakpoint: 600,
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


                       {/* {TicketingStore.allTickets.filter(ticket=>ticket.isTemplate).map(ticket => 

                                   <IconBox
                                   key={"icon" + ticket.ticketID}
                                   user_img={getIcon("Star")}
                                   title={ticket.label}
                                   showAction={() => { this.showActionForm(Object.assign(ticket, { img: getIcon("Star") })) }} 
                                />
                           )}*/}

                           <CircleIcons key={"icon" + this.props.data.ticketID} title={this.props.data.label} name={this.props.data.icon} color="#1249bd" bgColor="#e7eefc" size="72" padding="true" onClick={() => { this.showActionForm(this.props.data) }} />

                        </Slider>
                     </div>
                  </div>
               </Container>
               {selectedActionData.assoc && selectedActionData.assoc.length? 
               <Container elevation={4} className="action-form">
                  <ActionsContent
                     disabled
                     onProceed={this.proceed.bind(this)}
                     onCancel={this.backToActions.bind(this)}
                     actionDetail={this.state.selectedActionData}
                  />
                  
               </Container>
               :""}
               <Container elevation={4} className="action-form">
                  <ActionsForm
                     onSubmit={() => {return false}}
                     onCancel={this.hideActionForm.bind(this)}
                     actionDetail={this.state.selectedActionData}
                     loading={this.state.loading}
                     disabled={true}
                  />
                  
               </Container>
            </Slider >
         </>
      );
   }
}

export default ActionSliderPreview;
