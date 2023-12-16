import Navbar from "../components/Navbar"
import '../static/css/pages/Landing.css';
import Signin from "../components/Signin";

const Landing = () => {
    return (
            <div className="landing_container">
                <img src="../../public/background4.png" alt="Error Fetching Image" />
                <Navbar></Navbar>
                <div className="signin-container">
                    <span className="landing_span">Bridging the Gap to New Opportunities</span>
                    <Signin />
                </div> 
            </div>
    )
}

export default Landing;