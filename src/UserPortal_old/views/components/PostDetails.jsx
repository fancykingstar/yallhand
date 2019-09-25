import React from 'react';
import { RenderHTMLContent } from '../../helpers/Helpers';

import IconBox from "./IconBox";

import Star from '../../assets/images/star.svg';
import AskManagement from '../../assets/images/actions/askManagement.svg';
import RefereCandidate from '../../assets/images/actions/refereCandidate.svg';


import { Col, Row } from 'reactstrap';

class PostDetails extends React.Component {

    render() {
        var { post } = this.props
        return (
            <div className="outerContentDetail">
                <span className="borderGradian"></span>
                <div className="smallContainer">
                    <div className="">
                        <div className="contentDetailTitle">
                            <h3>{post.label}</h3>
                        </div>
                    </div>
                </div>
                <div className="contentBigImage">
                    <img alt="" src={post.img} />
                </div>
                <div className="smallContainer">
                    <div className="userPostDetailRow">
                        <img alt="" src={post.author_avatar} />
                        <div className="userPostDate">
                            <a href="#/">{post.author}</a>
                            <p>Aug 4, 2016 </p>
                        </div>
                    </div>
                    <div className="PostDetailContent">
                        {post.body_HTML && RenderHTMLContent(post.body_HTML)}

                        <a href="#/" className="selectPdf">Document-1.pdf</a>
                        <a href="#/" className="selectPdf">Checklist.pdf</a>

                        <div className="emojisRows">
                            <p>This makes you feel</p>
                            <div className="emojiBox-outer">
                                <div className="emojiBox">
                                    <a href="#/"><img alt="" src={require("../../assets/images/emoji1.png")} /></a>
                                    <a href="#/"><img alt="" src={require("../../assets/images/emoji2.png")} /></a>
                                    <a href="#/"><img alt="" src={require("../../assets/images/emoji3.png")} /></a>
                                </div>
                            </div>
                        </div>
                        <Row className="content-detail-action">
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
                        </Row>
                    </div>
                </div>

            </div>
        )
    }
}

export default PostDetails;
