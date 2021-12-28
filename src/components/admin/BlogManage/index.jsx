import { useState, useEffect, useRef } from 'react';
import "./editor.css"
import { db, storage } from "config/firebase";
import Model from "utils/Model";
import ConfirmDialog from "utils/ConfirmDialog";
import Loader from "utils/Loader";
import { useNotifyContext } from "context/notifyContext";
import { useAuthContext } from "context/AuthContext";
import { MenuItem, IconButton, FormControl, AppBar, Toolbar, Typography, List, CircularProgress, Chip, InputLabel, Checkbox, ListItem, ListItemIcon, Select, ListItemText, Divider, Button, Grid, TextField, CardMedia, TableCell, TableBody } from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ClearIcon from "@material-ui/icons/Clear";
import Moment from "moment";
import { MenuProps, useStyles, } from "./style";
import { getSortByTransactionDate } from "store/action"
import { EditBtn, DelBtn, ViewBtn } from "utils/btns"
import UseTable from "../Tools/table/Tbl";
import GtRecState from "../Tools/tableAction/getRecordState";
import { BsCheckAll } from "react-icons/bs";
import noDataFoundImg from "assets/images/noDatafound.png"
import defaultimg from "assets/images/placeholder-img.jpg"
import { connect } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import CloseIcon from "@material-ui/icons/Close"


let dbBlogsRef = db.ref('blogs');


// Data Table setup
const HeadCells = [
    'Image',
    'Title',
    'Status',
    'Description',
    'Action'
]

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

const BlogManage = (props) => {
    // const [tab,setTab] = []
    const [blogsData, setBlogsData] = useState([]);
    const [openFormModel, setOpenFormModel] = useState(false);
    const [selected, setSelected] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [askModel, setAskModel] = useState({ open: false, btn1: true, btn2: false, head: "", info: "" });
    const [viewDetails, setViewBlogDetails] = useState(false);
    const [categoryList, setCategoriesList] = useState([]);

    useEffect(() => {
        function getAllBlogs() {
            dbBlogsRef.orderByChild("post_date").on('value', function (snapshot) {
                const data = snapshot.val();
                setDataLoaded(true);
                if (data) {
                    setBlogsData(Object.values(data).filter((val) => val));
                } else {
                    setBlogsData([]);
                }
            });
        };
        getAllBlogs();
        return () => getAllBlogs();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.allCategories) {
            let all_categories = Object.values(props.allCategories);
            setCategoriesList(all_categories)
        }
    }, [props.allCategories]);

    return (
        <>
            {/* loader */}
            {loading &&
                <Loader type="imgloader_fixed" />
            }
            {/* add / update Form */}
            <Model customToolBar={true} bigModel={true} model={openFormModel} setModel={setOpenFormModel}>
                <BlogForm categoryList={categoryList} selected={selected} loading={loading} setLoading={setLoading} setAskModel={setAskModel} setModel={setOpenFormModel} />
            </Model>
            {/* View  Details */}
            <Model model={viewDetails} setModel={setViewBlogDetails} title={'View Blog'}>
                <DetailData categoryList={categoryList} setOpen={setViewBlogDetails} selected={selected} />
            </Model>
            {/* Confirm Dialog */}
            <ConfirmDialog
                data={askModel}
                onClick={() => { setAskModel({ open: false, btn1: true, btn2: false, head: "", info: "" }); askModel.func && askModel.func() }}
                setAskModel={setAskModel}
            />

            <div className="d-flex mb-3 justify-content-end align-items-center">  
            <Button variant="contained" color="primary" onClick={() => { setOpenFormModel(true); setSelected(undefined); }}>Add New +</Button>
            </div>
            {blogsData?.length > 0 ?
                <RecordsTable
                    allBlogs={blogsData}
                    setLoader={setLoading}
                    setViewBlogDetails={setViewBlogDetails}
                    setAskOpenPopup={setAskModel}
                    setSelected={setSelected}
                    setOpen={setOpenFormModel}
                />
                :
                <div className="p-5 text-center">
                    {dataLoaded ? <p>No Blogs data are found.</p>
                        : <Loader type="imgloader" />}
                </div>
            }
        </>
    )
};

