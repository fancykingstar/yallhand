import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardActionArea, CardContent, CardMedia, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
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
import phone_icon from "../../assets/images/old-typical-phone.png";
import cake_icon from "../../assets/images/birthday-cake.png";

class StaffDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: null,
            more: false,
            type: true,
            expanded: false
        }
    }

    componentDidMount() {
        if ( String(this.props.aboutme).length > 50 ) {
            this.setState({more: true, text: String(this.props.aboutme).slice(0, 50)});
        } else {
            this.setState({more: false, text: String(this.props.aboutme)});
        }
    }

    handleClick(event, id) {
        this.setState({ activeId: id });
    }

    showMoreTest = (e) => {
        this.setState({ type: !this.state.type });
        !this.state.type ? this.setState({ text: this.props.aboutme.slice(0, 50) }) : this.setState({ text: this.props.aboutme });
    }

    aboutmeStyle = { fontSize: "14px", color: "#88878f", fontWeight: 400 };

    handleExpandClick = () => {
        this.setState({expanded: !this.state.expanded});
    };

    render() {
        if (this.props.view === 'hierarchy') {
            var cardActionProps = '';
            if (this.props.has_child) {
                cardActionProps = { onClick: (e) => { 
                    this.props.update_boss(this.props.boss['index'], this.props.boss['boss'])
                } }
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
                    <CardContent style={{ paddingBottom: this.state.expanded ? 0 : '' }}>

                        {
                            this.props.aboutme ? 
                                <div>
                                    <h6 style={this.aboutmeStyle}>
                                        {this.state.text}
                                        <span style={{ display: !this.state.more ? "none" : "", marginRight: "5px" }}>{this.state.type ? "..." : ""}</span>
                                        <Link to="#" onClick={(e) => this.showMoreTest(e)} style={{ display: !this.state.more ? "none" : "", color: "blue" }}>{this.state.type ? "more" : "less"}</Link>
                                    </h6>
                                </div> : ""
                        }
                        <List component="div">
                            <ListItem style={{display: !this.props.email ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.email} />
                            </ListItem>
                            <ListItem style={{display: !this.props.department ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <img src={department_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.department} />
                            </ListItem>
                            <ListItem style={{display: !this.props.location ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <img src={location_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.location} />
                            </ListItem>
                        </List>
                    </CardContent>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <ListItem style={{display: !this.props.contact ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <img src={phone_icon} alt="" />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.contact} />
                            </ListItem>
                            <ListItem style={{display: !this.props.mobile ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <img src={mobile_icon} alt="" width="20" style={{ marginLeft: "2px" }} />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.mobile} style={{ marginLeft: "-2px" }} />
                            </ListItem>
                            <ListItem style={{display: !this.props.dob ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <img src={cake_icon} alt="" width="20" style={{ marginLeft: "2px" }} />
                                </ListItemIcon>
                                <ListItemText secondary={this.props.dob} style={{ marginLeft: "-2px" }} />
                            </ListItem>
                            <ListItem style={{display: !this.props.reportto ? "none" : "flex"}}>
                                <ListItemIcon>
                                    <label style={{ color: 'black', marginBottom: 0, fontSize: "14px" }}>Reports To: </label>
                                </ListItemIcon>
                                <ListItemText secondary={this.props.reportto} style={{ marginTop: '4px' }} />
                            </ListItem>
                        </CardContent>
                    </Collapse>
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
                            <Link to="#/" onClick={() => this.handleExpandClick()} aria-expanded={this.state.expanded} aria-label="show more">{!this.state.expanded ? "More" : "Less"}</Link>
                        </div> 
                    </CardActions>
                </Card>
            )
        }
    }
}

export default StaffDetail;
