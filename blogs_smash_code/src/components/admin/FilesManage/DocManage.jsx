import { useState } from 'react'
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { CloudUpload, Clear, NoteAdd, CardMembership, InsertDriveFile } from "@material-ui/icons";
import { storage, db } from "config/firebase";
import { useNotifyContext } from "context/notifyContext";
import { useAuthContext } from "context/AuthContext";
import Moment from "moment";

const VideoManage = ({ data }) => {
    const { set_notify } = useNotifyContext();
    const { state } = useAuthContext();
    const [formData, setFormData] = useState({});
    const [progress, setProgress] = useState(0);
    const [fullScreenLoader, setFullScreenLoader] = useState(false);
    const [fileData, setFileData] = useState({name: "", size: ""});

    function bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]})`
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
      }

    function selectImg(e) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        input.onchange = (e) => {
            let files = [];
            files = e.target.files;
            if (files.length > 0) {
                setFormData({
                    ...formData,
                    file: files[0]
                });
                setFileData({
                    name: files[0]?.name,
                    size: bytesToSize(files[0].size || 0),
                });
            }
        };
        input.click();
    };

    function removeImg() {
        setFormData({
            file: ''
        });
        setFileData({name: "", size: ""})
    };

    // upload image
    function imageUploadToDB(id) {
        if (formData.file) {
            return new Promise((resolve, reject) => {
                if (formData.file.name) {
                    let task;
                    var storageRef = storage.ref("uploads/docs/" + formData.file.name + id);
                    task = storageRef.put(formData.file);
                    task.on(
                        "state_changed",
                        function progress(snapshot) {
                            var percentage = Math.floor(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            );
                            setProgress(percentage);
                        }, //  function below for error handling
                        function (error) {
                            setFullScreenLoader(false);
                            setProgress(0);
                            set_notify({ msg: error.message, open: true, type: "error" });
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
                    return resolve(formData.file)
                }
            });
        } else {
            setFullScreenLoader(false)
            set_notify({ open: true, msg: "Please upload your File.", type: "info" })
        }
    }

    const PostNewMedia = () => {
        setFullScreenLoader(true);
        setProgress(6);
        let key = db.ref('uploads/docs').push().key;
        imageUploadToDB(key).then((res) => {
            db.ref('uploads/docs').child(key).set({
                url: res,
                done_by: state.user.uid,
                post_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                fileName: fileData.name,
                fileSize: fileData.size,
            }).then(() => {
                set_notify({ open: true, msg: "File uploaded successfully.", type: "success" });
                setFormData({});
                setProgress(0)
                setFullScreenLoader(false);
                setFileData({name: "", size: ""})
            }).catch((error) => {
                setProgress(0)
                set_notify({ open: true, msg: error.message, type: "error" });
                console.log(error);
                setFullScreenLoader(false);
            })
        }).catch((error) => {
            setProgress(0)
            set_notify({ open: true, msg: error.message, type: "error" });
            console.log(error);
            setFullScreenLoader(false);
        })
    };

    const copyURL = (text) => {
        navigator.clipboard.writeText(text);
        set_notify({open: true, msg: "URL copied successfully", type: "success"})
    }
    return (
        <>
            <div className="w-100">
                <div className="d-flex justify-content-end align-items-center">
                    {fullScreenLoader &&
                        <>
                            Loading &nbsp;
                            <div className="cs_progress_wrapper">
                                <div className="cs_progress" style={{ width: progress + "%" }}></div>
                            </div>
                        </>}
                    <Button
                        className="float-right"
                        disabled={formData && formData.file && !fullScreenLoader ? false : true}
                        onClick={PostNewMedia}
                        variant="contained" color="primary">
                        Upload &nbsp;
                        {fullScreenLoader ? <CircularProgress color="inherit" size={20} /> : <CloudUpload />}
                    </Button>
                </div>

                <div className="media-upload-wrapper position-relative">
                    <div onClick={selectImg} className="selectImg-wrapper img-select-btn-full mt-3 mr-2">
                        {formData.file ?
                            <>
                                <div className="no-preview-available text-center">
                                    <h5><InsertDriveFile/> No preview available </h5>
                                    <span className="text-muted">size: {fileData?.size}</span><br/>
                                    <span className="text-muted">name: {fileData?.name}</span>
                                </div>
                            </>
                            :
                            <>
                                <div className="img-picker">
                                    <svg
                                        width="36px"
                                        height="36px"
                                        viewBox="0 0 1024 1024"
                                        data-aut-id="icon"
                                        fill="var(--primary)"
                                    >
                                        <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
                                    </svg>
                                    <span>Upload a File</span>
                                </div>
                            </>
                        }

                    </div>
                    {formData.file && <Clear className="remove-img-btn" onClick={removeImg} />}
                </div>
                <div className="image-flexbox border-top py-3">
                    <div className="w-100 pb-3 d-flex justify-content-between align-items-center">
                        <Typography variant="h5" >Uploads <NoteAdd className="mb-1" /></Typography>
                        {data && data.length > 0 &&
                        <Typography variant="subtitle2" >Total: {data.length < 10 ? "0" + data.length : data.length}</Typography>}
                    </div>
                    {data && data.length > 0 ?
                        data.map((item, index) => {
                            return (
                                <div whileHover={{ opacity: 1 }} key={index} className="doc-card">
                                   <h3>
                                       <InsertDriveFile style={{fontSize:"68px"}}/>
                                    </h3>
                                    <span className="w-100 text-muted">Name: {item?.fileName}</span>
                                    <span className="w-100 mt-1 text-muted">Size: {item?.fileSize}</span>
                                    <span className="w-100 mt-3 text-muted">Uploaded date: {item?.post_date?.slice(0,11)}</span>
                                    <Button variant="contained" color="primary" onClick={()=> copyURL(item.url)} className="w-100 mt-3" >Copy URL</Button>
                                    {/* <a href={item?.url} download target="_blank" className="w-100 mt-3 text-pr">View & Download</a> */}
                                </div>
                            )

                        })

                        :
                        <div className="w-100 py-5 text-center">
                            <Typography variant="h3" >No Uploads yet.<CardMembership className="mb-1" /></Typography>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default VideoManage
