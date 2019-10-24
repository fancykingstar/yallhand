import React from 'react';
import { inject, observer } from "mobx-react";
import { Container, Row, Col } from 'reactstrap';
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';
import Layout from '../../layouts/DefaultLayout';
import Sidebar from '../components/Sidebar'
import ImageBox from '../components/ImageBox';
import IconBox from "../components/IconBox";
import { Survey } from "../components/Survey";
import { Task } from "../components/Task";
import ActionSlider from "../components/ActionsSlider";
import Star from '@material-ui/icons/Star';
import PostData from '../../data/home.json';
import { css } from '@material-ui/system';
import { sortByUTC } from "../../../SharedCalculations/SortByUTC";

@inject("AnnouncementsStore", "PoliciesStore", "SurveyStore", "TaskStore")
@observer
class Home extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         suggestedActions: [],
         annc: [], //featured
         faqs: [], //featured
      }
   }

   loadFeatured(featured, all, stateKey) {
      if (featured.length) this.setState(stateKey === "annc" ? { annc: featured } : { faqs: featured });
      else {
         const recent = all.length < 7 ? all : sortByUTC(all, "newest").slice(0, 6)
         this.setState(stateKey === "annc" ? { annc: recent } : { faqs: recent });
      }
   }

   componentDidMount() {
      const { AnnouncementsStore, PoliciesStore } = this.props;
      this.setState({
         suggestedActions: PostData.suggestedActions
      })

      const featured_annc = AnnouncementsStore.allAnnouncements.filter(annc => annc.featured);
      const featured_faq = PoliciesStore.allPolicies.filter(annc => annc.featured);
      this.loadFeatured(featured_annc, AnnouncementsStore.allAnnouncements, "annc");
      this.loadFeatured(featured_faq, PoliciesStore.allPolicies, "faqs");



   }
   render() {
      const { AnnouncementsStore, PoliciesStore, SurveyStore, TaskStore } = this.props;
      const { suggestedActions } = this.state
      const settings = {
         dots: false,
         infinite: false,
         slidesToShow: 4,
         slidesToScroll: 1,
         nextArrow: <SampleNextArrow />,
         prevArrow: <SamplePrevArrow />,
         responsive: [
            {
               breakpoint: 2560,
               settings: {
                  slidesToShow: 5,
               }
            },
            {
               breakpoint: 2000,
               settings: {
                  slidesToShow: 4,
               }
            },
            {
               breakpoint: 1660,
               settings: {
                  slidesToShow: 3,
               }
            },

            {
               breakpoint: 1360,
               settings: {
                  slidesToShow: 2,
               }
            },
            {
               breakpoint: 1280,
               settings: {
                  slidesToShow: 3,
               }
            },
            {
               breakpoint: 1100,
               settings: {
                  slidesToShow: 2,
               }
            },
            {
               breakpoint: 1024,
               settings: {
                  slidesToShow: 2,
               }
            },
            {
               breakpoint: 992,
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
               breakpoint: 540,
               settings: {
                  slidesToShow: 1,
               }
            }
         ]
      };
      return (
         <Layout pageTitle="Home" >
            <div className="home_container">
               <Container>
                  <Row>
                     <Col lg={{ width: 1280, size: 12, order: 1 }} md={{ size: 12, order: 2 }} xs={{ size: 12, order: 2 }}>
                        <div className="section_title shadow">
                           <h4>Featured</h4>
                        </div>
                        <div className="page_content shadow">

                           {(TaskStore.allTasks.length) ? TaskStore.allTasks.map((item, index) => {
                              return <Task data={item} index={index} />
                           }) : ('')}

                           {(SurveyStore.allSurveys.length) ? SurveyStore.allSurveys.map((item, index) => {
                              return <Survey data={item} index={index} />
                           }) : ('')}

                           <div className="announce_component">
                              <h6>Announcements</h6>
                              <div className="slider_wrap announce_main_box">
                                 <Slider {...settings}>
                                    {this.state.annc.map((item, index) => {
                                       return <ImageBox
                                          url={`/portal/announcement/${item.announcementID}`}
                                          main_class={"auto-col"}
                                          user_img={item.img}
                                          title={item.label}
                                          overlayClass={"box-overlay-color-" + index}
                                          key={`post-list-key ${index}`} />
                                    })}
                                 </Slider>
                              </div>
                              <div className="announce_component faq_announce">
                                 <h6>FAQs</h6>
                                 <div className="slider_wrap announce_main_box">
                                    <Slider {...settings}>
                                       {this.state.faqs.map((item, index) => {
                                          return <ImageBox
                                             url={`/portal/learn-detail/${item.policyID}`}
                                             key={index}
                                             main_class={"auto-col"}
                                             overlayClass={"box-overlay-color-" + index}
                                             user_img={item.img}
                                             title={item.label} />
                                       })}
                                    </Slider>
                                 </div>
                              </div>
                           </div>
                        </div>


                        {/* 
                        <div className="section_title shadow">
                           <h4>Suggested Actions</h4>
                        </div>
                        <div className="page_content shadow">
                           <div className=" suggesion_main_box row">
                              {suggestedActions.map((item, index) => {
                                 return <IconBox
                                    key={index}
                                    micon="star"
                                    box_type="image-full-width"
                                    main_class={"box col-12 col-sm-6 col-md-4"}
                                    user_img={<Star />}
                                    title={item.label} />
                              })}
                           </div>
                        </div> */}

                     </Col>
                     {/* 
                     <Col lg={{ width: 1280, size: 3, order: 2 }} md={{ size: 12, order: 1 }} xs={{ size: 12, order: 1 }}>
                        <Sidebar />
                     </Col> */}
                  </Row>
               </Container>
               <ActionSlider />
            </div>

         </Layout>
      );
   }
}

export default Home;
