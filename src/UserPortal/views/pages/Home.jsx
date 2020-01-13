/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Row, Col } from 'reactstrap';
import Slider from 'react-slick';

import Layout from '../../layouts/DefaultLayout';
import ImageBox from '../components/ImageBox';
import ActionSlider from '../components/ActionsSlider';
import { Survey } from '../components/Survey';
import { Task } from '../components/Task';
import { sortByUTC } from '../../../SharedCalculations/SortByUTC';
import { giveMeKey } from '../../../SharedCalculations/GiveMeKey';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

import '../../../CSS/app.scss';

@inject('AnnouncementsStore', 'PoliciesStore', 'SurveyStore', 'TaskStore')
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      annc: [], // featured
      faqs: [], // featured
    };
  }

  componentDidMount() {
    const { AnnouncementsStore, PoliciesStore } = this.props;

    const featured_annc = AnnouncementsStore.allAnnouncements.filter(annc => annc.featured);
    const featured_faq = PoliciesStore.allPolicies.filter(annc => annc.featured);
    this.loadFeatured(featured_annc, AnnouncementsStore.allAnnouncements, 'annc');
    this.loadFeatured(featured_faq, PoliciesStore.allPolicies, 'faqs');
  }

  loadFeatured(featured, all, stateKey) {
    if (featured.length)
      this.setState(stateKey === 'annc' ? { annc: featured } : { faqs: featured });
    else {
      const recent = all.length < 7 ? all : sortByUTC(all, 'newest').slice(0, 6);
      this.setState(stateKey === 'annc' ? { annc: recent } : { faqs: recent });
    }
  }

  render() {
    const { SurveyStore, TaskStore } = this.props;
    const { annc, faqs } = this.state;
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
            slidesToShow: 8,
          },
        },
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 6,
          },
        },
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 5,
          },
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 1336,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 1100,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };
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
                  {TaskStore.allTasks.filter(t => t.active).length
                    ? TaskStore.allTasks
                        .filter(t => t.active)
                        .map((item, index) => {
                          return <Task data={item} index={`hometask${giveMeKey()}`} key={index} />;
                        })
                    : ''}

                  {SurveyStore.allSurveys.filter(t => t.active).length
                    ? SurveyStore.allSurveys
                        .filter(t => t.active)
                        .map((item, index) => {
                          return (
                            <Survey data={item} index={`homesurvey${giveMeKey()}`} key={index} />
                          );
                        })
                    : ''}

                  {Boolean(annc.length) && (
                    <div className="announce_component">
                      <h6>Announcements</h6>
                      <div className="slider_wrap announce_main_box">
                        <Slider {...settings}>
                          {annc.map((item, index) => {
                            return (
                              <ImageBox
                                url={`/portal/announcement/${item.announcementID}`}
                                main_class="auto-col"
                                user_img={item.img}
                                title={item.label}
                                overlayClass={`box-overlay-color-${index}`}
                                key={`post-list-key ${index}`}
                              />
                            );
                          })}
                        </Slider>
                      </div>
                    </div>
                  )}

                  {Boolean(faqs.length) && (
                    <div className="announce_component faq_announce">
                      <h6>FAQs</h6>
                      <div className="slider_wrap announce_main_box">
                        <Slider {...settings}>
                          {faqs.map((item, index) => {
                            return (
                              <ImageBox
                                url={`/portal/learn-detail/${item.policyID}`}
                                key={index}
                                main_class="auto-col"
                                overlayClass={`box-overlay-color-${index}`}
                                user_img={item.img}
                                title={item.label}
                              />
                            );
                          })}
                        </Slider>
                      </div>
                    </div>
                  )}
                </div>
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
