import React from 'react';
import * as constants from "../../constants/constants.js";
import { withRouter } from "react-router-dom";

class ImageBox extends React.Component {
    render() {
        const box_type = (this.props.box_type) ? this.props.box_type : 'announce';
        var classes = (box_type === "announce") ? "announce_box " : (box_type === "suggession") ? "suggession_box" : '';
        classes += " " + this.props.main_class;
        return (
            (box_type === 'announce') ? (
                <div className={classes}
                    onClick={() => this.props.history.push(this.props.url)}
                >
                    <div className={(this.props.overlayClass ? this.props.overlayClass : "") + " announce_img"}>
                        <a className="settings_icon" href="#/"><img src={constants.SETTING_ICON} alt="setting" /></a>
                        {/* <a className="link_announce" href={((this.props.url) && this.props.url !== '') ? this.props.url : "#/"}> */}
                        {this.props.user_img && <img src={this.props.user_img} alt={this.props.title} />}
                        <div className="announce_title">
                            <h4>{this.props.title}</h4>
                        </div>
                        {/* </a> */}
                    </div>
                </div>) :
                (box_type === "suggession") ? (
                    <div className={classes}>
                        <div className="suggession_img">
                            <a className="link_suggession" href={((this.props.url) && this.props.url !== '') ? this.props.url : "#/"}>
                                <div className="box_img"><img src={this.props.user_img} alt={this.props.title} /></div>
                                <div className="suggession_title">
                                    <p>{this.props.title}</p>
                                </div></a>
                        </div>
                    </div>
                ) :
                    (box_type === "featured") ? (
                        <div className={classes + " featured-box"}>
                            <a className="link_featured" href={((this.props.url) && this.props.url !== '') ? this.props.url : "#/"}>
                                <div className="featured-img">
                                    <img src={this.props.user_img} alt={this.props.title} />
                                </div>
                                <h4 className="featured-title">{this.props.title}</h4>
                            </a>
                        </div>
                    ) : ("")
        )
    }
}

// export default ImageBox;
export default withRouter(ImageBox);
