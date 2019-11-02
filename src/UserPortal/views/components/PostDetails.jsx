import React from 'react';
import { inject, observer } from "mobx-react";
import { RenderHTMLContent } from '../../helpers/Helpers';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import IconBox from "./IconBox";

import Star from '../../assets/images/star.svg';
import AskManagement from '../../assets/images/actions/askManagement.svg';
import RefereCandidate from '../../assets/images/actions/refereCandidate.svg';


import { sentiment } from "../../../DataExchange/PayloadBuilder"
import { createSentiment } from "../../../DataExchange/Up"


import { Col, Row } from 'reactstrap';
import UTCtoFriendly from '../../../SharedCalculations/UTCtoFriendly';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

@inject("UIStore", "AccountStore", "UserStore")
@observer
class PostDetails extends React.Component {

    render() {
        const { AccountStore, UserStore } = this.props;
        const { mode, contentID } = this.props.data;
        const content = this.props.data;
        const vari = content && content.variations[0];


        const sentimentClick = (val) => {
            if(this.props.preview) return;
            this.props.update({ sentiment: true });
            if (!UserStore.user.isAdmin) {
                createSentiment(sentiment(val, `${mode}ID`, contentID, vari.variationID)).then(r => r.json().then(data => AccountStore.loadSentiments([...AccountStore.sentiments, ...[data]])))
            }
        }

        return (
            <div className="outerContentDetail">
                <span className="borderGradian"></span>
                <div className="smallContainer">
                    <div className="">
                        <div className="contentDetailTitle">
                            <h3>
                                <IconButton
                                    color="primary"
                                    aria-label="back to actions"
                                    edge="start"
                                    style={{ display: 'inline-block' }}
                                    onClick={history.goBack}
                                ><KeyboardBackspaceIcon fontSize="inherit" />
                                </IconButton>
                                {content.label}</h3>
                        </div>
                    </div>
                </div>
                <div className="contentBigImage">
                    <img alt="" src={content.img} />
                </div>
                <div className="smallContainer">
                    <div className="userPostDetailRow">
                        <img alt="" src={AccountStore._getUser(vari.userID).img} />
                        <div className="userPostDate">
                            <a href="#/">{AccountStore._getDisplayName(vari.userID)}</a>
                            <p>{UTCtoFriendly(vari.updated)}</p>
                        </div>
                    </div>
                    <div className="PostDetailContent">
                        {vari.contentHTML && RenderHTMLContent(vari.contentHTML)}

                        {/* <a href="#/" className="selectPdf">Document-1.pdf</a>
                        <a href="#/" className="selectPdf">Checklist.pdf</a> */}
                        <Fade in={!this.props.data.sentiment}>
                            <Typography variant="inherit" component="div">
                                <div className="emojisRows">
                                    <p>This makes you feel...</p>
                                    <div className="emojiBox-outer">
                                        <div className="emojiBox">
                                            <a><img onClick={e => sentimentClick(2)} alt="" src={require("../../assets/images/emoji3.png")} /></a>
                                            <a><img onClick={e => sentimentClick(1)} alt="" src={require("../../assets/images/emoji2.png")} /></a>
                                            <a><img onClick={e => sentimentClick(0)} alt="" src={require("../../assets/images/emoji1.png")} /></a>
                                        </div>
                                    </div>
                                </div>
                            </Typography>
                        </Fade>


                        {/* <Row className="content-detail-action">
                            <Col sm={6} md={4}><IconBox
                                micon="star"
                                iClass="medium"
                                user_img={Star}
                                title="Give Props to Colleague" />
                            </Col>
                            <Col sm={6} md={4}>
                                <IconBox
                                    micon="star"
                                    iClass="medium"
                                    user_img={AskManagement}
                                    title="Ask Management Anything" />
                            </Col>
                            <Col sm={6} md={4}>
                                <IconBox
                                    micon="star"
                                    iClass="medium"
                                    user_img={RefereCandidate}
                                    title="Refer a candidate to recruiting" />
                            </Col>
                        </Row> */}
                    </div>
                </div>

            </div>
        )
    }
}

export default PostDetails;
