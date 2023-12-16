import Navbar from "../components/Navbar"
import '../static/css/pages/Landing.css';
import Signin from "../components/Signin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Landing = () => {
    const [userRole, setUserRole] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            axios.get('http://localhost:3000/userDetails', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
                setToken(token)
                setUserRole(response.data.user.payload.role);
            })
            .catch(error => {
                // console.log(error.response.data)
                console.error('Error fetching user data:', error);
            });
        }
    }, []);

    if (!token) {
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

    else if ((userRole === 'FREELANCER')) {
        return (
            <h1>Freelancer</h1>
        )
    }

    else if ((userRole === 'PRODUCER')) {
        return (
            <h1>Producer</h1>
        )
    }

    else {
        <h1>Loading....</h1>
    }

}

export default Landing;