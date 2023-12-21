import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../static/css/pages/FreelancerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Using this until i use an actual api to fetch blogs online
// (Since number of requests per day are limited :D)
const blogPosts = [
    {
        image: "",
        title: "",
        link: "",
    },
    {
        image: "",
        title: "",
        link: "",
    },
    {
        image: "",
        title: "",
        link: "",
    },
    {
        image: "",
        title: "",
        link: "",
    },
    {
        image: "",
        title: "",
        link: "",
    }
]

const connectionRequestsData = [
    {
        username: "USER-1",
        role: "FREELANCER",
        status: "PENDING"
    },
    {
        username: "USER-2",
        role: "PRODUCER",
        status: "PENDING"
    },
    {
        username: "USER3",
        role: "FREELANCER",
        status: "PENDING"
    }
]

const FreelancerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    // States for dynamic rendering
    const [jobPosts, setJobPosts] = useState([]);
    const [connectionRequests, setConnectionRequest] = useState([]);
    const [appliedJob, setAppliedJobs] = useState([]);

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
                        <button className='freelancer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button>
                        <button className='freelancer_logout' onClick={handleLogout}>Logout</button>
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
                    
                    <div className='freelancer_dash_main_right_area'>
                        <div className='freelancer_dash_main_right_head'>
                            <span>Pending Connection Requests</span>
                        </div>
                        <div className='freelancer_dash_main_requests'>

                        </div>
                        <div className='freelancer_dash_main_right_head'>
                            <span>Applied Jobs</span>
                        </div>
                        <div className='freelancer_dash_main_requests'>

                        </div>
                        <div className='freelancer_dash_main_right_head'>
                            <span>Blogs You Might Like:</span>
                        </div>
                        <div className='freelancer_dash_main_requests'>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default FreelancerDashboard;