import { Snackbar, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useNotifyContext } from "../context/notifyContext"


const NotifyMsg = () => {
  
  const { notify, set_notify } = useNotifyContext();
  const handleClosePopup = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    set_notify({ open: false, msg: "", type: undefined })
  };
  return (
    <Snackbar
      autoHideDuration={3000}
      onClose={(e, r) => handleClosePopup(e, r)}
      open={notify.open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right", }}
    >
      <Alert
        onClose={(e, r) => handleClosePopup(e, r)}
        severity={notify.type}
        action={
          notify.btn &&
          <Button color="inherit" size="small" onClick={() => notify.onClick()}>
            {notify.btnText}
          </Button>
        }>{notify.msg || ""}
      </Alert>
    </Snackbar>
  )
}

export default NotifyMsg;