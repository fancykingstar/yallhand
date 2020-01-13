/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Container } from 'reactstrap';
import Slider from 'react-slick';
import { isBoolean } from 'lodash';

import ActionsForm from './ActionsForm';
import ActionsContent from './ActionsContent';
import CircleIcons from './CircleIcons';
import { TicketingStore } from '../../../Stores/TicketingStore';
import { AccountStore } from '../../../Stores/AccountStore';
import { UserStore } from '../../../Stores/UserStore';
import { createTicket, modifyTicket } from '../../../DataExchange/Up';
import { ticketOpen, newFile } from '../../../DataExchange/PayloadBuilder';
import { S3Upload } from '../../../DataExchange/S3Upload';
import { GenerateFileName } from '../../../SharedCalculations/GenerateFileName';
import { SampleNextArrow, SamplePrevArrow } from '../../helpers/Helpers';

import ActionsData from '../../data/actions.json';

class ActionSlider extends React.Component {
  eachCircleIcon = { marginBottom: '20px' };

  constructor(props) {
    super(props);
    this.state = {
      selectedActionData: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({
      generalActions: ActionsData.general,
    });
  }

  showActionForm = (data) => {
    this.slider.slickGoTo(1);
    this.setState({ selectedActionData: data });
  }

  proceed = () => {
    this.slider.slickGoTo(2);
  }

  backToActions = () => {
    this.slider.slickGoTo(0);
  }

  hideActionForm = () => {
    const { selectedActionData: { assoc } } = this.state;
    this.slider.slickGoTo(assoc && assoc.length ? 1 : 0);
  }

  uploadFiles = async (files, ticket) => {
    this.setState({ loading: true });
    const resources = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      await S3Upload(
        'authenticated-read',
        'gramercy',
        GenerateFileName(AccountStore.account, file.name),
        file,
        newFile(file.name, { tickets: [ticket.ticketID] }, true),
      ).then(r => {
        resources.push(r);
      });
    }
    const filesLabel = Object.keys(ticket.activity[0].data).filter(i =>
      isBoolean(ticket.activity[0].data[i]),
    )[0];
    const filesObj = {};
    filesObj[filesLabel] = resources.map(file => file.resourceID);
    const activityData = Object.assign(ticket.activity[0].data, filesObj);
    const activity = Object.assign(ticket.activity[0], { data: activityData });
    const newTicket = Object.assign(ticket, { activity: [activity] });
    await modifyTicket(newTicket);

    this.setState({ loading: false });
  };

  handleActionFormSubmit = async (toSubmit) => {
		const data = { ...toSubmit};
		const { selectedActionData } = this.state;
    let files = [];
    if (toSubmit.files) {
      files = toSubmit.files;
    }
    delete data.files;

    const payload = {
      parent: selectedActionData.ticketID,
      activity: [
        {
          data,
          views: [],
          stage: 'open-pending',
          updated: Date.now(),
          userID: UserStore.user.userID,
        },
      ],
    };
    const res = await createTicket(ticketOpen(payload)).then(response => response.json());
    if (files.length) this.uploadFiles(files, res);

    this.slider.slickGoTo(0);
  }

  render() {
    const { selectedActionData, loading } = this.state;
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
          },
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
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
      <Container>
        <Slider ref={slider => (this.slider = slider)} {...settings_components_slide}>
          <div className="actions-container">
            <div className="section_title shadow">
              <h4>General Actions</h4>
            </div>
            <div className="page_content actions shadow">
              <div className="announce_component faq_announce slick-align-left">
                <Slider {...settings_multi}>
                  {TicketingStore.allTickets
                    .filter(ticket => ticket.isTemplate && ticket.active)
                    .map(ticket => (
                      <CircleIcons
                        key={`icon${  ticket.ticketID}`}
                        title={ticket.label}
                        name={ticket.icon}
                        color="#1249bd"
                        bgColor="#e7eefc"
                        size="72"
                        padding="true"
                        onClick={() => {
                          this.showActionForm(ticket);
                        }}
                      />
                    ))}
                </Slider>
              </div>
            </div>
          </div>
          {selectedActionData.assoc && selectedActionData.assoc.length ? (
            <ActionsContent
              onProceed={this.proceed}
              onCancel={this.backToActions}
              actionDetail={selectedActionData}
            />
          ) : (
            ''
          )}
          <ActionsForm
            onSubmit={this.handleActionFormSubmit}
            onCancel={this.hideActionForm}
            actionDetail={selectedActionData}
            loading={loading}
          />
        </Slider>
      </Container>
    );
  }
}

export default ActionSlider;
