import React from 'react';
import { Button,IconButton,} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditRounded from "@material-ui/icons/EditRounded";
import PageviewIcon from "@material-ui/icons/Pageview";
import {FileCopy} from "@material-ui/icons/";
import RefreshRounded from "@material-ui/icons/RefreshRounded";
import { FaRegEyeSlash} from "react-icons/fa";
import {RiSearchEyeLine} from "react-icons/ri";
import {BiBlock} from "react-icons/bi";

const AddBtn = (props) => {
    return (
        <Button variant="contained" color="primary" {...props} >Add New +</Button>
    )
}
const EditBtn = (props) => {
    return (
        <IconButton color="primary" {...props} >
           <EditRounded />
        </IconButton>
    )
}
const DelBtn = (props) => {
    return (
        <IconButton style={{color:"#d43e24"}} {...props} >
            <DeleteIcon/>
        </IconButton>
    )
}
const ViewBtn = (props) => {
    return (
        <IconButton color="inherit" {...props} >
            <PageviewIcon />
        </IconButton>
    )
}
const RefreshBtn = (props) => {
    return (
        <IconButton color="secondary" {...props} >
        <RefreshRounded />
      </IconButton>
    )
}
const EyeBtn = (props) => {
    return (
        <IconButton color="secondary" {...props} >
        <RiSearchEyeLine/>
      </IconButton>
    )
}
const EyeSlashBtn = (props) => {
    return (
        <IconButton color="secondary" {...props} >
        <FaRegEyeSlash />
      </IconButton>
    )
}
const BlockBtn = (props) => {
    return (
        <IconButton color="secondary" style={{color: "#385c81"}} {...props} >
        <BiBlock />
      </IconButton>
    )
}
const CopyBtn = (props) => {
    return (
        <IconButton color="primary" {...props} >
        <FileCopy />
      </IconButton>
    )
}

export  { 
    EditBtn,
    AddBtn,
    DelBtn,
    ViewBtn,
    RefreshBtn,
    EyeBtn,
    EyeSlashBtn,
    BlockBtn,
    CopyBtn,
}
