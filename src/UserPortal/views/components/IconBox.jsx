import React from 'react';
import { Svg } from "../../helpers/Helpers";
// import Star from '../../assets/images/star.svg';
import Star from '@material-ui/icons/Star';

class IconBox extends React.Component {
    render() {
        const { box_type } = this.props;
        if (box_type === 'image-full-width') {
            return (
                <div className={"icon-box-wrap image-full-width  " + this.props.main_class}>

                    <div className="box_img icon bg big text-center">
                        {(this.props.user_img) ? this.props.user_img : <Svg src={this.props.user_img} default={Star} />}

                    </div>
                    <div className="suggession_title">
                        <p>{this.props.title}</p>
                    </div>

                </div>

            )
        }
        else {
            return (
                <a href="#/" onClick={this.props.showAction}>
                    <div className="icon-box-wrap">
                        <div className={"icon big " + this.props.iClass}>

                            {(this.props.user_img) ? <Svg src={this.props.user_img} default={Star} /> : <Star />}

                            {/* <Svg src={this.props.user_img} default={Star} /> */}
                        </div>
                        <div className="title">{this.props.title}</div>
                    </div>
                </a>
            )
        }
    }
}

export default IconBox;
