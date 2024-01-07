import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProducerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [username, setUsername] = useState('');
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [myJobPosts, setMyJobPosts] = useState([]);
    const navigate = useNavigate();

    // Create Job Form State:
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState(['']);
    const [skillsRequired, setSkillsRequired] = useState(['']);
    const [employmentType, setEmploymentType] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');

    const handleJobFormSubmit = (e) => {
        e.preventDefault();
        const requirementsArray = requirements.split('\n').map((item) => item.trim());
        const skillsRequiredArray = skillsRequired.split('\n').map((item) => item.trim());

        axios
        .post('http://localhost:3000/producer/jobs',{
            title: title,
            description: description,
            requirements: requirementsArray,
            skillsRequired: skillsRequiredArray,
            employmentType: employmentType,
            location: location,
            salary: salary
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setMyJobPosts((prevJobs) => [...prevJobs, response.data]);

            setTitle('');
            setDescription('');
            setRequirements('');
            setSkillsRequired('');
            setEmploymentType('');
            setLocation('');
            setSalary('');
    
            console.log(response.data);
        })
        .catch((error) => {
            console.error('Error creating job:', error);
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
            setUserRole(role);
            setUsername(response.data.user.payload.username);
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

    useEffect(() => {
        axios
        .get('http://localhost:3000/producer/jobs', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setMyJobPosts(response.data)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [])

    const handleProfileClick = () => {
        navigate(`/profile/${userRole}/${username}`)
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
                <div className='producer_dash_main_area'>
                    <div className='producer_dash_main_left_area'>
                        <div className='producer_dash_main_left_head'>
                            <span>My Job Posts</span>
                        </div>
                        <div className='producer_dash_main_posts'>
                            { 
                                myJobPosts.map((job, index) => {
                                    return (
                                        <div className='producer_dash_job_card' key={job._id} onClick={() => navigate(`/job/${job._id}`)}>
                                            <div className='producer_dash_job_card_top'>
                                                <span>{job.title}</span>
                                            </div>
                                            <div className='producer_dash_job_card_bottom'>
                                                <div className='producer_dash_job_card_bottom_left'>
                                                    <span>{job.employmentType}, {job.location}</span>
                                                </div>
                                                <div className='producer_dash_job_card_bottom_right'>
                                                    {/* <button onClick={() => navigate(`/job/${job._id}`)}>View</button> */}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
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
                            {/* <div className='producer_job_form_heading'>
                                <span>Details</span>
                            </div> */}
                            <div className='producer_job_form_title'>
                                <span>Title</span>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder='Enter Title'
                                />
                            </div>
                            <div className='producer_job_form_description'>
                                <label htmlFor="description">Description:</label>
                                <textarea 
                                    name="description" 
                                    rows="5" 
                                    cols="67"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter Description"
                                />
                            </div>
                            <div className='producer_job_form_requirements'>
                                <label htmlFor='requirements'>Requirements (one per line):</label>
                                <textarea
                                    rows="5" 
                                    cols="67"
                                    name='requirements'
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    placeholder="Enter requirements"
                                />
                            </div>
                            <div className='producer_job_form_skills'>
                                <label htmlFor='skills'>Skills (one per line):</label>
                                <textarea
                                    name='skills'
                                    value={skillsRequired}
                                    onChange={(e) => setSkillsRequired(e.target.value)}
                                    placeholder="Enter skills"
                                />
                            </div>
                            <div className='producer_job_form_employment_type'>
                                <label htmlFor='employment'>Employment Type:</label>
                                <select name='employment' value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                                    <option value="">Select Employment Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <div className='producer_job_form_location'>
                                <label htmlFor='location'>Location:</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter location"
                                />
                            </div>
                            <div className='producer_job_form_salary'>
                                <label htmlFor='salary'>Salary:</label>
                                <input
                                    name='salary'
                                    type="number"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    placeholder="Enter salary"
                                />
                            </div>
                            <div className='producer_job_form_submit'>
                                <button onClick={handleJobFormSubmit}>Create Job</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ProducerDashboard