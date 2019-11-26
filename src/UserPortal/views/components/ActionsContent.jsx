import React from "react";
import {withRouter} from "react-router-dom"
import { Container, Col, Row, Button, Form, } from "reactstrap";
import Star from "../../assets/images/star.svg";
import { Svg } from "../../helpers/Helpers";
import IconButton from "@material-ui/core/IconButton";
import { Chip, Fab } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";


import { getContentObj } from "../../../SharedCalculations/GetContentObj";
import HelpRoundedIcon from "@material-ui/icons/HelpRounded";
import Announcements from "../../assets/images/announcements.svg";


class ActionsContent extends React.Component {
  handleClick() {}
  
  render() {

    return (
      <>
        <div className="section_title">
          <h4>
            <IconButton
              color="inherit"
              aria-label="back to actions"
              edge="start"
              onClick={this.props.onCancel.bind(this)}
            >
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            {this.props.actionDetail.label ? (
              <Svg
                class="small-icon"
                src={this.props.actionDetail.img}
                default={Star}
              />
            ) : (
              ""
            )}
            {this.props.actionDetail.label}
          </h4>
        </div>
        <div className="page_content actions">
          <div className="announce_component faq_announce slick-align-left">
            <Form onSubmit={this.props.onProceed}>
              <Container>
                <Row>
                  <Col>
                    <h4>Suggested content</h4>
                   
                  </Col>
                </Row>
                <Row style={{paddingTop: 5}}>
                  <Col md={6}>
                    {this.props.actionDetail.assoc &&
                      this.props.actionDetail.assoc.map((item, index) => {
                        const content = getContentObj(item);
                        const mode = Object.keys(item).includes('policyID')? "policy" : "announcement";
                        return (
                          <Chip icon={ item.policyID ? ( <HelpRoundedIcon /> ) : ( <img src={Announcements} /> ) }
                            color="primary"
                            label={content.label}
                            onClick={() => this.props.history.push(`/portal/${mode === "announcement" ? "announcement" : "learn-detail"}/${item[mode === "announcement" ? "announcementID" : "policyID"]}`)}
                          />
                        );
                      })}

                  </Col>
                </Row>
              </Container>

              <Row className="text-right form-buttons">
      
                <Col>
                <p style={{paddingRight: 5}}> Problem resolved? </p>
                <Fab
                variant="extended"
                size="small"
                color={"default"}
                aria-label="yes"
                onClick={this.props.onCancel.bind(this)}
                style={{margin: "0 15px 0"}}
                >
                   Yes
                </Fab>

                <Fab
                variant="extended"
                size="small"
                color={"secondary"}
                aria-label="no"
                onClick={this.props.onProceed}
                style={{margin: "0 15px 0"}}
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
      </>
    );
  }
}

export default withRouter(ActionsContent);
