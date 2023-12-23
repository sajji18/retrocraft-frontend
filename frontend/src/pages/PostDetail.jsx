import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../static/css/pages/PostDetail.css';
import '../static/css/pages/ProducerDashboard.css';

const PostDetail = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const { jobId } = useParams();
    const [selectedJobData, setSelectedJobData] = useState({})
    const [producerId, setProducerId] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState(['']);
    const [skillsRequired, setSkillsRequired] = useState(['']);
    const [employmentType, setEmploymentType] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [message, setMessage] = useState('');

    const handleJobUpdateSubmit = (e) => {
        e.preventDefault();

        axios
        .put(`http://localhost:3000/producer/jobs/${jobId}`, {
            title: title,
            description: description,
            requirements: requirements,
            skillsRequired: skillsRequired,
            employmentType: employmentType,
            location: location,
            salary: salary
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            console.log(response.data.message);
            setMessage(response.data.message);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }

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
            setUsername(response.data.user.payload.username);
        })
        .catch(error => {
            // console.log(error.response.data)
            console.error('Error fetching user data:', error);
        });
    }, []);

    useEffect(() => {
        if (userRole === 'PRODUCER') {
            axios
            .get(`http://localhost:3000/producer/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                console.log(response.data)
                setSelectedJobData(response.data)
                setTitle(response.data.title)
                setDescription(response.data.description)
                setRequirements(response.data.requirements)
                setSkillsRequired(response.data.skillsRequired)
                setEmploymentType(response.data.employmentType)
                setLocation(response.data.location)
                setSalary(response.data.salary)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
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
                setProducerId(response.data._id)
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
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }, []);

    console.log(message)

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

    else if ((userRole === 'PRODUCER' && selectedJobData.producer !== producerId) || (userRole === 'FREELANCER')) {
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
                <div className='post_detail_main_area'>
                    <div className='post_detail_form'>
                        
                    </div>
                </div>
            </>
        )
    }

    else if (userRole === 'PRODUCER' && selectedJobData.producer === producerId) {
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
                <div className='post_detail_main_area'>
                    <div className='post_detail_form'>
                        <div className='post_detail_heading'>
                            <span>Preview / Update</span>
                        </div>
                        <div className='post_detail_form_title'>
                            <span>Title</span>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => {setTitle(e.target.value); setMessage('')}}
                                placeholder='Enter Title'
                            />
                        </div>
                        <div className='post_detail_form_description'>
                            <label htmlFor="description">Description:</label>
                            <textarea 
                                name="description" 
                                rows="5" 
                                cols="67"
                                value={description}
                                onChange={(e) => {setDescription(e.target.value); setMessage('')}}
                                placeholder="Enter Description"
                            />
                        </div>
                        <div className='post_detail_form_requirements'>
                            <label htmlFor='requirements'>Requirements (one per line):</label>
                            <textarea
                                rows="5" 
                                cols="67"
                                name='requirements'
                                value={requirements}
                                onChange={(e) => {setRequirements(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                placeholder="Enter requirements"
                            />
                        </div>
                        <div className='post_detail_form_skills'>
                            <label htmlFor='skills'>Skills (one per line):</label>
                            <textarea
                                name='skills'
                                value={skillsRequired}
                                onChange={(e) => {setSkillsRequired(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                placeholder="Enter skills"
                            />
                        </div>
                        <div className='post_detail_form_employment_type'>
                            <label htmlFor='employment'>Employment Type:</label>
                            <select name='employment' value={employmentType} onChange={(e) => {setEmploymentType(e.target.value); setMessage('');}}>
                                <option value="" disabled>Select Employment Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div className='post_detail_form_location'>
                            <label htmlFor='location'>Location:</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => {setLocation(e.target.value); setMessage('');}}
                                placeholder="Enter location"
                            />
                        </div>
                        <div className='post_detail_form_salary'>
                            <label htmlFor='salary'>Salary:</label>
                            <input
                                name='salary'
                                type="number"
                                value={salary}
                                onChange={(e) => {setSalary(e.target.value); setMessage('');}}
                                placeholder="Enter salary"
                            />
                        </div>
                        <div className='post_detail_form_update'>
                            <button onClick={handleJobUpdateSubmit}>Update Job</button>
                        </div>
                        {
                            message ? 
                            ( <div className='post_detail_informative_message'><span>{message}</span></div> ) : ( <></> )
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default PostDetail;