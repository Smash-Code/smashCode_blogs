import Footer from "Layout/Footer/footer";
import Header from "Layout/Header/index";
import { withRouter, Route, Switch } from "react-router";
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { SiUpwork } from "react-icons/si"
import { SiFiverr } from "react-icons/si"
import NewsLetter from "Layout/NewsLetter/NewsLetter";
import NotifyContextProvider from "context/notifyContext";
import NotifyMsg from "utils/notification.jsx";

const components = [
  { name: "Blogs", path: "/" },
  { name: "Blogs", path: "/Home" },
  { name: "Admin", path: "/AdminDashboard" },
  { name: "Details/blogDetails", path: "/blog/:id" },
  // { name: "Details/category", path: "/blog/category/:id" },
  { name: "Blogs", path: "/blogs" },
  // { name: "Details/topBlogs", path: "/topBlogs" },
  // { name: "Details/featureds", path: "/featureds" },
  { name: "Notfound", path: "" },
];

const Routes = (props) => {
  return (
    <>
      {props.location.pathname &&
        props.history.location.pathname !== "/AdminDashboard" &&
        <Header />
      }
      <Route
        render={({ location }) => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return (
            <NotifyContextProvider>
              <NotifyMsg />
              <Switch
                location={location}
                key={location.pathname}>
                {components.map((el, i) => {
                  const Component = require(`../containers/${el.name}`)[
                    el.nested || "default"
                  ];
                  return (
                    <Route key={i} path={el.path} component={Component} exact />
                  );
                })};
              </Switch>
              {props.location.pathname && props.history.location.pathname !== "/AdminDashboard" &&
                <NewsLetter />
              }
            </NotifyContextProvider>

          );
        }}
      />
      {props.location.pathname && props.history.location.pathname !== "/AdminDashboard" &&
        <div className="floating-chat-btn-wrapper">
          <a className="floating-chat-btn a-white upwork-btn" href="https://www.upwork.com/freelancers/~0123bb5b957fac4a14/" target="_blank"><SiUpwork /></a>
          <a className="floating-chat-btn a-white fiverr-btn" href="https://www.fiverr.com/ismail_muhammad" target="_blank"><SiFiverr style={{ width: 38 }} /></a>
          <a className="floating-chat-btn a-white whatstbtn" href="https://wa.me/923457036429" target="_blank"><WhatsAppIcon /></a>
        </div>
      }


      {props.location.pathname && props.history.location.pathname !== "/AdminDashboard" &&
        <Footer />
      }
    </>
  );
};



export default withRouter(Routes);
