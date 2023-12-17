import Navbar from "../components/Navbar";
import Signin from "../components/FreelancerSignin";
import '../static/css/pages/SigninPage.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import { Switch } from "@mui/material";
import FreelancerSignin from "../components/FreelancerSignin";
import ProducerSignin from "../components/ProducerSignin";


const SigninPage = () => {
    const [formType, setFormType] = useState(true);
    const navigate = useNavigate();

    const handleToggle = () => {
        setFormType(!formType);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, []);

    return (
        <div className="signin_page_container">
            <Navbar />
            {
                formType ?
                (
                    <div className="signin_form_container">
                        <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label={<span style={{ color: 'grey', fontWeight: 'bold' }}>Producer / Freelancer</span>} 
                        onChange={handleToggle}
                        />
                        <FreelancerSignin />
                    </div>
                )
                :
                (
                    <div className="signin_form_container">
                        <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label={<span style={{ color: 'grey', fontWeight: 'bold' }}>Producer / Freelancer</span>}
                        onChange={handleToggle}
                        />
                        <ProducerSignin />
                    </div>
                )
            }
        </div>
    )
}

export default SigninPage;