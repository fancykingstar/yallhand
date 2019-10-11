import React, { useState, useEffect } from "react"

import LayoutHeader from "../views/components/Header";
import LayoutFooter from "../views/components/Footer";
import { useWindowDimensions } from "./WindowDimensions";
import { Link } from "react-router-dom";

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, AppBar, List, CssBaseline, ListItem, ListItemIcon, ListItemText, Grid } from '@material-ui/core';
import {
    Home as HomeIcon,
    TouchApp as TouchAppIcon,
    Event as EventIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Help as HelpIcon
} from '@material-ui/icons';
import { FaRegFileAlt } from "react-icons/fa";
import SearchFrame from "../views/pages/SearchFrame";

import Announcements from '../assets/images/announcements.svg';
import Surveys from '../assets/images/surveys.svg';
import MySaved from '../assets/images/my-saved.svg';
import Directory from '../assets/images/Directory.svg';
import BallotRoundedIcon from '@material-ui/icons/BallotRounded';
import CloudRoundedIcon from '@material-ui/icons/CloudRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';


import search_icon from "../assets/images/search_icon.svg";

import logo_img from "../assets/images/logo.png";
import { QLogo } from "../../Assets/Graphics/QLogo";
// import menu_footer_logo_img from "../assets/images/yallhands-small-grey.png";

import { AccountStore } from "../../Stores/AccountStore";
import { UserStore } from "../../Stores/UserStore";


// import 'bootstrap/dist/css/bootstrap.css';
import "../assets/css/UserPortal.scss";

const drawerWidth = 256;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
    },
    appBar: {
        position: 'fixed',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        position: 'fixed',
        background: 'transparent',
        zIndex: theme.zIndex.drawer + 1,
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        float: 'left',
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        border: 'none',
    },
    drawerOpen: {
        width: drawerWidth,
        border: 'none',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
    },
}));

const DefaultLayout = ({ ...props }) => {
    const mobileWidth = 992;
    var sOpen = false;
    const [scrollY, setScrollY] = useState(0);
    const { width } = useWindowDimensions();

    const classes = useStyles();

    // const [state, setState] = React.useState({
    //     searchTerm: ''
    // })

    const [open, setOpen] = React.useState(true);
    const [focus, setFocus] = React.useState(false);
    const [mopen, setMopen] = React.useState(false);
    if (width <= mobileWidth && open !== false) {
        setOpen(false);
    }
    function handleDrawerToggle() {
        setOpen(!open);
    }
    function handleDrawerToggleMobile() {
        setMopen(!mopen);
    }
    // function handleChange(evt) {
    //     setState({ searchTerm: evt.target.value });
    // }
    // function handleClearClick() {
    //     setState({ searchTerm: '' });
    // }
    function handleSearchClick() {
        var sopen = width <= mobileWidth ? mopen : open;
        if (sopen === false) {
            (width <= mobileWidth) ? handleDrawerToggleMobile() : handleDrawerToggle();
            setFocus(true);
        } else {
            // console.log('submit form');
            // console.log('searchTerm', state.searchTerm)
        }
    }
    useEffect(() => {
        function watchScroll() {
            window.addEventListener("scroll", logit);
        }
        watchScroll();
        // Remove listener (like componentWillUnmount)
        return () => {
            window.removeEventListener("scroll", logit);
        };
    });
    function logit() {
        setScrollY(window.pageYOffset);
    }
    const focusUsernameInputField = input => {
        if (input && focus) {
            input.focus();
        }
    };
    const account = AccountStore.account;

    return (
        <div className={clsx(classes.root, "topBorderBefore", (((width <= mobileWidth) ? !mopen : !open) ? "menuClosed" : 'menuOpen'), (scrollY > 50) ? 'menuSticky' : '')}>
            <CssBaseline />
            <AppBar
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: (width <= mobileWidth) ? mopen : open,
                }, (((width <= mobileWidth) ? !mopen : !open) ? "appBarShiftClose" : ''), "topappbar")}
            >
                <LayoutHeader pageTitle={props.pageTitle} toggleMenu={(width <= mobileWidth) ? handleDrawerToggleMobile : handleDrawerToggle} />
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: (width <= mobileWidth) ? mopen : open,
                    [classes.drawerClose]: (width <= mobileWidth) ? !mopen : !open
                }, "drawer")}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: (width <= mobileWidth) ? mopen : open,
                        [classes.drawerClose]: (width <= mobileWidth) ? !mopen : !open,
                    }),
                }}
                open={(width <= mobileWidth) ? mopen : open}
            >
                <div className="menuHeader">
                    <h2 className="menu-header ">
                        {((width <= mobileWidth) ? mopen : open) ? (
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Grid item xs={3}><img className="org-logo" src={account.img} alt="org logo" /></Grid>
                                <Grid item xs={9}><span className="org-name">{account.label} biger name company</span></Grid>
                            </Grid>
                        ) : (
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Grid item ><img className="org-logo" src={account.img} alt="org logo" /></Grid>

                                </Grid>
                            )}

                    </h2>
                </div>
                <div className="menu-content">
                    <List>
                        {
                            UserStore.user.isAdmin &&
                            <ListItem button key="home" component={Link} to="/panel">
                                <ListItemIcon><ArrowBackRoundedIcon /></ListItemIcon>
                                <ListItemText primary="Leave Portal View" />
                            </ListItem>
                        }
                        <ListItem button key="home" component={Link} to="/portal">
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        {/* <ListItem button key="actions" component={Link} to="actions">
                            <ListItemIcon><TouchAppIcon /></ListItemIcon>
                            <ListItemText primary="Actions" />
                        </ListItem> */}
                        {/* <ListItem button key="events">
                            <ListItemIcon><EventIcon /></ListItemIcon>
                            <ListItemText primary="Events" />
                        </ListItem> */}
                        <ListItem button key="announcements" component={Link} to='/portal/announcements' >
                            <ListItemIcon><img src={Announcements} alt="" /></ListItemIcon>
                            <ListItemText primary="Announcements" />
                        </ListItem>
                        <ListItem button key="faqs" component={Link} to='/portal/learn'>
                            <ListItemIcon><HelpIcon /></ListItemIcon>
                            <ListItemText primary="Faqs" />
                        </ListItem>
                        <ListItem button key="surveys" component={Link} to='/portal/surveys'>
                            <ListItemIcon><BallotRoundedIcon /></ListItemIcon>
                            <ListItemText primary="Surveys" />
                        </ListItem>
                        {/* <ListItem button key="directory" component={Link} to="directory">
                            <ListItemIcon><img src={Directory} alt="" /></ListItemIcon>
                            <ListItemText primary="Directory" />
                        </ListItem> */}

                        <ListItem button key="storage" component={Link} to='/portal/storage'>
                            <ListItemIcon><CloudRoundedIcon /></ListItemIcon>
                            <ListItemText primary="Storage" />
                        </ListItem>

                        {/* <ListItem button key="mysaved">
                            <ListItemIcon><img src={MySaved} alt="" /></ListItemIcon>
                            <ListItemText primary="My Saved" />
                        </ListItem> */}
                    </List>

                </div>
                <div className="menu-footer">

                    <SearchFrame />
                    <div className="menu-footer-logo" style={{ visibility: !open ? "hidden" : "visible" }}> <QLogo /> </div>
                </div>
            </Drawer>
            <main className={clsx(classes.content, "main-content-container")}>
                <div className={classes.toolbar} />
                <div className="page-container">
                    {React.cloneElement(props.children, { datawidth: width })}
                </div>
                <LayoutFooter />
            </main>
        </div >
    );
}
export default DefaultLayout;
