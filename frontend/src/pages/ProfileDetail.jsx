import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../static/css/pages/ProfileDetail.css';

const ProfileDetail = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const { username } = useParams();
    const [userDetails, setUserDetails] = useState({});

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
    }, []);

    useEffect(() => {
        if (userRole === 'PRODUCER') {
            axios
            .get(`http://localhost:3000/producer/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log(response.data)
                setUserDetails(response.data)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
        else if (userRole === 'FREELANCER') {
            axios
            .get(`http://localhost:3000/freelancer/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log(response.data)
                setUserDetails(response.data)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
        
    }, []);

    const handleProfileClick = () => {
        navigate(`/profile/${username}`)
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
    else {
        if ((userRole === 'PRODUCER' && username === userDetails.username) || (userRole === 'FREELANCER' && username === userDetails.username)) {
            return (
                <>
                    <div className='producer_navbar_container'>
                        <div className='producer_navbar_left'>
                            <a href='/producer-dashboard'>
                                <span className='producer_nav_span_1'>Retrocraft</span>
                                <span className='producer_nav_span_2'>Hub</span>
                            </a>
                        </div>
                        <div className='producer_navbar_right'>
                            <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button>
                            <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className='profile_detail_main_area'>
                        <div className='profile_detail_photo'>
                            
                        </div>
                        <div className='profile_detail_form'>

                        </div>
                    </div>
                </>
            )
        }
        else if ((userRole === 'PRODUCER' && username !== userDetails.username) || (userRole === 'FREELANCER' && username !== userDetails.username)){
            return <div>TODO = Show Profile without edit Options To Other Users - Both Freelancers and Producers</div>
        }
    }
}

export default ProfileDetail;