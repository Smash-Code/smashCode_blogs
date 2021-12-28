import React,{forwardRef} from 'react'
import { Dialog,DialogTitle,DialogActions,DialogContentText,DialogContent,  Slide,  IconButton } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close"
import DoneAllIcon from "@material-ui/icons/DoneAll";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = (props) => {
    const {head,info,btn2,btn1,open} = props.data;
    const {setAskModel,onClick} = props;
    // console.log(props.onClick)
    return (
        <Dialog open={open} TransitionComponent={Transition} onClose={()=>setAskModel({
            open:false,
            head:"",
            btn1:true,
            btn2: false,
            info: ""
        })}>
        <DialogTitle>{head}</DialogTitle>
        <DialogContent>
            <DialogContentText component="div">
                {info}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {btn2 &&
                <IconButton color="primary" onClick={()=>setAskModel({
                    open:false,
                    head:"",
                    btn1:true,
                    btn2: false,
                    info: ""
                })}>
                    <CloseIcon />
                </IconButton>
            }
            {
                btn1 &&
                <IconButton
                    color="secondary"
                    onClick={onClick}
                >
                    <DoneAllIcon />
                </IconButton>
            }
        </DialogActions>
    </Dialog>
    )
}

export default ConfirmDialog
