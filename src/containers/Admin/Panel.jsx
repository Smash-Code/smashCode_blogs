import React, { useState } from "react";
import {auth} from "config/firebase";
import clsx from "clsx";
import logo from "assets/images/mainLogo.png";
import {withRouter} from "react-router-dom";
import {
    makeStyles, Drawer, AppBar, Button, Toolbar, Typography,
    Menu,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    useTheme,
    Divider,
    Avatar,
    CssBaseline,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import {  PostAdd, Home, Backup, MenuOutlined, ChevronRight, ChevronLeft, ExitToAppOutlined, ContactMail} from '@material-ui/icons/';
import test from 'assets/images/logo.png';
import { VscAccount } from "react-icons/vsc";
import { useNotifyContext } from "context/notifyContext"
import { useAuthContext } from "context/AuthContext"
import BlogManage from "components/admin/BlogManage"
import ProfileManage from "components/admin/ProfileManage/ProfileManage"
import CategoriesManage from "components/admin/categoriesMange/categoriesMange"
import FilesManage from "components/admin/FilesManage"
import SubscribersManage from "components/admin/SubscribersManage/SubscribersManage"
import { Category } from '@material-ui/icons/';

const drawerWidth = 240;
// styling
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: theme.direction === "ltr" ? drawerWidth : "0",
        marginRight: theme.direction === "rtl" ? drawerWidth : "0",
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: "-18px",
        marginRight: theme.direction === "ltr" ? 36 : 0,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',

    },
    drawerOpen: {
        width: drawerWidth,
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
        justifyContent: 'space-between',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        backgroundColor: theme.palette.background.default,
    },
    toolbarIcon: {
        "& img": {
            width: "100%",
            maxWidth: "200px",
        }
    },
    content: {
        maxWidth: "95%",
        flexGrow: 1,
        padding: "24px",
        paddingRight: "35px"
    },
    listItemSelected: {
        backgroundColor: "#fff !important",
        "& *": {
            color: "#000",
        },
    },
    profileMenu: {
        maxWidth: "340px !important",
        paddingTop: "8px",
    },
    profileMenuItem: {
        minHeight: "32px",
        margin: "2px 0",
        "&:hover": {
            backgroundColor: "#4891f0",
            color: "#fff !important",
            "& > *": {
                color: "#fff !important"
            }
        }
    },
    profileMenuItemNoHover: {
        "&:hover": {
            backgroundColor: "transparent",
        }
    },
    selectedMenuItem: {
        backgroundColor: "#4891f0 !important",
        color: "#fff !important",
        "& > *": {
            color: "#fff !important"
        }
    },
    profileMenuIcon: {
        minWidth: "38px !important",
        marginRight: "12px",
        "& img": {
            width: "100%",
            height: "100%",
            maxWidth: "40px",
            maxHeight: "40px",
            borderRadius: "50%",
            border: "2px solid #4891f0"
        },
    },
    profileMenuText: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
    },
    btn: {
        padding: "0px 6px !important",
        "&:hover": {
            backgroundColor: "#e6e6e6",
        }
    },
}));

// side bar 
const sideBarList = [
    {
        text: "Blogs",
        icons: <PostAdd style={{ fontSize: "22px" }} />,
        component: <BlogManage/>,
    },
    {
        text: "Profile",
        icons: <VscAccount style={{ fontSize: "22px" }} />,
        component: <ProfileManage/>,
    },
    {
        text: "Categories",
        icons: <Category size="large" />,
        component: <CategoriesManage/>,
    },
    {
        text: "Upload Files",
        icons: <Backup size="large" />,
        component: <FilesManage/>,
    },
    {
        text: "Subscribers",
        icons: <ContactMail size="large" />,
        component: <SubscribersManage/>,
    },
  
]

