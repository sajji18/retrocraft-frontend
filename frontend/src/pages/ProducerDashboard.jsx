import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProducerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);
    // console.log(token)

    const handleProfileClick = () => {

    }

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

    else if (userRole === 'PRODUCER') {
        return (
            <>
                <div className='producer_navbar_container'>
                    <div className='producer_navbar_left'>
                        <a href='/'>
                            <span className='producer_nav_span_1'>Retrocraft</span>
                            <span className='producer_nav_span_2'>Hub</span>
                        </a>
                    </div>
                    <div className='producer_navbar_right'>
                    <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button>
                    <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className='producer_dash_main_area'>
                    <div className='producer_dash_main_left_area'>
                        <div className='producer_dash_main_left_head'>
                            <span>My Job Posts</span>
                        </div>
                        <div className='producer_dash_main_posts'>
                            {/* { 
                                jobPosts.map((job, index) => {
                                    return (
                                        <div className='producer_dash_job_card' key={job._id}>
                                            <span>{job.title}</span>
                                        </div>
                                    )
                                })
                            } */}
                        </div>
                    </div>
                    
                    <div className='producer_dash_main_right_area'>
                        <div className='producer_dash_main_right_head'>
                            <span>Pending Connection Requests</span>
                        </div>
                        <div className='producer_dash_main_requests'>

                        </div>
                        <div className='producer_dash_main_right_head'>
                            <span>Create Job</span>
                        </div>
                        <div className='producer_dash_main_job_post_form'>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ProducerDashboard