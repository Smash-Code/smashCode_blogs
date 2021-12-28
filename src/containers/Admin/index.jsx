import { useState, useEffect } from 'react';
import { useAuthContext } from "context/AuthContext"
import LoginModel from "components/loginModel/Login"
import { Button, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import Loader from "utils/Loader";
import Panel from "./Panel";
import { connect } from "react-redux";
import { get_All_Blogs, get_All_categories } from "store/action"
import SEO from "context/SEO";

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
            return <> <Panel />
                <SEO
                    description={'Smash-Code is one of the best software development company. Based on Pakistan.'}
                    // meta={''}
                    title={'Learn Programming & Online Earning ,Freelancing. ReadMore'}
                    pageUrl={window.location?.href}
                    image={'https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"'}
                />
            </>
        } else {
            return (
                <div className="notForadmin">
                    <SEO
                        description={'Smash-Code is one of the best software development company. Based on Pakistan.'}
                        // meta={''}
                        title={'Learn Programming & Online Earning ,Freelancing. ReadMore'}
                        pageUrl={window.location?.href}
                        image={'https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"'}
                    />
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
                <SEO
                    description={'Smash-Code is one of the best software development company. Based on Pakistan.'}
                    // meta={''}
                    title={'Learn Programming & Online Earning ,Freelancing. ReadMore'}
                    pageUrl={window.location?.href}
                    image={'https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"'}
                />
            </>
        } else {
            return (
                <div className="container">
                    <SEO
                        description={'Smash-Code is one of the best software development company. Based on Pakistan.'}
                        // meta={''}
                        title={'Learn Programming & Online Earning ,Freelancing. ReadMore'}
                        pageUrl={window.location?.href}
                        image={'https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"'}
                    />
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
