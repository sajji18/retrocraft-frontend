import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../static/css/pages/FreelancerDashboard.css';

const FreelancerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            axios.get('http://localhost:3000/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
                setToken(token)
                const role = response.data.user.payload.role;
                localStorage.setItem("role", role);
                setUserRole(role)
            })
            .catch(error => {
                // console.log(error.response.data)
                console.error('Error fetching user data:', error);
            });
        }
        if (userRole === 'PRODUCER') {
            navigate("/producer-dashboard");
        }
    }, []);
    console.log(token)

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }

    if (token === null) {
        return (
            <div>
                <h1>Unauthorized, Please Signin <a href="/signin">Here</a></h1>
            </div>
        )
    }

    else if (userRole === 'FREELANCER') {
        return (
            <>
                <div className='freelancer_navbar_container'>
                    <div className='freelancer_navbar_left'>
                        <a href='/'>
                            <span className='freelancer_nav_span_1'>Retrocraft</span>
                            <span className='freelancer_nav_span_2'>Hub</span>
                        </a>
                    </div>
                    <div className='freelancer_navbar_right'>
                        <button className='freelancer_navbar_option_1' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </>
        )
    }
}

export default FreelancerDashboard;