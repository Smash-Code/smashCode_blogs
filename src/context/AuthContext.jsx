import { createContext, useEffect, useState, useContext } from 'react';
import firebase, { auth, db } from '../config/firebase'
import { Snackbar, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";


const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [state, setState] = useState({ isAuthenticated: false, loadedUser: false, user: {} });
    const [notify, set_notify] = useState({ open: false, msg: "", type: null })

    useEffect(() => {
        console.clear()
        auth.onAuthStateChanged((user) => {
            if (user) {
                // console.log("logged in",user);
                db.ref('users/' + user.uid).on('value', (userData) => {
                    if (userData.val()) {
                        setState({ isAuthenticated: true, loadedUser: true, user: userData.val() })
                    } else {
                        setState({ isAuthenticated: false, loadedUser: true, user: {} })
                    }
                })

            } else {
                // User is signed out.
                // console.log("not logged in",user)
                setState({ isAuthenticated: false, loadedUser: true, user: {} })
            }
        });
    }, []);

    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    let dbUserRef = db.ref('users');

    // console.log("=<<<<<<<<<<==",state.user)
    // FaceBook
    const facebookLogin = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithPopup(facebookProvider).then(function (result) {
                var user = result.user;
                dbUserRef.child(user.uid).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        // console.log("===>",user)
                        set_notify({ open: true, msg: "Login successfully.", type: "success" });
                        resolve("Success")
                    } else {
                        let create_user = {
                            user_name: user.displayName || "",
                            email: user.email || '',
                            profile: result.user?.photoURL || "",
                            uid: user.uid,
                            sign_Method: "Facebook",
                            emailVerified: user.emailVerified || false,
                        };
                        dbUserRef.child(user.uid).set(create_user).then(() => {
                            set_notify({ open: true, msg: "Login successfully.", type: "success" });
                            resolve("Success")
                        }).catch(function (error) {
                            set_notify({ open: true, msg: "Something went wrong.", type: "error" });
                            console.log(error.message);
                            reject("error")
                        })
                    }
                })
            }).catch(function (error) {
                if(error.code === 'auth/popup-closed-by-user'){
                    reject("error")
                    console.log(error);
                }else{
                    reject("error")
                    set_notify({ open: true, msg: error.msg || "something went wrong.", type: "error" });
                    console.log(error);
                }
               
            });
        })
    };
    // Google
    const googleLogin = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithPopup(googleProvider).then(function (result) {
                var user = result.user;
                dbUserRef.child(user.uid).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        set_notify({ open: true, msg: "Login successfully.", type: "success" });
                        resolve("Success")
                    } else {
                        let create_user = {
                            user_name: user.displayName || "",
                            email: user.email,
                            profile: result.user?.photoURL || "",
                            uid: user.uid,
                            sign_Method: "Google",
                            emailVerified: user.emailVerified || false,
                        };
                        dbUserRef.child(user.uid).set(create_user).then(() => {
                            set_notify({ open: true, msg: "Login successfully.", type: "success" });
                            resolve("Success")
                        }).catch(function (error) {
                            set_notify({ open: true, msg: "Something went wrong.", type: "error" });
                            reject("error")
                            console.log(error.message);
                        })
                    }
                })
            }).catch(function (error) {
                if(error.code === 'auth/cancelled-popup-request'){
                    reject("error")
                }
                set_notify({ open: true, msg: error.msg || "something went wrong.", type: "error" });
                console.log(error);
                reject("error")
            });
        })
    };
    // logout
    const logoutAccount = () => {
        firebase.auth().signOut().then(() => {
            set_notify({ open: true, msg: "Logout successfully.", type: "success" });
            setState({ isAuthenticated: false, loadedUser: true, user: {} })
        }).catch((err) => {
            set_notify({ open: true, msg: "Logout failed.", type: "error" });
            console.log(err);
        })
    }
    return (
        <AuthContext.Provider value={{ state, facebookLogin, googleLogin, logoutAccount }}>
            {children}
            <NotifyMsg notify={notify} set_notify={set_notify} />
        </AuthContext.Provider>
    )
}
export const useAuthContext = () => useContext(AuthContext);
export default AuthContextProvider;



const NotifyMsg = (props) => {

    const { notify, set_notify } = props;
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
