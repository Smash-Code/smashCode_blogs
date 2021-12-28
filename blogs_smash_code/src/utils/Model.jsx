import React,{ forwardRef } from 'react'
import { Dialog,  Slide, makeStyles, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close"

const useStyles = makeStyles((theme) => ({
    root:{
        // minWidth: '45% !important',
        overflowX: "hidden"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    toolbar:{
        minHeight: "40px !important",
    },
}));

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PopDialog = (props) => {
    const classes = useStyles();
    const {title,children,model,setModel,bigModel, customToolBar} = props;
    return (
        <Dialog  
        fullScreen={bigModel || false}
        open={model || false}
        onClose={() => setModel(false)}
        TransitionComponent={Transition}
        classes={{paper:classes.root}}
        >
        {customToolBar ? null :
        <AppBar  position="sticky">
            <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setModel(false)}
                    aria-label="close"
                    >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                {title}
                </Typography>
               
            </Toolbar>
        </AppBar>}
        {children}
    </Dialog>
    )
}

export default PopDialog;


