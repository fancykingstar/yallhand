import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardActionArea, CardContent, CardMedia, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';

import twitter_icon from "../../assets/images/twitter_icon.svg";
import linkedin_icon from "../../assets/images/linkedin_icon.svg";
import medium_icon from "../../assets/images/medium_icon.svg";
import github_icon from "../../assets/images/github_icon.svg";

import department_icon from "../../assets/images/department_icon.svg";
import location_icon from "../../assets/images/location_icon.svg";
import mobile_icon from "../../assets/images/mobile_icon.svg";

class StaffDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: null
        }
    }

    handleClick(event, id) {
        this.setState({ activeId: id });
        console.log(id);
    }

    render() {
        if (this.props.view === 'hierarchy') {
            var cardActionProps = '';
            if (this.props.has_child) {
                cardActionProps = { onClick: (e) => this.props.update_boss(this.props.boss['index'], this.props.boss['boss']) }
            }
            return (
                <Card square className={(this.props.has_child ? 'has_child ' : ' ') + (this.props.active ? 'is-active' : '') + " inner_staff_detail hierarchy"}>
                    <CardActionArea {...cardActionProps} >
                        <CardMedia
                            image={this.props.profile}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography variant="h6" component="h6">{this.props.name}</Typography>
                            <Typography variant="body2" color="textSecondary" component="p" >
                                {this.props.designation}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            );
        } else {
            var { socials } = this.props;
            return (
                <Card className="inner_staff_detail all-staff">
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe"><img src={this.props.profile} alt={this.props.name} /></Avatar>
                        }
                        title={this.props.name}
                        subheader={this.props.designation}
                    />
                    <CardContent>
                        <List component="div">
                        <ListItem>
                                <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={"email"} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.department} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <img src={location_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.location} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <img src={mobile_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.contact} />
                            </ListItem>
                        </List>
                    </CardContent>
                    <CardActions disableSpacing>
                        <div className="staffSocial">
                            {(socials) ? (
                                <div className="staffSocialIcons">
                                    {(socials.twitter) && (
                                        <a href={socials.twitter}><img src={twitter_icon} alt="twitter" /></a>
                                    )}
                                    {(socials.linkedin) && (
                                        <a href={socials.linkedin}><img src={linkedin_icon} alt="Linkedin" /></a>
                                    )}
                                    {(socials.medium) && (
                                        <a href={socials.medium}><img src={medium_icon} alt="medium" /></a>
                                    )}
                                    {(socials.github) && (
                                        <a href={socials.github}><img src={github_icon} alt="twitter" /></a>
                                    )}

                                </div>
                            ) : (<div className="staffSocialIcons"></div>)}
                        </div>
                        <div className="align-right">
                            <Link to="#/">More</Link></div>
                    </CardActions>
                </Card>
            )
        }
    }
}

export default StaffDetail;
