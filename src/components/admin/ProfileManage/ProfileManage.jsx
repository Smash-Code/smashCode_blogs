import { useState, useRef } from 'react'
import { useNotifyContext } from "context/notifyContext"
import { Paper, Typography, Button, CircularProgress } from "@material-ui/core";
import { db, storage } from "config/firebase"
import { useAuthContext } from "context/AuthContext";
import { TextField } from "@material-ui/core"
import ClearIcon from "@material-ui/icons/Clear";
import defaultimg from "assets/images/placeholder-img.jpg";

let dbUsersRef = db.ref('users');

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
const ProfileManage = (props) => {
    const { set_notify } = useNotifyContext();
    const { state } = useAuthContext();
    const [formLoading, setFormLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(state.user || {});
    const imgRef = useRef(null);

    // select institute logo image
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
            setUserDetails({
                ...userDetails,
                profile: files[0]
            });
        }

    }

    // handle form details on inputs change
    const handleFormDetails = (e) => {
        let { value, name } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    // reset form details
    const resetForm = () => {
        setUserDetails(state.user || {});
    };


    // upload image on db
    function imageUploadToDB() {
        return new Promise((resolve, reject) => {
            if (userDetails.profile) {
                if (userDetails.profile.name) {
                    let task;
                    var storageRef = storage.ref("user-images/" + userDetails.profile.name + generateString(10));
                    task = storageRef.put(userDetails.profile);
                    task.on(
                        "state_changed",
                        function progress(snapshot) {
                            // var percentage = Math.floor(
                            //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            // );
                        }, //  function below for error handling
                        function (error) {
                            setFormLoading(false)
                            set_notify({ msg: error.message, open: true, type: "success" });
                        },
                        function complete() {
                            //This function executes after a successful upload
                            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                resolve(downloadURL);
                                setFormLoading(false)
                                return downloadURL
                            });
                        }
                    );
                } else {
                    return resolve(userDetails.profile)
                }
            }
            else {
                set_notify({ open: true, msg: "Profile Image not selected", type: "error" })
                return reject()
            }
        });

    }

    // Save details
    const saveProfile = (e) => {
        e.preventDefault();
        let id = state.user?.uid;
        if (id) {
            setFormLoading(true);
            imageUploadToDB().then((profileImg) => {
                let pImg = profileImg;
                dbUsersRef.child(id).update({
                    ...userDetails,
                    profile: pImg,
                }).then(() => {
                    set_notify({ open: true, msg: "Changes saved successfully", type: "success" })
                    setFormLoading(false);
                }).catch(() => {
                    set_notify({ open: true, msg: "some thing went wrong! plz make sure your internet connection is connected.", type: "error" })
                    setFormLoading(false);
                });
            }).catch(() => {
                set_notify({ open: true, msg: "Profile image uploading failed", type: "error" })
                setFormLoading(false);
            });
        } else {
            set_notify({ open: true, msg: "User id not found! plz make sure your internet connection is connected.", type: "error" })
        }
    };

    function removeImg() {
        imgRef.current.src = '';
        setUserDetails({
            ...userDetails,
            profile: ''
        });
    }

    return (
        <div className="container">
            <div className="row">
                <Paper style={{ pointerEvents: formLoading && "none", opacity: formLoading && ".7" }} className="mt-3 pb-4 pt-3 col-md-10 col-12 mx-auto">
                    <Typography variant="h5" className="pt-3 mb-5">Edit Profile</Typography>
                    <form onSubmit={saveProfile} className="w-100">
                        <div className="row px-3">
                            <div className='col-12 text-center'>
                                <div className="mb-3 d-flex justify-content-center pb-3">
                                    <div className="selectImg-wrapper">
                                        <input onChange={selectImg} id="imageUpload" type="file" accept="image/*" />
                                        {userDetails.profile ?
                                            <>
                                                <ClearIcon
                                                    onClick={removeImg}
                                                    className="remove-img-btn"
                                                />
                                                <label htmlFor="imageUpload">

                                                    <img ref={imgRef} src={userDetails.profile || defaultimg} alt="" />
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
                                </div>
                            </div>
                            <div className="col-md-6 col-12 my-2">
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    label="User name"
                                    onChange={handleFormDetails}
                                    value={userDetails.user_name}
                                    name="user_name"
                                    type="text" />
                            </div>
                            <div className="col-md-6 col-12 my-2">
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    label="Email"
                                    value={userDetails.email}
                                    name="email"
                                    readOnly
                                    type="email" />
                            </div>
                            <div className="col-12 my-2">
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    label="About"
                                    multiline
                                    rows={7}
                                    onChange={handleFormDetails}
                                    value={userDetails.about}
                                    name="about"
                                    type="text" />
                            </div>
                            <div className="col-12"><hr /></div>
                            <div className="col-12 d-flex flex-wrap justify-content-between">
                                <Button onClick={resetForm} variant="contained" color="primary">
                                    Reset
                                </Button>
                                {formLoading ?
                                    <Button disabled variant="contained" color="secondary">
                                        <CircularProgress size={38}/>
                                        &nbsp; Loading...
                                    </Button>
                                    :
                                    userDetails.user_name ?
                                        <Button type="submit" variant="contained" color="secondary" className="float-right">
                                            Save changes
                                        </Button>
                                        :
                                        <Button disabled variant="contained" color="secondary" className="float-right">
                                            Save changes
                                        </Button>
                                }


                            </div>
                        </div>
                    </form>
                </Paper>
            </div>
        </div>
    )
}



export default ProfileManage;