// Add/Update Form
const BlogForm = ({ selected, categoryList, loading, setModel, setLoading, setAskModel }) => {
    const classes = useStyles();
    const { set_notify } = useNotifyContext();
    const { state } = useAuthContext();
    const [errors, setErrors] = useState({});
    const [errorMsgs, setErrorMsgs] = useState({});
    const [tagSelected, setSelectedTag] = useState([]);
    const [options, setOptions] = useState([]);
    const imgRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        id: '',
        blog_img: '',
        category: {
            title: '',
            id: "",
        },
        tags: [],
        featured: false,
        // topBlog: false,
        post_date: '',
        done_by: '',
        status: 1,
        views: null
    });

    useEffect(() => {
        if (selected) {
            dbBlogsRef.child(selected).get().then((data) => {
                let content = data.val()
                if (data.exists()) {
                    setFormData(content)
                    setSelectedTag(content.tags || [''])
                    if (content.body) {
                        let bodyData = JSON.parse(content.body);
                        setEditorState(EditorState.createWithContent(convertFromRaw(bodyData)));
                    } else {
                        setEditorState(EditorState.createEmpty());
                    }
                } else {
                    setEditorState(EditorState.createEmpty());
                }
            })
        } else {
            setEditorState(EditorState.createEmpty());
            setFormData({
                title: "",
                id: '',
                blog_img: '',
                category: {
                    title: '',
                    id: "",
                },
                tags: [],
                featured: false,
                // topBlog: false,
                post_date: '',
                done_by: '',
                status: 1,
                views: null,
            });
            setSelectedTag([''])
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleNewCategoryDetails = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        switch (name) {
            case "title":
                if (value.length > 700) {
                    setErrors({
                        ...errors,
                        [name]: true
                    })
                    setErrorMsgs({
                        ...errorMsgs,
                        [name]: "Length Exeeded! ( 700/700 )"
                    })
                } else {
                    setFormData({
                        ...formData,
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
                }
                break;
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
                    setFormData({
                        ...formData,
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
                }
                break;
            // case "topBlog":
            case "featured":
                if (value === "true") {
                    setFormData({
                        ...formData,
                        [name]: true
                    })
                } else {
                    setFormData({
                        ...formData,
                        [name]: false
                    })
                }
                break;
            case 'category':
                let his_category = categoryList?.filter((item) => item.id === value);
                setFormData({
                    ...formData,
                    'category': {
                        title: his_category[0].title,
                        id: his_category[0].id,
                    }
                })
                break;
            case 'views':
                setFormData({
                    ...formData,
                    'views': value
                })
                break;
            default:
        }
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
            setFormData({
                ...formData,
                blog_img: files[0]
            });
        }

    }

    function removeImg() {
        imgRef.current.src = '';
        setFormData({
            ...formData,
            blog_img: ''
        });
    }

    // check update or add new
    const addOrEdit = () => {
        if (formData.blog_img && formData.title.trim()) {

            setLoading(true);
            if (selected) {
                updateData()
            } else {
                addNewData()
            }

        } else {
            setAskModel({ open: true, btn1: true, btn2: false, head: "Alert!", info: "Please fill the form correctly!" })
        }
    }

    // upload image on db
    function imageUploadToDB() {
        return new Promise((resolve, reject) => {
            if (formData.blog_img) {
                if (formData.blog_img.name) {
                    let task;
                    var storageRef = storage.ref("blogs-images/" + formData.blog_img.name + generateString(10));
                    task = storageRef.put(formData.blog_img);
                    task.on(
                        "state_changed",
                        function progress(snapshot) {
                            // var percentage = Math.floor(
                            //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            // );
                        }, //  function below for error handling
                        function (error) {
                            setLoading(false)
                            setAskModel({ info: error.message, head: "Alert!", btn1: true, btn2: false, open: true });
                        },
                        function complete() {
                            //This function executes after a successful upload
                            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                resolve(downloadURL);
                                setLoading(false)
                                return downloadURL
                            });
                        }
                    );
                } else {
                    return resolve(formData.blog_img)
                }
            }
            else {
                setAskModel({ open: true, head: "Alert!", info: "Please upload image for blog post.", btn1: true, btn2: false })
                return reject()
            }
        });

    }

    const addNewData = () => {
        imageUploadToDB().then((url) => {
            let id = dbBlogsRef.push().key;
            const contentState = editorState.getCurrentContent();
            dbBlogsRef.child(id).set({
                ...formData,
                tags: tagSelected,
                blog_img: url,
                starCount: 0,
                id: id,
                post_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                last_update_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                done_by: {
                    user_name: state.user.user_name,
                    uid: state.user.uid
                },
                status: 1,
                body: JSON.stringify(convertToRaw(contentState))
            }).then(() => {
                setLoading(false);
                set_notify({ open: true, msg: "Blog Posted Successfully.", type: "success" })
                setFormData({
                    title: "",
                    id: '',
                    blog_img: '',
                    category: {
                        title: '',
                        id: "",
                    },
                    tags: [],
                    featured: false,
                    // topBlog: false,
                    post_date: '',
                    done_by: '',
                    status: 1,
                    views: null
                });
                setEditorState(EditorState.createEmpty());
                setSelectedTag([''])
                setModel(false)
            }).catch((error) => {
                setLoading(false);
                set_notify({ open: true, msg: error.message, type: "error" })
            })
        }).catch((error) => {
            setLoading(false);
            set_notify({ open: true, msg: error.message, type: "error" })
        })
    }

    const updateData = () => {
        imageUploadToDB().then((url) => {
            const contentState = editorState.getCurrentContent();
            dbBlogsRef.child(selected).update({
                ...formData,
                blog_img: url,
                tags: tagSelected,
                last_update_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                done_by: {
                    user_name: state.user.user_name,
                    uid: state.user.uid
                },
                status: 2,
                body: JSON.stringify(convertToRaw(contentState))
            }).then(() => {
                setLoading(false);
                set_notify({ open: true, msg: "Blog updated Successfully.", type: "success" })
                setFormData({
                    title: "",
                    id: '',
                    blog_img: '',
                    category: {
                        title: '',
                        id: "",
                    },
                    tags: [],
                    featured: true,
                    // topBlog: false,
                    post_date: '',
                    done_by: '',
                    status: 1,
                    views: null
                });
                setSelectedTag([''])
                setModel(false)
            }).catch((error) => {
                setLoading(false);
                set_notify({ open: true, msg: error.message, type: "error" })
            })
        }).catch((error) => {
            setLoading(false);
            set_notify({ open: true, msg: error.message, type: "error" })
        })
    }

    const getRelatedOption = () => {
        return categoryList.findIndex(item => item.id === formData.category?.id || 0)
    }

    useEffect(() => {
        setSelectedTag([]);
        if (categoryList && categoryList.length > 0) {
            let getOptions = categoryList[getRelatedOption() >= 0 ? getRelatedOption() : 0]?.tags
            setOptions(getOptions);
        }
    }, [formData.category, categoryList]) // eslint-disable-line react-hooks/exhaustive-deps

    // tags
    const isAllSelected = options?.length > 0 && tagSelected?.length === options?.length;
    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelectedTag(tagSelected?.length === options?.length ? [] : options);
            return;
        }
        setSelectedTag(value);
    };

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);

    const handleEditorChange = (dat) => {
        setEditorState(dat)
    }

    // arrange values with commas
    function numberWithCommas(x) {
        return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function uploadImageCallBack(file) {
        let reader;
        return new Promise(
            (resolve, reject) => {
                if (file) {
                    // console.log("resolve", file)
                    reader = new FileReader();
                    reader.onload = function () {
                        resolve({ data: { link: reader.result } })
                    };
                    reader.readAsDataURL(file);
                } else {
                    console.log("reject", file)
                    reject()
                }
            }
        );
    }
    return (
        <>
            <AppBar position="sticky">
                <Toolbar className="blog-model-toolbar">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setModel(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className="flex-grow-1">
                        {selected ? "Update Blog" : "Add New"}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="inherit"
                        edge="end"
                        className="ml-auto"
                        onClick={addOrEdit}
                        disabled={formData.blog_img
                            && formData.description &&
                            formData.description.trim() &&
                            formData.title.trim() &&
                            formData.title ?
                            loading :
                            true} >
                        {selected ? "Update" : "Publish"}
                        &nbsp;
                        {loading ? <CircularProgress /> : <DoneAllIcon />}
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={3} className="p-3">
                <Grid item xs={12} sm={12}>
                    <TextField
                        variant="filled"
                        required
                        name="title"
                        label="Title"
                        fullWidth
                        multiline
                        maxRows={6}
                        error={errors.title}
                        helperText={errors.title ? errorMsgs.title ? errorMsgs.title : 'required' : `(${formData.title ? formData.title.length : 0}/700)`}
                        value={formData.title}
                        onChange={(e) => handleNewCategoryDetails(e)}
                        onBlur={(e) => handleBlurChangenewCategory(e)}
                    />
                    <div className="my-3">
                        <label htmlFor="">Description*</label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={handleEditorChange}
                            toolbarClassName="toolbar-class"
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class"
                            toolbar={{
                                // inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                image: {
                                    uploadCallback: uploadImageCallBack,
                                    alt: { present: true, mandatory: false },
                                    previewImage: true,
                                    inputAccept: 'image/*',
                                },
                            }}
                        />
                    </div>
                    <TextField
                        variant="filled"
                        className="mt-2"
                        required
                        multiline
                        rows={7}
                        name="description"
                        label="Description"
                        fullWidth
                        error={errors.description}
                        helperText={errors.description ? errorMsgs.description ? errorMsgs.description : 'required' : `(${formData.description ? formData.description.length : 0}/5000)`}
                        value={formData.description}
                        onChange={(e) => handleNewCategoryDetails(e)}
                        onBlur={(e) => handleBlurChangenewCategory(e)}
                    />
                    <label className="mt-3" htmlFor="featured">Category</label>
                    <Select
                        variant="filled"
                        native
                        onChange={(e) => handleNewCategoryDetails(e)}
                        fullWidth
                        defaultValue={formData?.category?.title}
                        inputProps={{ name: 'category' }}
                    >
                        {categoryList.map((item, i) => {
                            return (
                                <option key={i} value={item.id}>{item.title}</option>
                            )
                        })}
                    </Select>
                    {/* tags */}
                    <FormControl className={classes.formControl} >
                        <InputLabel id="mutiple-select-label">Select related Tags</InputLabel>
                        <Select
                            labelId="mutiple-select-label"
                            multiple
                            value={tagSelected}
                            onChange={handleChange}
                            renderValue={(tagSelected) => tagSelected.join(", ")}
                            MenuProps={MenuProps}
                        >
                            <MenuItem
                                value="all"
                                classes={{
                                    root: isAllSelected ? classes.selectedAll : ""
                                }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        classes={{ indeterminate: classes.indeterminateColor }}
                                        checked={isAllSelected}
                                        indeterminate={
                                            tagSelected.length > 0 && tagSelected.length < options.length
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.selectAllText }}
                                    primary="Select All"
                                />
                            </MenuItem>
                            {options?.map((option) => (
                                <MenuItem key={option} value={option}>
                                    <ListItemIcon>
                                        <Checkbox checked={tagSelected.indexOf(option) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={option} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <label className="mt-3" htmlFor="featured">Featured</label>
                    <Select
                        variant="filled"
                        native
                        value={formData.featured}
                        onChange={(e) => handleNewCategoryDetails(e)}
                        fullWidth
                        inputProps={{ name: 'featured' }}
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </Select>
                    {/* <label className="mt-2" htmlFor="topBlog">Top Rated</label>
                <Select
                    variant="filled"
                    native
                    value={formData.topBlog}
                    onChange={(e) => handleNewCategoryDetails(e)}
                    fullWidth
                    inputProps={{ name: 'topBlog' }}
                >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </Select> */}
                    {/* img select */}
                    <label className="mt-2" htmlFor="views">Views</label>
                    <TextField
                        variant="filled"
                        className="mt-2"
                        name="views"
                        label="Views"
                        type="text"
                        fullWidth
                        value={numberWithCommas(formData.views)}
                        onChange={(e) => handleNewCategoryDetails(e)}
                    />

                    <label htmlFor="imageUpload" className="selectImg-wrapper img-select-btn-full mt-3 mr-2">
                        <input onChange={selectImg} id="imageUpload" type="file" accept="image/*" />
                        {formData.blog_img ?
                            <>

                                <label htmlFor="imageUpload">
                                    <img ref={imgRef} src={formData.blog_img} alt="" />
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
                    </label>

                    {formData.blog_img &&
                        <Button variant="contained" color="primary" endIcon={
                            <ClearIcon />
                        }
                            onClick={removeImg}
                        >
                            Remove Image
                        </Button>
                    }
                </Grid>
                <Grid item xs={12} sm={12} className="mt-2">

                    {/* <div className="container">
                <textarea
                    rows="10"
                    className="w-100"
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            </div> */}
                    {/* <button onClick={savToDB}>SAVE</button>
            <button onClick={getData}>GET</button> */}
                </Grid>
                {/* <Grid item xs={12} sm={12} className="mt-2">
                    <Button variant="contained" color="secondary"
                        onClick={addOrEdit}
                        disabled={formData.blog_img && formData.title  ?
                            loading :
                            true} >
                        {selected ? "Update" : "Add"}
                        &nbsp;
                        {loading ? <CircularProgress /> : <DoneAllIcon />}
                    </Button>
                </Grid> */}
            </Grid>
        </>
    )
}

// records Table
const RecordsTable = (props) => {
    const { set_notify } = useNotifyContext();
    const [data, setDta] = useState([]);
    const [searching, setSearching] = useState(false);
    const { TblContainer, TblHead, StyledTableRow, rowsPerPage, page } = UseTable(searching ? data : props.allBlogs, HeadCells); function removeSelectedData(nam) {
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
            dbBlogsRef.child(nam).remove().then(() => {
                set_notify({ type: "error", open: true, msg: "Record deleted successfully" })
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
        setDta(props.allBlogs.filter(x => x.title.toLowerCase().includes(value)));
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
                placeholder="You can search records by Blog title."
                onChange={handleSearch}
                fullWidth
            />
            <TblContainer>
                <TblHead />
                <TableBody>
                    {Object.values(props.allBlogs) &&
                        searching ?
                        <>
                            {data.length ?
                                data.sort(getSortByTransactionDate).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog_item, i) => {
                                    return (
                                        <StyledTableRow key={i} className="search-records-row">
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                {blog_item.blog_img ?
                                                    <CardMedia
                                                        className="media-img-table"
                                                        image={blog_item.blog_img}
                                                    />
                                                    : <CardMedia
                                                        className="media-img-table"
                                                        image={defaultimg}
                                                    />}
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                <p>{blog_item.title}</p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                <p><GtRecState no={blog_item.status || 0} /></p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                <p>
                                                    {blog_item.description}
                                                </p>
                                            </TableCell>
                                            <TableCell align="left" className="d-flex justify-content-center align-items-center align-content-center">
                                                <EditBtn onClick={() => { props.setOpen(true); props.setSelected(blog_item.id) }} />
                                                <ViewBtn onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} />
                                                <DelBtn onClick={() => removeSelectedData(blog_item.id)} />

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
                                                <img src={noDataFoundImg} alt="no data found" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            }

                        </>
                        :
                        <>
                            {
                                Object.values(props.allBlogs).sort(getSortByTransactionDate).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog_item, i) => {
                                    return (
                                        <StyledTableRow key={i}>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                {blog_item.blog_img !== "" ?
                                                    <CardMedia
                                                        className="media-img-table" image={blog_item.blog_img}
                                                    />
                                                    : <CardMedia
                                                        className="media-img-table"
                                                        image={defaultimg}
                                                    />}
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                <p>{blog_item.title}</p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                <p><GtRecState no={blog_item.status || 0} /></p>
                                            </TableCell>
                                            <TableCell onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} component="td" scope="row">
                                                <p>
                                                    {blog_item.description}
                                                </p>
                                            </TableCell>
                                            <TableCell align="left" className="d-flex justify-content-center align-items-center align-content-center h-100">
                                                <EditBtn onClick={() => { props.setOpen(true); props.setSelected(blog_item.id) }} />
                                                <ViewBtn onClick={() => { props.setViewBlogDetails(true); props.setSelected(blog_item.id) }} />
                                                <DelBtn onClick={() => removeSelectedData(blog_item.id)} />
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
    )
}

// view details in popup Dialog
const DetailData = (props) => {
    const { set_notify } = useNotifyContext();
    const [viewBlogDetails, setViewBlogDetails] = useState({
        title: "",
        id: '',
        blog_img: '',
        category: {
            title: '',
            id: "",
        },
        tags: [],
        featured: false,
        // topBlog: false,
        post_date: '',
        done_by: '',
        status: '',
    });
    useEffect(() => {
        let selctRc = props.selected;
        if (selctRc) {
            dbBlogsRef.child(selctRc).get().then((data) => {
                if (data.exists()) {
                    setViewBlogDetails(data.val())
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

    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <List>
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.title}
                        secondary="Name"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <img className="img-fluid view-blog-db-img" src={viewBlogDetails.blog_img || defaultimg} alt="" />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.category?.title}
                        secondary="Category"
                    />
                </ListItem>
                <Divider />
                <ListItem className="flex-wrap">
                    <h6 className="w-100 mb-2">Related Tags</h6>
                    <ListItemText
                        primary={
                            viewBlogDetails.tags && viewBlogDetails.tags.map((option, index) => {
                                return (
                                    <Chip className="my-2 mx-1" key={index} variant="outlined" label={option} />
                                )
                            })
                        }
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.description}
                        secondary="Short description"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails?.done_by?.user_name}
                        secondary="Done By"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.post_date}
                        secondary="Post Date"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.last_update_date}
                        secondary="Last Updated on"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={
                            <GtRecState no={viewBlogDetails.status || 0} />
                        }
                        secondary="Status"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.id}
                        secondary="ID"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.featured ? "Yes" : "No"}
                        secondary="Featured"
                    />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText
                        primary={viewBlogDetails.topBlog ? "Yes" : "No"}
                        secondary="In Top Blog"
                    />
                </ListItem>
            </List>
        </>
    )
}

const mapStateToProps = (store) => ({
    allCategories: store.allCategories,
    allBlogs: store.allBlogs,
});

export default connect(mapStateToProps, null)(BlogManage);