import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Col, Row, Form } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import { Chip, Fab } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import HelpRoundedIcon from '@material-ui/icons/HelpRounded';
import { getContentObj } from '../../../SharedCalculations/GetContentObj';
import Announcements from '../../assets/images/announcements.svg';
import CircleIcons from './CircleIcons';

class ActionsContent extends React.Component {
  handleClick() {}

  smallIconStyle = { display: 'flex', alignItems: 'center' };

  h4Style = { display: 'flex', alignItems: 'center' };

  render() {
    return (
      <div className="actions-container">
        <div className="section_title">
          <h4 style={this.h4Style}>
            <IconButton
              color="inherit"
              aria-label="back to actions"
              edge="start"
              onClick={this.props.onCancel.bind(this)}
            >
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            {this.props.actionDetail.label ? (
              <div className="small-icon" style={this.smallIconStyle}>
                {' '}
                <CircleIcons
                  noLabel
                  name={this.props.actionDetail.icon}
                  color="#1249bd"
                  bgColor="#e7eefc"
                  size="30"
                />
              </div>
            ) : (
              ''
            )}
            {this.props.actionDetail.label}
          </h4>
        </div>
        <div className="page_content actions shadow">
          <div className="announce_component faq_announce slick-align-left">
            <Form onSubmit={this.props.onProceed} disabled={this.props.disabled}>
              <Container>
                <Row>
                  <Col>
                    <h4>Please review this suggested content</h4>
                  </Col>
                </Row>
                <Row style={{ paddingTop: 5 }}>
                  <Col md={12}>
                    <div className="SuggestedContentContainer">
                      {this.props.actionDetail.assoc &&
                        this.props.actionDetail.assoc.map((item, index) => {
                          const content = getContentObj(item);
                          const mode = Object.keys(item).includes('policyID')
                            ? 'policy'
                            : 'announcement';
                          return (
                            <Chip
                              disabled={this.props.disabled !== undefined}
                              icon={
                                item.policyID ? <HelpRoundedIcon /> : <img src={Announcements} />
                              }
                              key={index}
                              className="SuggestContentChip"
                              color="primary"
                              label={content.label}
                              disabled
                            />
                          );
                        })}
                    </div>
                  </Col>
                </Row>
              </Container>

              <Row className="text-right form-buttons">
                <Col>
                  <p style={{ paddingRight: 5 }}>Is this content helpful ? </p>
                  <Fab
                    variant="extended"
                    size="small"
                    color="default"
                    aria-label="yes"
                    onClick={this.props.onCancel.bind(this)}
                    style={{ margin: '0 15px 0' }}
                  >
                    Yes
                  </Fab>

                  <Fab
                    variant="extended"
                    size="small"
                    color="secondary"
                    aria-label="no"
                    onClick={this.props.onProceed}
                    style={{ margin: '0 15px 0' }}
                  >
                    No
                  </Fab>

                  {/* 
                  <Button >
                    Yes
                  </Button>
                  <Button color="primary" onClick={this.props.onProceed}>No</Button> */}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ActionsContent);
