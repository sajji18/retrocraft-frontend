import Navbar from "../components/Navbar"
import '../static/css/pages/Landing.css';
import Signin from "../components/FreelancerSignin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Landing = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        // ----------------- FETCHING USER DETAILS LIKE ROLE AND USERNAME -----------------
        axios.get('http://localhost:3000/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            const role = response.data.user.payload.role;
            localStorage.setItem("role", role);
            setUserRole(role)
        })
        .catch(error => {
            // console.log(error.response.data)
            console.error('Error fetching user data:', error);
        });

        if (userRole === 'FREELANCER') {
            navigate("/freelancer-dashboard");
        }

        else if (userRole === 'PRODUCER') {
            navigate("/producer-dashboard");
        }
    }, [userRole, token]);
    console.log(token)

    
    if (token === null) {
        return (
            <div className="landing_container">
                {/* <img src="../../public/background2.png" alt="Error Fetching Image" /> */}
                <Navbar></Navbar>
    
                {/* <div className="signin-container">
                    <span className="landing_span">Bridging the Gap to New Opportunities</span>
                    <Signin />
                </div>  */}
            </div>
        )
    }
    else {
        return <h1>...Loading</h1>
    }
}

export default Landing;