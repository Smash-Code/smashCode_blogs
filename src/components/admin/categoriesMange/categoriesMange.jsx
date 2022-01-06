import { useState, useEffect, useRef } from 'react'
import { db, storage } from "config/firebase";
import { List, ListItem, Select, ListItemText, Chip, Divider, Button, Typography, Grid, TextField, CardMedia, TableCell, TableBody } from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ClearIcon from "@material-ui/icons/Clear";
import Loader from "utils/Loader";
import defaultimg from "assets/images/placeholder-img.jpg"
import UseTable from "../Tools/table/Tbl";
import Moment from "moment";
import GtRecState from "../Tools/tableAction/getRecordState";
import { getSortByTransactionDate } from "store/action";
import Model from "utils/Model";
import { EditBtn, AddBtn, DelBtn, ViewBtn, } from "utils/btns"
import ConfirmDialog from "utils/ConfirmDialog";
import { BsCheckAll } from "react-icons/bs";
import noDataFoundImg from "assets/images/noDatafound.png"
import { useNotifyContext } from "context/notifyContext"
import { useAuthContext } from "context/AuthContext"
import Autocomplete from "@material-ui/lab/Autocomplete"

//  firebase variables
const dbCategoryRef = db.ref("categories");

// generate random strings to attach with image name so every image has unique name
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Data Table setup
const HeadCells = [
    'Image',
    'Name',
    'Status',
    'Description',
    'Action'
]

const ManageCategory = () => {
    const { set_notify } = useNotifyContext();
    const [categories, setCategories] = useState([]);
    const [addNewCateForm, setAddNewCateForm] = useState(false);
    const [fullScreenLoader, setFullScreenLoader] = useState(false);
    const [viewDetails, setViewDetails] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selRec, setSelRec] = useState('');
    const [openAskPopup, setAskOpenPopup] = useState({
        open: false,
        info: "",
        head: "Alert!",
        btn1: true,
        btn2: false
    });

    // get all records of categories from Database
    useEffect(() => {
        function getAllCategories() {
            setCategories([])
            dbCategoryRef.orderByChild("post_date").on('value', function (data) {
                setDataLoaded(true);
                if (data.val() != null) {
                    setCategories(Object.values(data.val()).filter((val) => val));
                } else {
                    setCategories([]);
                }
            })
        };
        getAllCategories();
    }, []);

    return (
        <>
            {fullScreenLoader &&
                <Loader type="imgloader_fixed" />
            }
            <div className="mt-2 d-flex w-100 justify-content-end mb-3">
                <AddBtn onClick={() => {
                    setSelRec('')
                    setAddNewCateForm(true);
                }} />
            </div>
            <Model model={addNewCateForm} setModel={setAddNewCateForm}
                title={selRec ? "Update Details" : "Add Categories"}>
                <NewForm
                    setFullScreenLoader={setFullScreenLoader}
                    setOpen={setAddNewCateForm}
                    selRec={selRec} setAskOpenPopup={setAskOpenPopup} set_notify={set_notify}
                />
            </Model>
            {categories?.length > 0 ?
                <RecordsTable
                    allCategories={categories}
                    setFullLoader={setFullScreenLoader}
                    setViewDetails={setViewDetails}
                    setAskOpenPopup={setAskOpenPopup}
                    setSelRec={setSelRec}
                    setOpen={setAddNewCateForm}
                    set_notify={set_notify}
                />
                :
                <div className="p-5 text-center">
                    {dataLoaded ? <p>No Categories data are found.</p>
                        : <Loader type="imgloader" />}
                </div>
            }
            <ConfirmDialog data={openAskPopup}
                onClick={() => {
                    setAskOpenPopup({ open: false, btn1: true, btn2: false, head: "", info: "" });
                    openAskPopup.func && openAskPopup.func()
                }}
                setAskModel={setAskOpenPopup}
            />
            <Model model={viewDetails} setModel={setViewDetails} title={"View Details"}>
                <div className="UserupdateFormAdmin" style={{ minWidth: "400px" }}>
                    <DetailData setOpen={setViewDetails} selRec={selRec} set_notify={set_notify} />
                </div>
            </Model>
        </>
    )
}
const top100Films = [{ title: "" }];

