import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles({
    root: {
        backgroundColor: props => props.bgColor,
        width: props => `${props.size || 70}px`,
        height: props => `${props.size || 70}px`,
        padding: props => `${props.size? props.size * .185 : 13}px`,
        borderRadius: "50%",
        cursor: "pointer"
    },
    circleIconStyle: {
        color: props => props.color,
        overflow: "visible",
        fontSize: props => `${props.size? props.size * .64 : 45}px`,

        '&::before': {
            fontSize: props => `${props.size? props.size * .64 : 45}px`,
        }
    },
    label: {
        fontFamily: "Rubik",
        fontSize: props => `${props.size? props.size * .22 : 16}px`,
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "1.25",
        letterSpacing: "normal",
        color: "#0f141a",
        paddingLeft: props => `${props.size? props.size * .285 : 20}px`,
        paddingTop:  props => `${props.size? props.size * .285 : 20}px`,
        flex: 1
    },
    embed: {
        display: "flex",
        cursor: "pointer",
        paddingBottom:  props => `${props.padding ? props.size ? props.size * .285 : 20 : 0}px`,
    }
});

const CircleIcons = (props) => {
    const { embed, circleIconStyle, root, label } = useStyles(props);
    const { title, name } = props;
    let iconName = name.split(/(?=[A-Z])/).join("_").toLowerCase();
    return (
        <div className={`${embed} CircleIcon`} onClick={props.onClick}>
            <div className={`${root}`}>
                <Icon className={circleIconStyle}>{iconName}</Icon>
            </div>
            <p style={{display: props.noLabel? "none":"content", paddingRight: 10}} className={`icon-label ${label}`}>{title}</p>
        </div>
    )
}

export default CircleIcons;