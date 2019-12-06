import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles({
    root: {
        backgroundColor: props => props.bgColor,
        width: props => `${parseInt(props.size) + 70}px`,
        height: props => `${parseInt(props.size) + 70}px`,
        padding: "35px",
        borderRadius: "50%",
        cursor: "pointer"
    },
    circleIconStyle: {
        color: props => props.color,
        overflow: "visible",

        '&::before': {
            fontSize: props => `${parseInt(props.size)}px`,
        }
    },
    label: {
        fontFamily: "Rubik",
        fontSize: "16px",
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "1.25",
        letterSpacing: "normal",
        color: "#0f141a",
        paddingLeft: "20px",
        paddingTop: "20px",
        flex: 1
    }
});

const CircleIcons = (props) => {
    const { circleIconStyle, root, label } = useStyles(props);
    const { title, name } = props;
    let iconName = name.split(/(?=[A-Z])/).join("_").toLowerCase();
    return (
        <div className="CircleIcon" style={{ display: "flex" }}>
            <div className={`${root}`} onClick={props.onClick}>
                <Icon className={circleIconStyle}>{iconName}</Icon>
            </div>
            <p className={`icon-label ${label}`}>{title}</p>
        </div>
    )
}

export default CircleIcons;