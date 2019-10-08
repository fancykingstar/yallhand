import React from "react";

import LayoutHeader from "../views/components/Header";
import LayoutFooter from "../views/components/Footer";
import { useWindowDimensions } from "./WindowDimensions";
import { Link } from "react-router-dom";

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, AppBar, List, CssBaseline, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Home as HomeIcon, TouchApp as TouchAppIcon, Event as EventIcon, Help as HelpIcon } from '@material-ui/icons';
import { FaRegFileAlt } from "react-icons/fa";

import Announcements from '../assets/images/announcements.svg';
import Surveys from '../assets/images/surveys.svg';
import MySaved from '../assets/images/my-saved.svg';
import Directory from '../assets/images/Directory.svg';

import logo_img from "../assets/images/logo.png";
import {QLogo} from "../../Assets/Graphics/QLogo";
// import menu_footer_logo_img from "../assets/images/yallhands-small-grey.png";

import {AccountStore} from "../../Stores/AccountStore";


// import 'bootstrap/dist/css/bootstrap.css';
import "../assets/css/UserPortal.scss";

const drawerWidth = 256;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
    },
    appBar: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        position: 'absolute',
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
    const { width } = useWindowDimensions();

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [mopen, setMopen] = React.useState(false);
    if (width <= 992 && open !== false) {
        setOpen(false);
    }
    function handleDrawerToggle() {
        setOpen(!open);
    }
    function handleDrawerToggleMobile() {
        setMopen(!mopen);
    }

    const account = AccountStore.account;

    return (
        <div className={clsx(classes.root, "topBorderBefore", (((width <= 992) ? !mopen : !open) ? "menuClosed" : 'menuOpen'))}>
            <CssBaseline />
            <AppBar
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: (width <= 992) ? mopen : open,
                }, (((width <= 992) ? !mopen : !open) ? "appBarShiftClose" : ''), "topappbar")}
            >
                <LayoutHeader pageTitle={props.pageTitle} toggleMenu={(width <= 992) ? handleDrawerToggleMobile : handleDrawerToggle} />
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: (width <= 992) ? mopen : open,
                    [classes.drawerClose]: (width <= 992) ? !mopen : !open
                }, "drawer")}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: (width <= 992) ? mopen : open,
                        [classes.drawerClose]: (width <= 992) ? !mopen : !open,
                    }),
                }}
                open={(width <= 992) ? mopen : open}
            >
                <div className="menuHeader">
                    <h2 className="menu-header "><img src={account.img} alt="org logo" />{account.label}</h2>
                </div>
                <div className="menu-content">
                    <List>
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
                            <ListItemIcon><img src={Surveys} alt="" /></ListItemIcon>
                            <ListItemText primary="Surveys" />
                        </ListItem>
                        {/* <ListItem button key="directory" component={Link} to="directory">
                            <ListItemIcon><img src={Directory} alt="" /></ListItemIcon>
                            <ListItemText primary="Directory" />
                        </ListItem> */}

                        <ListItem button key="files">
                            <ListItemIcon><FaRegFileAlt /></ListItemIcon>
                            <ListItemText primary="Files" />
                        </ListItem>

                        {/* <ListItem button key="mysaved">
                            <ListItemIcon><img src={MySaved} alt="" /></ListItemIcon>
                            <ListItemText primary="My Saved" />
                        </ListItem> */}
                    </List>

                </div>
                <div className="menu-footer">
                    <QLogo />
                    {/* <img src={menu_footer_logo_img} alt="yallhands" /> */}
                    {/* yallhands */}
                </div>
            </Drawer>
            <main className={clsx(classes.content, "main-content-container")}>
                <div className={classes.toolbar} />
                <div className="page-container">
                    {React.cloneElement(props.children, { datawidth: width })}
                </div>
                <LayoutFooter />
            </main>
        </div>
    );
}
export default DefaultLayout;
