import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/505.css"
import "./assets/css/style.css"
import "./assets/css/blog.css"
import "./assets/css/dashboard.css"
import Routes from "./config/Routes.jsx";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";




//  Theme config
const colors = {
  primary: "#1aaca2",
  "primary-light": "#40e0d6",
  "primary-dark": "#136e68",
  secondary: "#17cae2",
  "secondary-light": "#57e4f6",
  "secondary-dark": "#15aabe",
};

function App() {
 
  const theme = createTheme({
    direction: 'ltr',
    palette: {
      type: "dark",
      mode: 'dark',
      primary: {
        main: colors.primary,
        light: colors["primary-light"],
        dark: colors["primary-dark"],
        contrastText: `#fff`,
      },
      secondary: {
        contrastText: `#fff`,
        main: colors.secondary,
        light: colors["secondary-light"],
        dark: colors["secondary-dark"],
      },
    },
    typography: {
      // fontFamily: `sans-serif`,
      fontWeightBold: 700,
      fontWeightLight: 300,
      fontWeightMedium: 600,
      fontWeightRegular: 400,
      h1: {
        fontSize: `3rem`,
      },
      h2: {
        fontSize: `2.5rem`,
      },
      h3: {
        fontSize: `2rem`,
      },
      h4: {
        fontSize: `1.75rem`,
      },
      h5: {
        fontSize: `1.5rem`,
      },
      h6: {
        fontSize: `1.25rem`,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;