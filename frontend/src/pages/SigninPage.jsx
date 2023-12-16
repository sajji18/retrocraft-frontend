import Navbar from "../components/Navbar";
import Signin from "../components/Signin";
import '../static/css/pages/SigninPage.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SigninPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, []);

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