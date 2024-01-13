import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Loading from '../components/Loading';

const style = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 350, 
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '0rem',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto'
    // backdropFilter: 'blur(10px)'
};

const ProducerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [username, setUsername] = useState('');
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [myJobPosts, setMyJobPosts] = useState([]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true)
    const [incomingConnectionRequests, setIncomingConnectionRequests] = useState([]);

    // Modal
    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null)

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedJob(null)
    }

    const handleApplicantsClick = (job) => {
        setSelectedJob(job);
        handleOpen();
    };

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
            setLoading(false)
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
                                        <>
                                            <div className='producer_dash_job_card' key={job._id}>
                                                <div className='producer_dash_job_card_top'>
                                                    <span>{job.title}</span>
                                                </div>
                                                <div className='producer_dash_job_card_bottom'>
                                                    <div className='producer_dash_job_card_bottom_left'>
                                                        <span>{job.employmentType}, {job.location}</span>
                                                    </div>
                                                    <div className='producer_dash_job_card_bottom_right' style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <button onClick={() => navigate(`/job/${job._id}`)} style={{ padding: '0.75rem 0rem', margin: '0 0.5rem' }}>View Job</button>
                                                        <button onClick={() => handleApplicantsClick(job)} style={{ padding: '0.75rem 2.5rem' }}>Applicants</button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {selectedJob && (
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    Applicants for {selectedJob.title}
                                </Typography>
                                {
                                    selectedJob.applicants.length ? 
                                    (
                                        <div 
                                            style={{
                                                background: '#f6f7f8',
                                                height: '100%',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                                overflowY: 'auto',
                                                borderRadius: '1rem'
                                            }}
                                        >
                                            {
                                                selectedJob.applicants.map((applicant, index) => {
                                                    return (
                                                        <div 
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                backgroundColor: '#ffffff',
                                                                margin: '1rem 0',
                                                                minHeight: '3.5rem',
                                                                width: '90%',
                                                                borderRadius: '0.5rem',
                                                                padding: '0.5rem'
                                                            }}
                                                        >
                                                            <div 
                                                                className='serial'
                                                                style={{
                                                                    flex: 1
                                                                }}
                                                            >
                                                                <span style={{  }}>{++index}.</span> 
                                                                <span style={{  }}>{applicant.username}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                    :
                                    (
                                        <div 
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100%',
                                                width: '100%',
                                                fontSize: '1.5rem',
                                                backgroundColor: '#f6f7f8',
                                                borderRadius: '1rem'
                                            }}
                                        >
                                            No Applicants Yet
                                        </div>
                                    )
                                }
                            </Box>
                        </Modal>
                    )}
                    
                    <div className='producer_dash_main_right_area'>
                        <div className='producer_dash_main_right_head'>
                            <span>Pending Connection Requests</span>
                        </div>
                        <div className='producer_dash_main_requests'>
                            {
                                incomingConnectionRequests.length ? 
                                (
                                    <div></div>
                                )
                                :
                                (
                                    loading ?
                                    (
                                        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading /></div>
                                    )
                                    :
                                    (
                                        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No Pending Connection Requests</div>
                                    )
                                )
                            }
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