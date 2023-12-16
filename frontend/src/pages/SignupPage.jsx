import Signup from "../components/Signup";
import Navbar from "../components/Navbar";
import '../static/css/pages/SignupPage.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignupPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [])

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