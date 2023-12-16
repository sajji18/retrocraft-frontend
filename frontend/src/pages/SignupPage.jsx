import Signup from "../components/Signup";
import Navbar from "../components/Navbar";
import '../static/css/pages/SignupPage.css';

const SignupPage = () => {
    return (
        <div className="signup_page_container">
            <Navbar />
            <div className="signup_form_container">
                <Signup />
            </div>
        </div>
    )
}

export default SignupPage;