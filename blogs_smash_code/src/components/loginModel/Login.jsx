import { useState } from "react";
import { auth } from "../../config/firebase"
import {
  Dialog,
  Button,
  IconButton,
  DialogContent,
  TextField,
  DialogActions
} from "@material-ui/core";
import { useNotifyContext } from "../../context/notifyContext";
import CancelIcon from '@material-ui/icons/Cancel';
import {CircularProgress} from "@material-ui/core"

const LoginModel = (props) => {
  const { set_notify } = useNotifyContext();
  const { open, onClose } = props
  const [forgotForm, setForgotform] = useState(false);
  const [formDetails, setformDetails] = useState({});
  const [errors, setErrors] = useState({
    email: "",
    emailValid: true,
    passValid: true,
    password: ""
  });

  const [loginFormSendingLoading, setLoginFormSendingLoading] = useState(false);
  
  const loginToAc = (e) => {
    e.preventDefault();
    setLoginFormSendingLoading(true);
    if (errors.emailValid && errors.passValid && formDetails.email?.length > 2) {
    auth.signInWithEmailAndPassword(formDetails.email, formDetails.password)
        .then((userCredential) => {
          forgotForm && setForgotform(false);
          set_notify({
            open: true,
            msg: `Login successfully!`,
            type: "success"
          });
          setLoginFormSendingLoading(false);
          setformDetails({})
          onClose();
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(formDetails)
          setLoginFormSendingLoading(false);
          console.log(error)
          set_notify({
            open: true,
            msg: errorMessage ? errorMessage : "Something error occurred! ",
            type: "error"
          });
        });
    } else {
      setLoginFormSendingLoading(false);
      set_notify({
        open: true,
        msg: `Please Enter all the details`,
        type: "error"
      })
    }

  };

  const handleFormDetails = (e) => {
    let emRgx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case "email":
        if (emRgx.test(value)) {
          setformDetails({
            ...formDetails,
            [name]: value
          })
          setErrors({
            ...errors,
            email: "",
            emailValid: true
          })
        } else {
          setErrors({
            ...errors,
            email: "Invalid email address",
            emailValid: false
          })
          setformDetails({
            ...formDetails,
            [name]: value
          })
        }
        break;
      case "password":
        if (!value) {
          setErrors({
            ...errors,
            password: "Password required",
            passValid: false,
          })
          setformDetails({
            ...formDetails,
            [name]: value,
          })
        } else {
          setformDetails({
            ...formDetails,
            [name]: value
          })
          setErrors({
            ...errors,
            password: "",
            passValid: true,
          })
        }
        break;
      default:

    }
  };


  return (
    <Dialog
      PaperProps={{ style: { maxWidth: 400 } }}
      onClose={() => { onClose(); setformDetails({}); setErrors({}); forgotForm && setForgotform(false); }}
      open={open || false}
    >
      <DialogContent className="custom_scrollbar" dividers>
        <div className="d-flex justify-content-end">
          <IconButton className=""
            onClick={() => onClose()} color="primary">
            <CancelIcon />
          </IconButton>
        </div>
        <form action="" onSubmit={loginToAc}>
          <TextField type="email" label="Email" name="email" onChange={(e) => handleFormDetails(e)}
            fullWidth
            error={!errors.emailValid}
            helperText={formDetails.email === "" ? 'Email is required' : errors.email || ''}
            value={formDetails.email || ''}
            className="mb-2"
          />
          <TextField type="password" label="Password" name="password" onChange={(e) => handleFormDetails(e)}
            fullWidth
            error={!errors.passValid}
            helperText={formDetails.password === "" ? 'password is required' : errors.password || ''}
            value={formDetails.password || ''}
            className="mt-2"
          />
          {loginFormSendingLoading ?
            <Button
              variant="contained"
              color="primary"
              className={`my-2`}
              fullWidth
              size="large"
              disabled={true}
            >
              Loading &nbsp;
              <CircularProgress size={25}/>
            </Button>
            :
            <Button
              variant="contained"
              color="primary"
              className={`my-2`}
              fullWidth
              size="large"
              type="submit"
              // onClick={loginToAc}
              disabled={errors.emailValid && errors.passValid ? false : true}
            >
              Login
            </Button>}
        </form>
      </DialogContent>
      <DialogActions className="py-2 justify-content-center">
      </DialogActions>
    </Dialog>
  );
};

export default LoginModel;