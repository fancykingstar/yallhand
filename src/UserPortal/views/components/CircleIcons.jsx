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
    }
});

const CircleIcons = (props) => {
    const { circleIconStyle, root } = useStyles(props);
    const name = `fa fa-${props.name}`;
    return (
        <div className={`${root}`} onClick={props.onClick}>
            <Icon className={`${name} ${circleIconStyle}`} />
        </div>
    )
}

export default CircleIcons;