// Records Table
function RecordsTable(props) {
    const { set_notify } = useNotifyContext();
    const [data, setDta] = useState([]);
    const [searching, setSearching] = useState(false);
    const { TblContainer, TblHead, StyledTableRow, rowsPerPage, page } = UseTable(searching ? data : props.allCategories, HeadCells);
    function removeSelectedData(nam) {
        props.setAskOpenPopup({
            open: true,
            btn1: true, btn2: true,
            head: "Confirm",
            func: () => delRecord(nam),
            info: "Are you sure you want to delete this record?"
        })
    }
    const delRecord = (nam) => {
        if (nam) {
            db.ref(`categories/${nam}`).remove().then(() => {
                set_notify({ type: "error", open: true, msg: "Record deleted succesfully" })
                props.setAskOpenPopup({
                    open: false,
                    btn1: true, btn2: false,
                    head: "",
                    info: ""
                })
            }).catch(() => {
                set_notify({ type: "error", open: true, msg: "Something went wrong!" })
            })
        } else {
            set_notify({ type: "error", open: true, msg: "Something went wrong!" })
            props.setAskOpenPopup({
                open: false,
                btn1: true, btn2: false,
                head: "",
                info: ""
            })
        }
    }

    const handleSearch = e => {
        let value = e.target.value.toLowerCase();
        setDta(props.allCategories.filter(x => x.title.toLowerCase().includes(value)));
        if (value.length > 0) {
            setSearching(true);
        } else {
            setSearching(false);
        }
    }

    return (
        <>
            <TextField
                variant="filled"
                label="Search records"
                placeholder="You can search records by category name."
                onChange={handleSearch}
                fullWidth
            />
            <TblContainer>
                <TblHead />
                <TableBody>
                    {Object.values(props.allCategories) &&
                        searching ?
                        <>
                            {data.length ?
                                data.sort(getSortByTransactionDate).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, i) => {
                                    return (
                                        <StyledTableRow key={i} className="search-records-row">
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                {category.Image_URL !== "" ?
                                                    <CardMedia
                                                        className="media-img-table" image={category.Image_URL}
                                                    />
                                                    : <CardMedia
                                                        className="media-img-table"
                                                        image={defaultimg}
                                                    />}
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                <p>{category.title}</p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                <p><GtRecState no={category.status} /></p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                <p>
                                                    {category.description}
                                                </p>
                                            </TableCell>
                                            <TableCell align="left" className="actionCol">
                                                <EditBtn onClick={() => { props.setOpen(true); props.setSelRec(category.id) }} />
                                                <ViewBtn onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} />
                                                <DelBtn onClick={() => removeSelectedData(category.id)} />
                                            </TableCell>
                                            <td className="search-res-notify d-flex"><span>found</span><BsCheckAll /></td>
                                        </StyledTableRow>
                                    )
                                })
                                : <tr>
                                    <td colSpan={5}>
                                        <div className="no-record-found">
                                            <h4>No records found!</h4>
                                            <div className="no-record-img-wrap">
                                                <img src={noDataFoundImg} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            }

                        </>
                        :
                        <>
                            {
                                Object.values(props.allCategories).sort(getSortByTransactionDate).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, i) => {
                                    return (
                                        <StyledTableRow key={i}>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                {category.Image_URL !== "" ?
                                                    <CardMedia
                                                        className="media-img-table" image={category.Image_URL}
                                                    />
                                                    : <CardMedia
                                                        className="media-img-table"
                                                        image={defaultimg}
                                                    />}
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                <p>{category.title}</p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                <p><GtRecState no={category.status} /></p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} component="td" scope="row">
                                                <p>
                                                    {category.description}
                                                </p>
                                            </TableCell>
                                            <TableCell align="left" className="actionCol">
                                                <EditBtn onClick={() => { props.setOpen(true); props.setSelRec(category.id) }} />
                                                <ViewBtn onClick={() => { props.setViewDetails(true); props.setSelRec(category.id) }} />
                                                <DelBtn onClick={() => removeSelectedData(category.id)} />
                                            </TableCell>
                                        </StyledTableRow>
                                    )
                                })
                            }
                        </>
                    }


                </TableBody>
            </TblContainer>
        </>
    );
}

