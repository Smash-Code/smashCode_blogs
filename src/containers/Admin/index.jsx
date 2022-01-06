import { useState, useEffect } from 'react';
import { useAuthContext } from "context/AuthContext"
import LoginModel from "components/loginModel/Login"
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Loader from "utils/Loader";
import Panel from "./Panel";
import { connect } from "react-redux";
import { get_All_Blogs, get_All_categories } from "store/action"

const AdminPanel = (props) => {
    const { state } = useAuthContext();
    const [loginModel, setLoginModel] = useState();
    const closeLoginModel = () => {
        setLoginModel(false)
    };
    useEffect(() => {
        props.get_All_Blogs();
        props.get_All_categories();
    }, []);

    if (state.isAuthenticated && state.loadedUser) {
        if (state.user.admin === true) {
            return <> 
            <Panel />
            </>
        } else {
            return (
                <div className="notForadmin">
                    <div id="clouds">
                        <div className="cloud x1"></div>
                        <div className="cloud x1_5"></div>
                        <div className="cloud x2"></div>
                        <div className="cloud x3"></div>
                        <div className="cloud x4"></div>
                        <div className="cloud x5"></div>
                    </div>
                    <div className='c'>
                        <div className='_404'>505</div>
                        <hr className="myhr" />
                        <div className='_1'>THIS PAGE</div>
                        <div className='_2'>Is Only For Admin</div>
                        <br />
                        &nbsp;<Button variant="contained" color="primary" onClick={() => props.history.push('/Home')}>Go Back</Button>
                    </div>
                </div>
            )
        }
    } else {
        if (state.loadedUser === false) {
            return <> <Loader type="imgloader_fixed" />
            </>
        } else {
            return (
                <div className="container">
                    <div className="row my-5 py-5">
                        <div className="col-md-5 col-12 mx-auto d-flex flex-wrap justify-content-center align-items-center">
                            <Button className="my-2 mx-2 d-inline" variant="contained" color="primary" onClick={() => setLoginModel(true)}>Login </Button>
                            <Button component={Link} to="/" className="my-2 mx-2 d-inline" variant="contained" color="secondary" onClick={() => setLoginModel(true)}>Go to Web </Button>
                            <LoginModel open={loginModel} onClose={closeLoginModel} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}


const mapDispatchToProps = (dispatch) => ({
    get_All_Blogs: () => dispatch(get_All_Blogs()),
    get_All_categories: () => dispatch(get_All_categories()),
});

export default connect(null, mapDispatchToProps)(AdminPanel);