function AdminPanel(props) {
    const { state } = useAuthContext();
    const { set_notify } = useNotifyContext();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);

    // sidebar tabs open & close
    const handleDrawerOpenClose = () => {
        open ? setOpen(false) : setOpen(true);
    };

    // logout user/admin from account
    const LogOut = () => {
        auth.signOut().then(() => {
            props.history.push('/');
            set_notify({ type: "success", msg: "Sign out successfully!", open: true, })
        }).catch((error) => {
            set_notify({ type: "info", msg: error.message, open: false })
        });
    }

    const classes = useStyles();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <div className={classes.root}>
            <CssBaseline 
           
            />
            <AppBar className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
                color="inherit"
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpenClose}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuOutlined />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Dashboard
                    </Typography>
                    <div className="d-flex justify-content-center align-items-center px-3"
                        style={{
                            position: "absolute",
                            right: theme.direction === "ltr" ? "15px" : "auto",
                            left: theme.direction === "ltr" ? "auto" : "15px",
                        }}
                    >
                        <IconButton color="primary" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                            {state?.user?.profile ?
                                <Avatar alt="Smash-Code" src={state.user.profile} />
                                : <VscAccount className="ml-auto" />
                            }
                        </IconButton>
                        <Menu
                            id="fade-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={openMenu}
                            onClose={handleClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            classes={{ paper: classes.profileMenu }}
                        >
                            <MenuItem className={classes.profileMenuItemNoHover} disableRipple={true}>
                                {
                                state.user?.profile ?
                                    <div className={classes.profileMenuIcon}>
                                        <Avatar src={state.user?.profile} 
                                        alt={state.user?.user_name} />
                                    </div>
                                    :
                                    <div className={classes.profileMenuIcon}>
                                        <Avatar alt="Smash-Code" src={test} />
                                    </div>
                                }
                                <Typography className={classes.profileMenuText}>
                                    Hello
                                    <br />
                                    {state?.user?.user_name}
                                    <br />
                                    <Button
                                      onClick={() => {handleClose(); setValue(1) }}
                                        className={`p-0 text-lowercase font-weight-light ${classes.btn}`}
                                        color="secondary" variant="text">view and edit your profile</Button>
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem 
                            onClick={() => { handleClose(); setValue(0) }}
                                className={classes.profileMenuItem} classes={{ selected: classes.selectedMenuItem }}>
                                <ListItemIcon classes={{ root: classes.profileMenuIcon }}>
                                    <PostAdd fontSize="small" />
                                </ListItemIcon>
                               Manage Blogs
                            </MenuItem>
          
                            <MenuItem  
                            onClick={() => {handleClose(); setValue(1) }}
                                className={classes.profileMenuItem} 
                                classes={{ selected: classes.selectedMenuItem }}>
                                <ListItemIcon classes={{ root: classes.profileMenuIcon }}>
                                    <VscAccount style={{ fontSize: "18px" }} />
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            
                            <Divider />
                            <MenuItem onClick={LogOut} className={classes.profileMenuItem}>
                                <ListItemIcon classes={{ root: classes.profileMenuIcon }}>
                                    <ExitToAppOutlined fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>

                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <div className={classes.toolbarIcon}>
                        <img src={logo} alt="Smash-Code" className={classes.logo} />
                    </div>
                    <IconButton color="primary" onClick={handleDrawerOpenClose}>
                        {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {
                        sideBarList.map((listItem, index) => {
                            return (
                                <ListItem selected={index === value}
                                    button key={index}
                                    classes={{ selected: classes.listItemSelected }}
                                    onClick={() => { setValue(index); }}>
                                    <ListItemIcon style={{ color: index === value ? "#000" : "#fff" }}>{listItem.icons}</ListItemIcon>
                                    <ListItemText primary={listItem.text} />
                                </ListItem>
                            )
                        })}
                    <ListItem button component={Link} to="/">
                        <ListItemIcon style={{ color: "#fff" }}><Home style={{ fontSize: "25px" }} /></ListItemIcon>
                        <ListItemText primary="Visit site" />
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content} >
                <div className={classes.toolbar} />
                {sideBarList.map((listItem, index) => (
                    <TabPanel key={index}
                        value={value}
                        index={index}
                        children={listItem.component} />
                ))}
            </main>
        </div>

    );
}

// Dashboard Tabs 
function TabPanel(props) {
    const { value, index, children } = props;
    return (
        <div hidden={value !== index}>
            {value === index && children}
        </div>
    );
}


export default withRouter(AdminPanel);