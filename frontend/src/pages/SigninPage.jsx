import Navbar from "../components/Navbar";
import Signin from "../components/Signin";
import '../static/css/pages/SigninPage.css';

const SigninPage = () => {
    return (
        <div className="signin_page_container">
            <Navbar />
            <div className="signin_form_container">
                <Signin />
            </div>
        </div>
    )
}

export default SigninPage;