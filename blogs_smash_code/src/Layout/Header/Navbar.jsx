import React, { useState, useEffect, useRef } from 'react';
import logo from "assets/images/web/logopng.png";
import { Link, withRouter } from "react-router-dom";
import SearchBar from './SearchBar';
import { ClickAwayListener, Avatar, Menu, MenuItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import { useAuthContext } from "context/AuthContext";
import PublicLoginModel from "components/loginModel/PublicLoginModel";
import { AccountCircle, ExitToAppOutlined, Dashboard } from "@material-ui/icons";


const NavBar = (props) => {
    const { state, logoutAccount } = useAuthContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isShowSearchBar, setIsShowSearchBar] = useState(false);
    const [loginModel, setLoginModel] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const openProfileMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeProfileMenu = () => {
        setAnchorEl(null);
    };

    const deskHeader = useRef();
    let lastScroll = 0;
    const headerSticky = () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0 && deskHeader.current) {
            deskHeader.current.classList.remove("hide-scroll-header");
            return;
        }
        if (currentScroll > lastScroll && deskHeader.current) {
            deskHeader.current.classList.add("hide-scroll-header");
        } else if (currentScroll < lastScroll && deskHeader.current) {
            deskHeader.current.classList.remove("hide-scroll-header");
        }
        lastScroll = currentScroll;
    }
    useEffect(() => {
        window.addEventListener("scroll", headerSticky);
    });
    // Menu
    const openMenu = () => {
        menuOpen ? setMenuOpen(false) : setMenuOpen(true);
    }
    const closeSideBar = () => {
        setMenuOpen(false);
    };

    // SEARCH BAR
    const closeSearchBar = () => {
        setIsShowSearchBar(false);
    };
    const openSearchBar = () => {
        setIsShowSearchBar(true);
    };


    // console.log(state.isAuthenticated)
    // console.log(state.user)
    return (
        <>
            <PublicLoginModel
                loginModel={loginModel}
                setLoginModel={setLoginModel}
            />
            <ClickAwayListener onClickAway={closeSearchBar}>
                <header ref={deskHeader} className="head-header">
                    <div className="header-container d-none d-lg-flex">
                        <div className="header-logo-sec">
                            <Link to="/" ><img src={logo} alt="" /></Link>
                        </div>
                        <div className="header-navbar-wrapper">
                            <nav className="header-nav">
                                <ul>
                                    <li onClick={closeSearchBar}>
                                        <a href="https://smashcode.dev" className={"a-white"}>Home</a>
                                    </li>

                                    <li onClick={closeSearchBar}>
                                        <a href="https://smashcode.dev/projects" className={"a-white"}>Projects</a>
                                    </li>
                                    <li onClick={closeSearchBar}>
                                        <a href="https://smashcode.dev/projects" className={"a-white"}>Services</a>
                                    </li>
                                    <li onClick={closeSearchBar}>
                                        <Link className={props.location.pathname === "/blogs" ? "active-nav-link-desktop a-white" : "a-white"} to="/blogs">Blogs</Link>
                                    </li>
                                    <li onClick={closeSearchBar}>
                                        <a className="a-white" href="https://smashcode.dev/about">About</a>
                                    </li>
                                    <li className="cursor-pointer head-search-bar-icon">
                                        <div className={`search-icon-inner ${!isShowSearchBar ? "hide-search-icon" : ""}`}
                                        >
                                            <CloseIcon className={`se-icon`} onClick={closeSearchBar} />
                                            <SearchIcon className={`se-icon`} onClick={openSearchBar} />
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="header-right-btns-wrapper">
                            {/* <Link className={props.location.pathname === "/contact" ? "header-contact-btn active-contact-page" : "header-contact-btn"} to="/contact">Contact</Link> */}
                            <a className={"header-contact-btn"} href="https://smashcode.dev/contact">Contact</a>
                            {state.isAuthenticated && Object.keys(state.user).length > 0 ?
                                <button className="header-login-btn"
                                    className="header-login-btn"
                                    aria-controls="fade-menu" aria-haspopup="true"
                                    onClick={openProfileMenu}

                                >
                                    <Avatar src={state.user.profile} alt={state.user?.user_name} />
                                </button>
                                :
                                <button className="header-login-btn" onClick={() => { setLoginModel(true); }}>
                                    <AccountCircle className="account-icon" />
                                </button>
                            }
                        </div>
                        <Menu
                            id="fade-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={openMenu}
                            onClose={closeProfileMenu}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={closeProfileMenu}
                        >
                            <MenuItem onClick={() => { logoutAccount(); closeProfileMenu() }}>
                                <ExitToAppOutlined />&nbsp;
                                Logout
                            </MenuItem>
                            {state.user.admin === true &&
                                <MenuItem
                                    onClick={() => { closeProfileMenu() }}
                                    component={Link}
                                    to="/AdminDashboard"
                                >
                                    <Dashboard />&nbsp;
                                    Dashboard
                                </MenuItem>}
                        </Menu>
                    </div>
                    <div className="header-container-mobile d-flex d-lg-none justify-content-between align-items-center">
                        <div className="header-logo-sec-mobile">
                            <Link to="/"><img src={logo} alt="" /></Link>
                        </div>
                        <div className="cursor-pointer head-search-bar-icon">
                            <div className={`search-icon-inner ${!isShowSearchBar ? "hide-search-icon" : ""}`} >
                                <CloseIcon className={`se-icon`} onClick={closeSearchBar} />
                                <SearchIcon className={`se-icon`} onClick={openSearchBar} />
                            </div>
                        </div>
                        <div className="header-menu-openClose-btn">
                            <div id="hamburger" className={`hamburglar ${menuOpen ? 'is-open' : 'is-closed'}`} onClick={() => { openMenu(); closeSearchBar() }
                            }>
                                <div className="burger-icon">
                                    <div className="burger-container">
                                        <span className="burger-bun-top"></span>
                                        <span className="burger-filling"></span>
                                        <span className="burger-bun-bot"></span>
                                    </div>
                                </div>

                                <div className="burger-ring">
                                    <svg className="svg-ring">
                                        <path className="path" fill="none" stroke="var(--primary)" strokeMiterlimit="10" strokeWidth="4" d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2" />
                                    </svg>
                                </div>
                                <svg width="0" height="0">
                                    <mask id="mask">
                                        <path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff0000" strokeMiterlimit="10" strokeWidth="4" d="M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4" />
                                    </mask>
                                </svg>
                                <div className="path-burger">
                                    <div className="animate-path">
                                        <div className="path-rotation"></div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <SearchBar
                        open={isShowSearchBar}
                        closeSearch={closeSearchBar}
                    />
                </header>
            </ClickAwayListener>
            <div className="nav-side-bar-mob d-block d-lg-none" >
                {menuOpen && <div className="side-bar-overlay" onClick={closeSideBar}></div>}
                <nav style={{ left: menuOpen ? 0 : "-120%" }}>
                    <div className="side-bar-logo">
                        <Link to="/"><img src={logo} alt="" /></Link>
                    </div>
                    <ul>
                        <li onClick={closeSearchBar}>
                            <a href="https://smashcode.dev/">Home</a>
                        </li>
                        <li className={props.location.pathname === "/blogs" ? "active-nav-link" : ""}>
                            <Link to="/blogs" onClick={closeSideBar}>Blogs</Link>
                        </li>
                        {/* <li className={props.location.pathname === "/featureds" ? "active-nav-link" : ""}>
                            <Link to="/featureds" onClick={closeSideBar}>Featured</Link>
                        </li> */}
                        {/* <li className={props.location.pathname === "/topBlogs" ? "active-nav-link" : ""}>
                            <Link to="/topBlogs" onClick={closeSideBar}>Top Blogs</Link>
                        </li> */}
                        <li onClick={closeSearchBar}>
                            <a href="https://smashcode.dev/projects">Projects</a>
                        </li>
                        <li onClick={closeSearchBar}>
                            <a href="https://smashcode.dev/services">services</a>
                        </li>
                        <li>
                            {/* <Link to="/contact" onClick={() => {
                                closeSideBar();
                                closeSearchBar();
                            }}>Contact</Link> */}
                            <a href="https://smashcode.dev/contact" onClick={() => {
                                closeSideBar();
                                closeSearchBar();
                            }}>Contact</a>
                        </li>
                        <li onClick={closeSearchBar}>
                            <a href="https://smashcode.dev/about">about</a>
                        </li>
                        {state.isAuthenticated && Object.keys(state.user).length > 0 && state.user.admin === true &&
                            <li>
                                <Link
                                    to="/AdminDashboard"
                                    onClick={() => {
                                        closeSideBar();
                                        closeSearchBar();
                                    }
                                    }
                                    className="text-center w-100 d-block text-pri"
                                >
                                    <Dashboard />&nbsp;
                                    Dashboard
                                </Link>
                            </li>
                        }
                        <li>
                            {state.isAuthenticated && Object.keys(state.user).length > 0 ?
                                <button className="header-login-btn my-2 mx-auto d-block  text-center"
                                    onClick={() => {
                                        closeSideBar();
                                        closeSearchBar();
                                    }
                                    }
                                >
                                    <Avatar className="mx-auto text-center" src={state.user.profile} alt={state.user?.user_name} />
                                    <span className="text-center"><br />{state.user.user_name}</span>
                                </button>
                                :
                                <button className="mx-auto header-login-btn" onClick={() => { setLoginModel(true); closeSearchBar(); closeSideBar() }}><AccountCircle className="account-icon" />&nbsp; Login</button>
                            }
                        </li>
                        {state.isAuthenticated && Object.keys(state.user).length > 0 &&
                            <li>
                                <button className="header-login-btn my-2 mx-auto d-block  text-center"
                                    onClick={() => {
                                        closeSideBar();
                                        closeSearchBar();
                                        logoutAccount()
                                    }
                                    }
                                >
                                    <span className="text-center"><ExitToAppOutlined /> Logout</span>
                                </button>
                            </li>
                        }

                    </ul>
                </nav>

            </div>
            <div className="header-spacer"></div>
        </>

    )
}

export default withRouter(NavBar)
