import { Menu, MenuItem,  withStyles } from "@material-ui/core";
import { Facebook, Twitter, WhatsApp } from "assets/images/icons/SocialIcons";
import {useNotifyContext}  from "context/notifyContext";
import { withRouter,  } from "react-router-dom";
import AssignmentIcon from '@material-ui/icons/Assignment';

const icons = { Facebook, WhatsApp, Twitter, };
const items = [
  {
    name: "Facebook",
    url: (url) => `https://facebook.com/sharer/sharer.php?u=${url}`,
    color: `rgb(82,136,249)`,
    text_color: "#fff"
  },
  {
    name: "Twitter",
    url: (url) => `https://twitter.com/intent/tweet/?text=${url}`,
    color: `#55acee`,
    text_color: "#fff"
  },
  {
    name: "WhatsApp",
    url: (url) => `whatsapp://send?text=${url}`,
    color: `#25D366`,
    text_color: "#fff"
  },
];

export const social = items.map((el) => (
  console.log(el),
  { ...el, Icon: icons[el.name] }
));

const CustomMenuItem = withStyles((theme) => ({
  root: {
    // backgroundColor: (props) => props.color,
    color:  (props) => props.color,
    margin: '4px 0',
    "&:hover": {
      color: (props) => props.color,
    },
  },
}))(MenuItem);

const ShareDropdown = (props) => {
  const {url, open, handleClose, onClick,twitter_url} = props;
  // const { setSuccess } = usePopup();
  // const theme = useTheme();
  const {set_notify} = useNotifyContext();
  async function copyToClipboard(text = "") {
    await navigator.clipboard.writeText(text);
    set_notify({open: true, msg: "Copied to Clipboard" , type: "success"})
  }
  return (
    <>
      <Menu
        component="nav"
        onClick={onClick}
        onClose={handleClose}
        anchorEl={open}
        keepMounted
        open={Boolean(open)}
        classes={{
          paper: 'ss'
        }}
        >
        <CustomMenuItem
          onClick={() => {
            copyToClipboard(url);
            handleClose();
          }}
          button
          color={'#c3baba;'}
        >
         <AssignmentIcon 
         className="mr-2" 
         color="inherit"
         size="large" style={{marginLeft: "-5px"}}/>
         &nbsp; Copy to Clipboard
        </CustomMenuItem>
        {social.map((el,i) => {
          return (
          el.name === 'Twitter' ?
            <CustomMenuItem
            key={i}
            button
            color={el.color}
            onClick={()=> window.open(el.url(twitter_url), "_blank")}
          >
            <el.Icon width={20} 
            fill="currentColor" 
            className="me-2 mr-2" />
            {el.name}
          </CustomMenuItem>
          :
          <CustomMenuItem
            key={i}
            button
            color={el.color}
            onClick={()=> window.open(el.url(url), "_blank")}
          >
            <el.Icon width={20} 
            fill="currentColor" 
            className="me-2 mr-2" />
            {el.name}
          </CustomMenuItem>
        )
        })}
      </Menu>
    </>
  );
};


export default withRouter(ShareDropdown);
