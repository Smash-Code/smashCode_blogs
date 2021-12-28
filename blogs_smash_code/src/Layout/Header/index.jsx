// import { Menu, Search } from '@material-ui/icons';
// import { InputBase, IconButton, Box, AppBar, styled, alpha } from "@material-ui/core";
// import mainLogo from "assets/images/logo.png";
// import {Link} from "react-router-dom";
import NavBar from './Navbar';
import "assets/css/header.css"
const Header = () => {return (<NavBar/>)};
export default Header

// const SearchBarr = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.black, 0.100),
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.common.black, 0.150),
//     },
//     margin: "auto",
// }));


// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     width: '100%',
//     flex: "1",
//     '& .MuiInputBase-input': {
//         padding: theme.spacing(1, 1, 1, 0),
//         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     },
// }));


// export default function Header() {
//     return (
//         <Box sx={{ flexGrow: 1 }}>
//             <AppBar position="sticky" className="header" color="inherit">
//                 <div className="d-flex border-bottom container align-items-center">
//                     <img className="header-logo" src={mainLogo} alt="Smash-Code" />
//                    <nav className="navBar">
//                        <ul>
//                            <li><Link>Home</Link></li>
//                            <li><Link>Latest</Link></li>
//                            <li><Link>Freelancing</Link></li>
//                            <li><Link>Motivation</Link></li>
//                            <li><Link>Crypto</Link></li>
//                            <li><Link>Technology</Link></li>
//                            <li><Link>Internet</Link></li>
//                            <li><Link>Education</Link></li>
//                            <li><Link>Blogs</Link></li>
//                        </ul>
//                    </nav>
//                     <IconButton style={{marginLeft:"auto"}}  size="large"
//                         color="inherit"
//                         aria-label="open drawer"
//                     >
//                         <Menu color="inherit"/>
//                     </IconButton>
//                 </div>
//                 <div className="container d-flex justify-content-center align-items-center my-2" >
//                 <SearchBarr className="search-input-header">
//                         <Search className="mx-2" />
//                         <StyledInputBase
//                             placeholder="Search…"
//                             inputProps={{ 'aria-label': 'search' }}
//                         />
//                     </SearchBarr>
//                 </div>
//             </AppBar>
//         </Box>
//     );
// }
