import React from "react";
import "assets/css/footer.css";
import {
  FaFacebookF,
  FaLinkedin,
  FaGithub,
  FaMapMarkerAlt,
  FaYoutube,
  FaInstagram,
  FaPhone,
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaBook,
  FaServicestack,
} from "react-icons/fa";
import { BsEnvelope } from "react-icons/bs";
// import { GiBlackBook } from "react-icons/gi";
import { SiGmail } from "react-icons/si";
import { BsPhone } from "react-icons/bs";
import TwitterIcon from '@material-ui/icons/Twitter';
import { Link, withRouter } from "react-router-dom";
import logo from "../../assets/images/web/logopng.png";

const Footer = (props) => {
  return (
    <footer className="footer-section mt-auto">
      <div className="container-lg px-4">
        <div className="footer-cta pb-4 pt-5">
          <div className="row">
            <div className="col-md-4  pb-md-0">
              <div className="d-flex justify-content-center align-items-center">
                <div className="cta-icons-top">
                  <FaMapMarkerAlt />
                </div>
                <div className="cta-text">
                  <h4>Location</h4>
                  <span>Faisalabad, Pakistan</span>
                </div>
              </div>
            </div>
            <div className="col-md-4  pb-md-0">
              <div className="d-flex justify-content-center align-items-center">
                <div className="cta-icons-top">
                  <BsPhone />
                </div>
                <div className="cta-text">
                  <h4>Contact (whatsapp)</h4>
                  <span>+92 3457036429</span>
                </div>
              </div>
            </div>
            <div className="col-md-4  pb-md-0">
              <div className="d-flex justify-content-center align-items-center">
                <div className="cta-icons-top">
                  <BsEnvelope />
                </div>
                <div className="cta-text">
                  <h4>Email</h4>
                  <span>smashcode.dev@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-content pt-3 pb-3">
          <div className="row">
            <div className="col-xl-4 col-lg-4 mb-50">
              <div className="footer-widget">
                <div className="footer-logo">
                  <Link to="/" className="a-white">
                    <img src={logo} alt="" />
                  </Link>
                </div>
                <div className="footer-text text-left">
                  <p>
                    Smash Code is a Web Design & Development Company based in Faisalabad, Pakistan founded in 2019. We are a team of skilled Web Designers & Developers, Graphic Designers, and Content & Copy Writers.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>Quick - Links</h3>
                </div>
                <ul>
                  <li>
                    <a
                      href="https://smashcode.dev"
                      className="a-simple"
                    >
                      <FaHome /> Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://smashcode.dev/about"
                      className="a-simple"
                    >
                      <FaUser /> About
                    </a>
                  </li>
                  <li>
                    {/* <Link
                      to="/contact"
                      className="a-simple a-white"
                      style={{
                        color:
                          props.location.pathname === "/contact"
                            ? "var(--primary)"
                            : "",
                      }}
                    >
                     <FaPhone/> Contact
                    </Link> */}
                    <a
                      href="https://smashcode.dev/contact"
                      className="a-simple a-white" >
                      <FaPhone /> Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://smashcode.dev/services"
                      className="a-simple"
                    >
                      <FaServicestack /> Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://smashcode.dev/projects"
                      className="a-simple"
                    >
                      <FaProjectDiagram /> Projects
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/blogs"
                      className="a-simple"
                      style={{
                        color:
                          props.location.pathname === "/blogs"
                            ? "var(--primary)"
                            : "",
                      }}
                    >
                      <FaBook />  blogs
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="/featureds"
                      className="a-simple"
                      style={{
                        color:
                          props.location.pathname === "/featureds"
                            ? "var(--primary)"
                            : "",
                      }}
                    >
                      Featured
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      to="/topBlogs"
                      className="a-simple"
                      style={{
                        color:
                          props.location.pathname === "/topBlogs"
                            ? "var(--primary)"
                            : "",
                      }}
                    >
                      Top Blogs
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-social-icon">
                  <div className="footer-widget-heading">
                    <h3>Social - Links</h3>
                  </div>
                  <a
                    className="a-white"
                    href="https://free.facebook.com/IsmailSheikh234/services/?ref=page_internal&mt_nav=0&_rdr"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebookF className="facebook-bg" />
                  </a>
                  <a
                    className="a-white"
                    href="https://mobile.twitter.com/SmashCode1"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TwitterIcon className="twitter-bg" />
                  </a>
                  <a
                    className="a-white"
                    href="https://github.com/Smash-Code"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGithub className="github-bg" />
                  </a>
                  <a
                    className="a-white"
                    href="https://www.linkedin.com/in/smash-code-674008217/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaLinkedin className="linkedin-bg" />
                  </a>
                  <a className="a-white" href="mailto:smashcode.dev@gmail.com" target="_blank" rel="noreferrer"><SiGmail className="google-bg" /></a>
                  <a
                    className="a-white"
                    href="https://www.instagram.com/smashcode1/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram className="insta-bg" />
                  </a>
                  {/* <Link
                    to="/blogs"
                    className="a-simple"
                  >
                    <GiBlackBook className="blog-bg" />
                  </Link> */}
                  <a
                    className="a-white"
                    href="https://www.youtube.com/c/SmashCode/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaYoutube className="youtube-bg" />
                  </a>
                  {/* <a className="a-white" href="#" target="_blank" rel="noreferrer"><FaSkype className="skype-bg" /></a> */}
                </div>
              </div>
            </div>
            {/* <div className="col-md-7 col-sm-10 col-11 mx-auto pt-3">
              <div className="footer-text">
                <p>
                  Smash Code is a Web Design & Development Company based in Faisalabad, Pakistan founded in 2019. We are a team of skilled Web Designers & Developers, Graphic Designers, and Content & Copy Writers.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-6 col-lg-6 text-center text-lg-left">
              <div className="copyright-text">
                <p className="m-0 text-muted">
                  Copyright © {new Date().getFullYear()}, All Right Reserved{" "}
                  <a
                    className="a-white"
                    href="https://www.smash-code.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Smash-Code
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default withRouter(Footer);
