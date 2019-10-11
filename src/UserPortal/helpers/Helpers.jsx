import React from 'react';
// import nextArrow from '../assets/images/next-arrow.png';
// import prevArrow from '../assets/images/prev-arrow.png';

import renderHTML from 'react-render-html';

import ReactSVG from 'react-svg';
// import StarIcon from '@material-ui/icons/Star';

import ReactTimeAgo from 'react-time-ago';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.locale(en);

export function RenderHTMLContent(msg) {
    return renderHTML(msg);
}

export function RenderTimeAgo(time) {
    return <ReactTimeAgo date={time} />
}

export function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style }}
            onClick={onClick}
        />
    );
}

export function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style }}
            onClick={onClick}
        />
    );
}
export class Svg extends React.Component {
    state = {
        svg: null,
        loading: false,
    }
    componentDidMount() {
        fetch(this.props.src)
            .then(res => res.text())
            .then(text => this.setState({ svg: text }));
    }
    render() {
        const { loading, svg } = this.state;
        if (loading) {
            return <div className="spinner" />;
        } else if (!svg) {
            return <ReactSVG className={this.props.class} src={this.props.default} />;
        }

        return <ReactSVG className={this.props.class} src={this.props.src} />;
    }
}