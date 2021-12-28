import React,{useState} from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {TableContainer, Table, Paper, TableRow, TableHead, TableCell,TablePagination } from "@material-ui/core/";

// General styling for all records tables
const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    position: "relative",
    marginTop:"20px",
    color: theme.palette.text.secondary,
    maxHeight: "100vh",
    "&:hover": {
      boxShadow: "5px 5px 15px #00000053",
      transition: ".3s ease-in",
    },
    // border: "3px solid yellow"
  },
  table: {
    width: "100%",
    maxWidth: "100%",
    height: "50%",
    "& td": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      padding:"4px 7px 4px 18px",
      WebkitLineClamp: 3,
    },
    "& .media-img-table": {
      width:"35px",
      height:"35px",
      borderRadius: "50%"

    },
    "& td p": {
      textOverflow: "ellipsis",
      WebkitLineClamp: 3,
      position: "relative",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      maxWidth: "250px",
    },
    "& .actionCol":{
      display:"flex",
      height:"100%"
    }
  },
  tbl_pagination:{
    position: "sticky",
    bottom:"-2px",
    left: "0",
    width:"100%",
    backgroundColor: theme.palette.background.default,

    borderTop:"1px solid gray",
    "& .MuiSelect-icon":{
      color:"# !important"
    },
    "& .Mui-disabled":{
      opacity: ".3"
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    // backgroundColor:"lightseagreen",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.common.white,
    textTransform: "UpperCase",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

// Exported reuseable records table 
export default function UseTable(records, headCells) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const TblContainer = props => (
    <TableContainer component={Paper} className={classes.container}>
      
      <Table stickyHeader className={classes.table}>
        {props.children}
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={records && Object.values(records).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
          className={classes.tbl_pagination}
      />
    </TableContainer>
  )
  const TblHead = props => (
    <TableHead position="sticky">
      <TableRow>
        {headCells.map((title, i) => {
          return (
            <StyledTableCell key={i}>{title}</StyledTableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
      "&:hover":{
        backgroundColor: "#2f2f2f",
        boxShadow: "0px -2px 15px #00000025",
        transition: ".3s ease-in",
      },
      "& td:not(.actionCol):hover":{
        cursor:"pointer",
      },
      textTransform: "capitalize",
    },
  }))(TableRow);
  
  return {
    TblContainer,
    TblHead,
    StyledTableRow,
    rowsPerPage,
    page
  }
}