// Form for add new or update 
const NewForm = ({ setFullScreenLoader, selRec, setOpen, setAskOpenPopup }) => {
    const { state } = useAuthContext();
    const [errors, setErrors] = useState({});
    const [errorMsgs, setErrorMsgs] = useState({});
    const { set_notify } = useNotifyContext();
    const [newCategory, setNewCategory] = useState({
        status: 1,
        done_by: "",
        post_date: "",
        Image_URL: "",
        title: "",
        description: "",
        featured: true,
        tags: ['add tags']
    });
    const imgRef = useRef(null);
    useEffect(() => {
        if (selRec) {
            dbCategoryRef.child(selRec).get().then((data) => {
                if (data.exists()) {
                    setNewCategory({
                        ...data.val(),
                        tags: data.val().tags || ['add tags']
                    })
                } else {
                    set_notify({
                        open: true,
                        msg: "Something Went wrong!",
                        type: "error"
                    })
                }
            })
        } else {
            setNewCategory({
                status: 1,
                done_by: "",
                post_date: "",
                Image_URL: "",
                title: "",
                description: "",
                featured: true,
                tags: ["select tags"]
            })
        }
    }, [])

    const handleNewCategoryDetails = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        switch (name) {
            case "title":
                if (value.length > 250) {
                    setErrors({
                        ...errors,
                        [name]: true
                    })
                    setErrorMsgs({
                        ...errorMsgs,
                        [name]: "Length Exeeded! ( 250/250 )"
                    })
                } else {
                    setNewCategory({
                        ...newCategory,
                        [name]: value
                    });
                    setErrors({
                        ...errors,
                        [name]: false
                    })
                    setErrorMsgs({
                        ...errorMsgs,
                        [name]: ""
                    })
                } break;
            case "description":
                if (value.length > 5000) {
                    setErrors({
                        ...errors,
                        [name]: true
                    })
                    setErrorMsgs({
                        ...errorMsgs,
                        [name]: "Length Exeeded! ( 5000/5000 )"
                    })
                } else {
                    setNewCategory({
                        ...newCategory,
                        [name]: value
                    });
                    setErrors({
                        ...errors,
                        [name]: false
                    })
                    setErrorMsgs({
                        ...errorMsgs,
                        [name]: ""
                    })
                } break;
            case "featured":
                if (value === "true") {
                    setNewCategory({
                        ...newCategory,
                        featured: true
                    })
                } else {
                    setNewCategory({
                        ...newCategory,
                        featured: false
                    })
                }
                break;
            default:
        }
    }

    function selectImg(e) {
        let files = [];
        let reader;
        e.preventDefault();
        files = e.target.files;

        if (files.length > 0) {
            reader = new FileReader();
            reader.onload = function () {
                imgRef.current.src = reader.result;
            };
            reader.readAsDataURL(files[0]);
            setNewCategory({
                ...newCategory,
                Image_URL: files[0]
            });
        }
    }

    function removeImg() {
        imgRef.current.src = "";
        setNewCategory({
            ...newCategory,
            Image_URL: ''
        });
    }

    // check update or add new
    const addOredit = () => {
        if (newCategory.Image_URL && newCategory.title.trim()) {
            if (newCategory.title.length <= 250 && newCategory.description.length <= 5000) {
                setFullScreenLoader(true)
                if (selRec) {
                    updateCategory()
                } else {
                    addNewCategory()
                }
            } else {
                setAskOpenPopup({ open: true, btn1: true, btn2: false, head: "Alert!", info: "Length Exeeded" })
            }
        } else {
            setAskOpenPopup({ open: true, btn1: true, btn2: false, head: "Alert!", info: "Please fill the form correctly!" })
        }
    }
    // upload image on db
    function imageUploadToDB() {
        if (newCategory.Image_URL) {
            return new Promise((resolve, reject) => {
                if (newCategory.Image_URL.name) {
                    let task;
                    var storageRef = storage.ref("category-images/" + newCategory.Image_URL.name + generateString(10));
                    task = storageRef.put(newCategory.Image_URL);
                    task.on(
                        "state_changed",
                        function progress(snapshot) {
                            var percentage = Math.floor(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            );
                        }, //  function below for error handling
                        function (error) {
                            setFullScreenLoader(false)
                            setAskOpenPopup({ info: error.message, head: "Alert!", btn1: true, btn2: false, open: true });
                        },
                        function complete() {
                            //This function executes after a successful upload
                            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                resolve(downloadURL);
                                return downloadURL
                            });
                        }
                    );
                } else {
                    return resolve(newCategory.Image_URL)
                }
            });
        } else {
            setFullScreenLoader(false)
            setAskOpenPopup({ open: true, head: "Alert!", info: "Please fill the form", btn1: true, btn2: false })
        }
    }
    // Add new record
    function addNewCategory() {
        let newId = dbCategoryRef.push().key;
        imageUploadToDB()
            .then(function (url) {
                dbCategoryRef.child(newId).set({
                    id: newId,
                    title: newCategory.title,
                    description: newCategory.description,
                    Image_URL: url,
                    status: 1,
                    tags: newCategory.tags,
                    done_by: state.user.uid,
                    post_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                    last_update_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                    featured: newCategory.featured,
                }).then(() => {
                    setOpen(false)
                    setNewCategory({
                        status: 1,
                        done_by: "",
                        post_date: "",
                        Image_URL: "",
                        title: "",
                        description: "",
                        featured: false,
                        tags: ["select tags"]
                    })
                    set_notify({ open: true, type: "success", msg: "new category added successfully!" })
                    setFullScreenLoader(false)
                }).catch(function (error) {
                    setOpen(false);
                    setFullScreenLoader(false)
                    setAskOpenPopup({ open: true, head: "Alert!", info: error.message, btn1: true, btn2: false });
                })
            })
            .catch(function (error) {
                setOpen(false);
                setFullScreenLoader(false)
                setAskOpenPopup({ open: true, head: "Alert!", info: error.message, btn1: true, btn2: false });
            })
    };

    // update record
    function updateCategory() {
        let newId = selRec;
        imageUploadToDB()
            .then(function (url) {
                dbCategoryRef.child(newId).update({
                    title: newCategory.title,
                    description: newCategory.description,
                    Image_URL: url,
                    status: 2,
                    tags: newCategory.tags,
                    done_by: state.user.uid,
                    last_update_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                    featured: newCategory.featured,
                }).then(() => {
                    setNewCategory({
                        status: 1,
                        done_by: "",
                        post_date: "",
                        Image_URL: "",
                        title: "",
                        description: "",
                        featured: true,
                        tags: ["select tags"]
                    })
                    set_notify({ open: true, type: "success", msg: "Record Updated successfully!" })
                    setFullScreenLoader(false)
                    setOpen(false);
                }).catch(function (error) {
                    setOpen(false);
                    setFullScreenLoader(false)
                    setAskOpenPopup({ open: true, head: "Alert!", info: error.message, btn1: true, btn2: false });
                })
            })
            .catch(function (error) {
                setOpen(false);
                setFullScreenLoader(false)
                setAskOpenPopup({ open: true, head: "Alert!", info: error.message, btn1: true, btn2: false });
            })
    }

    // check input required
    const handleBlurChangenewCategory = (e) => {
        if (!e.target.value) {
            setErrors({
                ...errors,
                [e.target.name]: true
            })
        }
    }
    // handle tags
    const handleTags = (e, listOfTags) => {
        setNewCategory({
            ...newCategory,
            tags: listOfTags
        })
    }

    return (
        <>
            <Grid container spacing={3} className="p-3">
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        name="title"
                        label="Category name"
                        fullWidth
                        error={errors.title}
                        helperText={errors.title ? errorMsgs.title ? errorMsgs.title : 'required' : `(${newCategory.title ? newCategory.title.length : 0}/250)`}
                        value={newCategory.title}
                        onChange={(e) => handleNewCategoryDetails(e)}
                        onBlur={(e) => handleBlurChangenewCategory(e)}
                    />
                    <TextField
                        className="mt-2"
                        required
                        name="description"
                        label="Description"
                        fullWidth
                        error={errors.description}
                        helperText={errors.description ? errorMsgs.description : `(${newCategory.description ? newCategory.description.length : 0}/5000)`}
                        value={newCategory.description}
                        onChange={(e) => handleNewCategoryDetails(e)}
                    />
                    {/* tags */}
                    <div className="my-2">
                        <Autocomplete
                            multiple
                            id="tags-filled"
                            options={newCategory.tags.map((option) => option)}
                            value={newCategory.tags}
                            freeSolo
                            onChange={handleTags}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => {
                                    return (
                                        <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                                    )
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="Tags*"
                                    placeholder="Related tags"
                                />
                            )}
                        />
                        <p className="text-muted pt-2">Minimum 2 tags are required.</p>
                    </div>
                    {/* featured */}
                    <label className="mt-2" htmlFor="featured">Featured</label>
                    <Select
                        native
                        value={newCategory.featured}
                        onChange={(e) => handleNewCategoryDetails(e)}
                        fullWidth
                        inputProps={{ name: 'featured' }}
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </Select>
                    {/* img select */}
                    <div className="selectImg-wrapper mt-3 mr-2">
                        <input onChange={selectImg} id="imageUpload" type="file" accept="image/*" />
                        {newCategory.Image_URL ?
                            <>
                                <ClearIcon
                                    onClick={removeImg}
                                    className="remove-img-btn"
                                />
                                <label htmlFor="imageUpload">

                                    <img ref={imgRef} src={newCategory.Image_URL} alt="" />
                                </label>
                            </>
                            :
                            <>

                                <label htmlFor="imageUpload" className="img-picker">
                                    <svg
                                        width="36px"
                                        height="36px"
                                        viewBox="0 0 1024 1024"
                                        data-aut-id="icon"
                                        fill="var(--primary)"
                                    >
                                        <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
                                    </svg>
                                </label>
                            </>
                        }
                    </div>
                </Grid>
                <Grid item className="py-2">
                    <Button
                        style={{ marginTop: "10px", marginLeft: "7px" }}
                        variant="contained"
                        color="secondary"
                        onClick={addOredit}
                        disabled={newCategory.tags && newCategory.tags.length > 1 && newCategory.Image_URL && newCategory.title ? false : true} >
                        {selRec ? "Update" : "Add"}
                        &nbsp;
                        <DoneAllIcon />
                    </Button></Grid>
            </Grid>

        </>
    )
}

