import React from "react";
import { inject, observer } from "mobx-react";
import { Container, Row, Col, Button } from "reactstrap";
import { Dropdown } from "semantic-ui-react";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "../../helpers/Helpers";
import Layout from "../../layouts/DefaultLayout";
import Sidebar from "../components/Sidebar";
import ImageBox from "../components/ImageBox";
import IconBox from "../components/IconBox";
import { Survey } from "../components/Survey";
import { Task } from "../components/Task";
import ActionSlider from "../components/ActionsSlider";
import Star from "@material-ui/icons/Star";
import PostData from "../../data/home.json";
import { css } from "@material-ui/system";
import { sortByUTC } from "../../../SharedCalculations/SortByUTC";

import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import StaffDetail from "../components/StaffDetail";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { giveMeKey } from '../../../SharedCalculations/GiveMeKey';

import ActionsForm from "../components/ActionsForm";

@inject(
  "AnnouncementsStore",
  "PoliciesStore",
  "SurveyStore",
  "TaskStore",
  "TicketingStore"
)
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestedActions: [],
      annc: [], //featured
      faqs: [], //featured
      selectedActionData: {}
    };
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

  loadFeatured(featured, all, stateKey) {
    if (featured.length)
      this.setState(
        stateKey === "annc" ? { annc: featured } : { faqs: featured }
      );
    else {
      const recent =
        all.length < 7 ? all : sortByUTC(all, "newest").slice(0, 6);
      this.setState(stateKey === "annc" ? { annc: recent } : { faqs: recent });
    }
  }

  componentDidMount() {
    const { AnnouncementsStore, PoliciesStore } = this.props;
    this.setState({
      suggestedActions: PostData.suggestedActions
    });

                           {(TaskStore.allTasks.length) ? TaskStore.allTasks.map((item, index) => {
                              return <Task data={item} index={"hometask" + giveMeKey()} />
                           }) : ('')}

                           {(SurveyStore.allSurveys.length) ? SurveyStore.allSurveys.map((item, index) => {
                              return <Survey data={item} index={"homesurvey" + giveMeKey()} />
                           }) : ('')}

                              {Boolean(this.state.annc.length) &&
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
                              </div>
                              }

                              {Boolean(this.state.faqs.length) &&
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
                              }
                        
                        </div>


    return (
      <Layout pageTitle="Home">
        <div className="home_container">
          <Container>
            <Row>
              <Col
                lg={{ width: 1280, size: 12, order: 1 }}
                md={{ size: 12, order: 2 }}
                xs={{ size: 12, order: 2 }}
              >
                <div className="section_title shadow">
                  <h4>Featured</h4>
                </div>
                <div className="page_content shadow">
                  <div className="announce_component">
                    <h6>Announcements</h6>
                    <div className="slider_wrap announce_main_box">
                      <Slider {...settings}>
                        {this.state.annc.map((item, index) => {
                          return (
                            <ImageBox
                              url={`/portal/announcement/${item.announcementID}`}
                              main_class={"auto-col"}
                              user_img={item.img}
                              title={item.label}
                              overlayClass={"box-overlay-color-" + index}
                              key={`post-list-key ${index}`}
                            />
                          );
                        })}
                      </Slider>
                    </div>
                    <div className="announce_component faq_announce">
                      <h6>FAQs</h6>
                      <div className="slider_wrap announce_main_box">
                        <Slider {...settings}>
                          {this.state.faqs.map((item, index) => {
                            return (
                              <ImageBox
                                url={`/portal/learn-detail/${item.policyID}`}
                                key={index}
                                main_class={"auto-col"}
                                overlayClass={"box-overlay-color-" + index}
                                user_img={item.img}
                                title={item.label}
                              />
                            );
                          })}
                        </Slider>
                      </div>
                    </div>
                  </div>
                </div>

                
{/* 
                  <Slider
                    ref={slider => (this.slider = slider)}
                    {...settings_components_slide}
                  >
                    <div className="actions-container">
                      <div className="section_title">
                         <div style={{margin: "1em"}}><h4>Suggested Actions</h4></div>
               
                      </div>
                      <div className="page_content shadow">
                        <div className=" suggesion_main_box row">
                          {TicketingStore.allTickets.map(ticket => (
                            <IconBox
                              micon="star"
                              box_type="image-full-width"
                              main_class={"box col-12 col-sm-6 col-md-4"}
                              user_img={<Star />}
                              key={"icon" + ticket.ticketID}
                              title={ticket.label}
                              showAction={() => {
                                this.showActionForm(
                                  Object.assign(ticket, { img: Star })
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div elevation={4} className="action-form">
                      <ActionsForm
                        onSubmit={this.handleActionFormSubmit}
                        onCancel={this.hideActionForm.bind(this)}
                        actionDetail={this.state.selectedActionData}
                      />
                    </div>
                  </Slider> */}
           

               
              </Col>
            </Row>
          </Container>

          
               <ActionSlider />
        </div>
      </Layout>
    );
  }
}

export default Home;
