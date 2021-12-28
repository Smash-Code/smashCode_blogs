import {HammerLogo} from "./Logo"
const Loader = (props) => {
    if (props.type === "spinner") {
        return (
            <div style={{margin: "0 auto"}}>
                <div className="spinner"></div>
            </div>
        )
    }
    if(props.type === "imgloader"){
        return (
        <div className="position-relative img-loader-container" >
        <div className="loaderimg-wrapp">
        <HammerLogo/>
        </div>
        <div className="loader loader-width-img" >
        </div>
    </div>
        )
    } 
    if(props.type === "imgloader_fixed"){
        return (
        <div className="imgloader_fixed img-loader-container" >
        <div className="loaderimg-wrapp">
        {/* <img src={logo} alt="" /> */}
        <HammerLogo/>
        </div>
        <div className="loader loader-width-img" >

        </div>
    </div>
        )
    } 
    else {
        return (
            <div className="d-flex flex-column justify-content-center align-center" style={{ margin: "15px auto", width: "100%", height: "100vh" }}>
                {/* <div className="loader" style={{ margin: "15px auto" }}></div> */}
                <h4 style={{ margin: " 0 auto", textAlign: "center" }}>Loading...</h4>
            </div>
        )
    }
}

export default Loader