// view details in popup Dialog
const DetailData = (props) => {
    const { set_notify } = useNotifyContext();
    const [viewCategoryDetails, setViewDetails] = useState({
        done_by: "",
        Image_URL: "",
        status: 1,
        description: "",
        id: "",
        title: "",
        post_date: ""
    });
    useEffect(() => {
        let selctRc = props.selRec;
        if (selctRc) {
            dbCategoryRef.child(selctRc).get().then((data) => {
                if (data.exists()) {
                    setViewDetails(data.val())
                }
            })
        } else {
            props.setOpen(false)
            set_notify({
                open: true,
                msg: "Something Went wrong!",
                type: "error"
            })
        }

    }, [])
    return (
        <>
            <List>
                <ListItem>
                    <ListItemText
                        primary={viewCategoryDetails.title}
                        secondary="Category Name"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewCategoryDetails.description}
                        secondary="Description"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewCategoryDetails.done_by}
                        secondary="Done By"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewCategoryDetails.post_date}
                        secondary="Transaction Date"
                    />
                </ListItem>
                <Divider />
                <ListItem className="flex-wrap">
                    <h5 className="w-100 mb-2">Tags</h5>
                    <ListItemText
                        primary={
                            viewCategoryDetails.tags && viewCategoryDetails.tags.map((option, index) => {
                                return (
                                    <Chip className="my-2 mx-1" key={index} variant="outlined" label={option} />
                                )
                            })
                        }
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <img className="view-blog-db-img" src={viewCategoryDetails.Image_URL || defaultimg} alt="" />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={<GtRecState no={viewCategoryDetails.status} />}
                        secondary="Record State"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewCategoryDetails.id}
                        secondary="ID"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewCategoryDetails.featured ? "Yes" : "No"}
                        secondary="Featured"
                    />
                </ListItem>
            </List>
        </>
    )
}

export default ManageCategory
