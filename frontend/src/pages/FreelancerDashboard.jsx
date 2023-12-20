import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../static/css/pages/FreelancerDashboard.css';

const FreelancerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [jobPosts, setJobPosts] = useState([]);
    const [connectionRequests, setConnectionRequest] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
        .get('http://localhost:3000/details', {
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
        if (userRole === 'PRODUCER') {
            navigate("/producer-dashboard");
        }
    }, []);

    useEffect(() => {
        axios
        .get('http://localhost:3000/freelancer/get-job-posts', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setJobPosts(response.data)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [])

    console.log(jobPosts)

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
                <div className='freelancer_dash_main_area'>
                    <div className='freelancer_dash_main_left_area'>
                        <div className='freelancer_dash_main_left_head'>
                            <span>Open Vacancies</span>
                        </div>
                        <div className='freelancer_dash_main_posts'>
                            {
                                jobPosts.map((job, index) => {
                                    return (
                                        <div className='freelancer_dash_job_card' key={job._id}>
                                            <span>{job.title}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                    <div className='freelancer_dash_main_right'>
                        <div className='freelancer_dash_main_right_part1'>
                            <span>Pending Requests</span>
                            
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default FreelancerDashboard;