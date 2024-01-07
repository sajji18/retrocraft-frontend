import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../static/css/pages/ProfileDetail.css';
import Loading from '../components/Loading';

const ProfileDetail = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { username, role } = useParams();
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [profileOwnerDetails, setProfileOwnerDetails] = useState({});

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
                setLoggedInUserDetails(response.data)
                setIsLoading(false)
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
                setLoggedInUserDetails(response.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
        
    }, [userRole]);

    useEffect(() => {
        axios
        .get(`http://localhost:3000/profile-owner-details/${role}/${username}`)
        .then(response => {
            console.log(response.data)
            setProfileOwnerDetails(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching profile owner data: ', error);
        })
    }, []);

    // const handleProfileClick = () => {
    //     navigate(`/profile/${username}`)
    // }

    const handleProfileUpdateSubmit = () => {

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
        if ((userRole === 'PRODUCER' && username === loggedInUserDetails.username) || (userRole === 'FREELANCER' && username === loggedInUserDetails.username)) {
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
                            {/* <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button> */}
                            <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    {
                        !loading ?
                        (
                            <div className='profile_detail_main_area'>
                                <div className='profile_detail_photo'
                                    style={{
                                        overflow: 'hidden', 
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        paddingBottom: '1rem',
                                    }}
                                >
                                    <img 
                                        className="profile-picture" 
                                        src={'../../public/default_profile.jpg'} 
                                        alt="Profile" 
                                        style={{
                                            width: '80%',
                                            height: '80%',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            marginTop: '1rem',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div style={{
                                        // marginTop: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}>
                                        <span
                                            style={{
                                                fontSize: '1.5rem',
                                            }}
                                        >
                                            {profileOwnerDetails.username}
                                        </span>
                                        <span>
                                            {profileOwnerDetails.email}
                                        </span>
                                        <span>
                                            {/* Connections {profileOwnerDetails.} */}
                                        </span>
                                    </div>
                                </div>
                                <div 
                                    className='profile_detail_form'
                                    style={{
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    {
                                        userRole === 'FREELANCER' ?
                                        (
                                            <>
                                                <div className='post_detail_heading'>
                                                    <span
                                                        style={{
                                                            fontSize: '1.75rem',
                                                            // textDecoration: 'underline',
                                                            color: '#8DD7AB',
                                                        }}
                                                    >
                                                        PROFILE
                                                    </span>
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Username</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.username}
                                                        disabled
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Email</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.email}
                                                        disabled
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>First Name</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.firstName}
                                                        placeholder='Add First Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Last Name</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.lastName}
                                                        placeholder='Add Last Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_description'>
                                                    <label htmlFor="description">Bio:</label>
                                                    <textarea 
                                                        name="description" 
                                                        rows="5" 
                                                        cols="67"
                                                        value={profileOwnerDetails.bio}
                                                        // onChange={(e) => {setDescription(e.target.value); setMessage('')}}
                                                        placeholder="Add Bio"
                                                    />
                                                </div>
                                                <div className='post_detail_form_requirements'>
                                                    <label htmlFor='requirements'>Work Experience (one per line):</label>
                                                    <textarea
                                                        rows="5" 
                                                        cols="67"
                                                        name='requirements'
                                                        value={profileOwnerDetails.workExperience}
                                                        // onChange={(e) => {setRequirements(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                                        placeholder="Add Experience"
                                                    />
                                                </div>
                                                <div className='post_detail_form_requirements'>
                                                    <label htmlFor='requirements'>Education (one per line):</label>
                                                    <textarea
                                                        rows="5" 
                                                        cols="67"
                                                        name='requirements'
                                                        value={profileOwnerDetails.education}
                                                        // onChange={(e) => {setRequirements(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                                        placeholder="Add Education"
                                                    />
                                                </div>
                                                <div className='post_detail_form_skills'>
                                                    <label htmlFor='skills'>Skills (one per line):</label>
                                                    <textarea
                                                        name='skills'
                                                        value={profileOwnerDetails.skills}
                                                        // onChange={(e) => {setSkillsRequired(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                                        placeholder="Enter skills"
                                                    />
                                                </div>
                                                <div className='post_detail_form_location'>
                                                    <label htmlFor='location'>Location:</label>
                                                    <input
                                                        type="text"
                                                        value={profileOwnerDetails.location}
                                                        // onChange={(e) => {setLocation(e.target.value); setMessage('');}}
                                                        placeholder="Enter location"
                                                    />
                                                </div>
                                                <div className='post_detail_form_update'>
                                                    <button onClick={handleProfileUpdateSubmit}>Update Profile</button>
                                                </div>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <div className='post_detail_heading'>
                                                    <span
                                                        style={{
                                                            fontSize: '1.75rem',
                                                            // textDecoration: 'underline',
                                                            color: '#8DD7AB',
                                                        }}
                                                    >
                                                        PROFILE
                                                    </span>
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Username</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.username}
                                                        disabled
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Email</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.email}
                                                        disabled
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>First Name</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.firstName}
                                                        placeholder='Add First Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Last Name</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails.lastName}
                                                        placeholder='Add Last Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_description'>
                                                    <label htmlFor="description">Bio:</label>
                                                    <textarea 
                                                        name="description" 
                                                        rows="5" 
                                                        cols="67"
                                                        value={profileOwnerDetails.bio}
                                                        // onChange={(e) => {setDescription(e.target.value); setMessage('')}}
                                                        placeholder="Add Bio"
                                                    />
                                                </div>
                                                <div className='post_detail_form_requirements'>
                                                    <label htmlFor='requirements'>Work Experience (one per line):</label>
                                                    <textarea
                                                        rows="5" 
                                                        cols="67"
                                                        name='requirements'
                                                        value={profileOwnerDetails.workExperience}
                                                        // onChange={(e) => {setRequirements(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                                        placeholder="Add Experience"
                                                    />
                                                </div>
                                                <div className='post_detail_form_location'>
                                                    <label htmlFor='location'>Location:</label>
                                                    <input
                                                        type="text"
                                                        value={profileOwnerDetails.location}
                                                        // onChange={(e) => {setLocation(e.target.value); setMessage('');}}
                                                        placeholder="Enter location"
                                                    />
                                                </div>
                                                <div className='post_detail_form_update'>
                                                    <button onClick={handleProfileUpdateSubmit}>Update Profile</button>
                                                </div>
                                            </>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        )
                        :
                        (
                            <Loading/>
                        )
                    }
                </>
            )
        }
        else if ((userRole === 'PRODUCER' && username !== loggedInUserDetails.username) || (userRole === 'FREELANCER' && username !== loggedInUserDetails.username)){
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
                            {/* <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button> */}
                            <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    {
                        !loading ? 
                        (   
                            <div className='profile_detail_main_area'>
                                <div className='profile_detail_photo'
                                    style={{
                                        overflow: 'hidden', 
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        paddingBottom: '1rem',
                                    }}
                                >
                                    <img 
                                        className="profile-picture" 
                                        src={'../../public/default_profile.jpg'} 
                                        alt="Profile" 
                                        style={{
                                            width: '80%',
                                            height: '80%',
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            marginTop: '1rem',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <div style={{
                                        // marginTop: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}>
                                        <span
                                            style={{
                                                fontSize: '1.5rem',
                                            }}
                                        >
                                            {profileOwnerDetails.username}
                                        </span>
                                        <span>
                                            {profileOwnerDetails.email}
                                        </span>
                                    </div>
                                </div>
                                <div 
                                    className='profile_detail_form'
                                    style={{
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                >

                                </div>
                            </div>
                        )
                        :
                        (
                            <div
                                style={{
                                    
                                }}
                            >
                                <Loading />
                            </div>
                        )
                    }
                    
                </>
            )
        }
    }
}

export default ProfileDetail;