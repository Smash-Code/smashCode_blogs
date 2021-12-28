import LoginButton from "utils/LoginButtons";
import CustomModel from "utils/Model";
import {useAuthContext} from 'context/AuthContext';

const PublicLoginModel = (props) => {
    const {loginModel, setLoginModel} = props;
    const { facebookLogin, googleLogin } = useAuthContext();
    
    // facebook login
    const facebookLogin_pop = () => {
        facebookLogin().then(() => {
            setLoginModel(false);
        });
    };
    // google login
    const googleLogin_pop = async () => {
        googleLogin().then(() => {
            setLoginModel(false);
        });
    };

    return (
        <>
            <CustomModel
                title="Login"
                model={loginModel}
                setModel={setLoginModel}
            >
                <div className="px-3 py-4">
                    <LoginButton facebookLogin={facebookLogin_pop}
                        googleLogin={googleLogin_pop} />
                </div>
            </CustomModel>
        </>
    )
}

export default PublicLoginModel
