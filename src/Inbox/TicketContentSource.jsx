import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Header, Icon, Form, Button } from "semantic-ui-react";
import FadeIn from "react-fade-in";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import {Label as RSLabel} from "reactstrap";

import { AccountStore } from "../Stores/AccountStore";
import { TicketingStore } from "../Stores/TicketingStore";
import {getDisplayTags} from "../SharedCalculations/GetDisplayTags";
import {getDisplayTeams} from "../SharedCalculations/GetDisplayTeams";
import { TeamStore } from "../Stores/TeamStore";
import { UserStore } from "../Stores/UserStore";

import { ContentPreview } from "../SharedUI/ContentPreview";
export class TicketContentSource extends React.Component {
    constructor(props){
        super(props);
        this.state={toggleContentPreview: false};
    }

    getPreviewContent = () => {
        const { content } = this.props;
        return Object.assign(content, {mode: content.policyID? "policy":"announcement", contentID: content.policyID? content.policyID : content.announcementID})
      }
      
    closePreview = () => {
        this.setState({toggleContentPreview: false})
      }

      
  render() {
    const {content} = this.props;
    const {toggleContentPreview} = this.state;
    const vari = content.variations[0];
  return (
    <>
        <ContentPreview open={toggleContentPreview} onClose={this.closePreview} data={this.getPreviewContent()} />
      <Row>
      <Col>
          <div style={{ fontSize: "0.8em" }}>
            {content.policyID ? "FAQ" : "Announcement"}
          </div>
          <div  onClick={() => this.setState({ toggleContentPreview: true })} style={{  color: "#2185D0", cursor: "pointer" }}>
            {content.label}
          </div>
        </Col>
        {content.img && <Col > <div className="ContentPreviewImg" style={{ backgroundImage: `url(${content.img})` }} /> </Col> }
 
      </Row>
      
      <Row>

        <Col style={{ color: "rgba(0, 0, 0, 0.54)" }}>
          <p style={{ fontSize: "0.8em" }}>
            {vari && getDisplayTeams(vari.teamID, TeamStore.structure)}{" "}
            {vari &&
              (!vari.tags.length
                ? ""
                : getDisplayTags(vari.tags, TeamStore.tags))}
          </p>
        </Col>
 
      </Row>
    </>
  );
}};
