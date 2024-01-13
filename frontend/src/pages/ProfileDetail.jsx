import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../static/css/pages/ProfileDetail.css';
import '../static/css/pages/PostDetail.css';
import Loading from '../components/Loading';

const ProfileDetail = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { username, role } = useParams();
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [profileOwnerDetails, setProfileOwnerDetails] = useState({});
    const [message, setMessage] = useState('');

    // Profile Form States
    const [profileOwnerFormDetails, setProfileOwnerFormDetails] = useState({
        // Freelancer Fields
        firstName: profileOwnerDetails.firstName || '', 
        lastName: profileOwnerDetails.lastName || '',
        bio: profileOwnerDetails.bio || '',
        experience: profileOwnerDetails.experience || [],
        education: profileOwnerDetails.education || [],
        skills: profileOwnerDetails.skills || '',
        location: profileOwnerDetails.location || '',

        // Producer Fields
        about: profileOwnerDetails.about || '',
        industry: profileOwnerDetails.industry || '',
        companyName: profileOwnerDetails.companyName || '',
        jobsCreated: profileOwnerDetails.jobsCreated || [],
    });

    const handleChange = (e, fieldPath) => {
        setMessage('')
        setProfileOwnerFormDetails((prevDetails) => ({
            ...prevDetails,
            [fieldPath]: e.target.value,
        }));
    }

    const handleExperienceChange = (index, fieldName, value) => {
        setMessage('')
        setProfileOwnerFormDetails((prevDetails) => {
            const newExperience = [...prevDetails.experience];
            newExperience[index] = {
                ...newExperience[index],
                [fieldName]: value,
            };
            return {
                ...prevDetails,
                experience: newExperience,
            };
        });
    }

    const handleEducationChange = (index, fieldName, value) => {
        setMessage('');
        setProfileOwnerFormDetails((prevDetails) => {
            const newEducation = [...prevDetails.education];
            newEducation[index] = {
                ...newEducation[index],
                [fieldName]: value,
            };
            return {
                ...prevDetails,
                education: newEducation,
            };
        });
    }

    const handleAddEducation = () => {
        setMessage('')
        setProfileOwnerFormDetails((prevDetails) => ({
            ...prevDetails,
            education: [...prevDetails.education, { degree: '', school: '', graduationYear: '' }],
        }));
    }

    const handleRemoveEducation = (index) => {
        setMessage('')
        setProfileOwnerFormDetails((prevDetails) => {
            const newEducation = [...prevDetails.education];
            newEducation.splice(index, 1);
            return {
                ...prevDetails,
                education: newEducation,
            };
        });
    }

    // console.log("Hello ", profileOwnerFormDetails);

    const handleAddExperience = () => {
        setMessage('');
        setProfileOwnerFormDetails((prevDetails) => ({
            ...prevDetails,
            experience: [...prevDetails.experience, { jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
        }));
    }
        
    const handleRemoveExperience = (index) => {
        setMessage('');
        setProfileOwnerFormDetails((prevDetails) => {
            const newExperience = [...prevDetails.experience];
            newExperience.splice(index, 1);
            return {
                ...prevDetails,
                experience: newExperience,
            };
        });
    }

    useEffect(() => {
        axios.get('http://localhost:3000/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response.data)
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
                // console.log(response.data)
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
                // console.log(response.data)
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
            // console.log(response.data);
            setProfileOwnerDetails(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching profile owner data: ', error);
        })
    }, []);

    useEffect(() => {
        setProfileOwnerFormDetails({
            ...profileOwnerFormDetails,
            ...profileOwnerDetails,
        })
    }, [profileOwnerDetails])

    // const handleProfileClick = () => {
    //     navigate(`/profile/${username}`)
    // }

    const handleFreelancerProfileUpdateSubmit = () => {
        // e.preventDefault();
        // console.log(profileOwnerFormDetails.skills)
        // const skillsData = profileOwnerFormDetails.skills.split(',').map((item) => item.trim());
        
        axios
        .put('http://localhost:3000/freelancer/profile', {
            firstName: profileOwnerFormDetails.firstName,
            lastName: profileOwnerFormDetails.lastName,
            bio: profileOwnerFormDetails.bio,
            experience: profileOwnerFormDetails.experience,
            education: profileOwnerFormDetails.education,
            skills: profileOwnerFormDetails.skills,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            // console.log(response.data);
            setProfileOwnerDetails(response.data.updatedProfile);
            setMessage(response.data.message);
        })
        .catch((error) => {
            console.error("Some Error Updating Information: ", error)
        })
    }

    const handleProducerProfileUpdateSubmit = () => {
        axios
        .put('http://localhost:3000/producer/profile', {
            about: profileOwnerFormDetails.about,
            companyName: profileOwnerFormDetails.companyName,
            industry: profileOwnerFormDetails.industry,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            // console.log(response.data);
            setProfileOwnerDetails(response.data.updatedProfile);
            setMessage(response.data.message);
        })
        .catch((error) => {
            console.error("Some Error Updating Information: ", error)
        })
    }

    const handleProfileClick = () => {
        window.location.href = `/profile/${loggedInUserDetails.role}/${loggedInUserDetails.username}`;
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }

    console.log(profileOwnerDetails);

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
                            <a href='/'>
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
                                        src={'/default_profile.jpg'} 
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
                                                        value={profileOwnerDetails?.username}
                                                        disabled
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Email</span>
                                                    <input 
                                                        type="text"
                                                        value={profileOwnerDetails?.email}
                                                        disabled
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>First Name</span>
                                                    <input 
                                                        type="text"
                                                        defaultValue={profileOwnerFormDetails?.firstName}
                                                        onChange={(e) => handleChange(e, 'firstName')}
                                                        placeholder='Add First Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Last Name</span>
                                                    <input 
                                                        type="text"
                                                        defaultValue={profileOwnerFormDetails?.lastName}
                                                        onChange={(e) => handleChange(e, 'lastName')}
                                                        placeholder='Add Last Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_description'>
                                                    <label htmlFor="description">Bio:</label>
                                                    <textarea 
                                                        name="description" 
                                                        rows="5" 
                                                        cols="67"
                                                        defaultValue={profileOwnerFormDetails?.bio}
                                                        onChange={(e) => handleChange(e, 'bio')}
                                                        // onChange={(e) => {setDescription(e.target.value); setMessage('')}}
                                                        placeholder="Add Bio"
                                                    />
                                                </div>
                                                <div className='post_detail_form_requirements'>
                                                    <label htmlFor='requirements'>Work Experience:</label>
                                                    {profileOwnerFormDetails?.experience?.map((exp, index) => (
                                                        <>
                                                            <div 
                                                                key={index}
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'flex-start',
                                                                    minWidth: '90%',
                                                                    padding: '1rem',
                                                                    justifyContent: 'space-evenly',
                                                                    backgroundColor: '#f6f7f8',
                                                                    borderRadius: '1rem',
                                                                    margin: '0.5rem 0'
                                                                }}
                                                            >
                                                                <div 
                                                                    style={{
                                                                        fontSize: '1.25rem',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    Experience {index+1}
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>Job Title</span>
                                                                    <input
                                                                        type="text"
                                                                        name="jobTitle"
                                                                        value={exp.jobTitle}
                                                                        onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                                                                        placeholder="Job Title"
                                                                    />
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>Company</span>
                                                                    <input
                                                                        type="text"
                                                                        name="company"
                                                                        value={exp.company}
                                                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                                        placeholder="Company"
                                                                    />
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>Start Date</span>
                                                                    <input
                                                                        type="date"
                                                                        name="startDate"
                                                                        value={exp.startDate}
                                                                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                                                        placeholder="Start Date"
                                                                    />
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>End Date</span>
                                                                    <input
                                                                        type="date"
                                                                        name="endDate"
                                                                        value={exp.endDate}
                                                                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                                                        placeholder="End Date"
                                                                    />
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>Description</span>
                                                                    <input
                                                                        type="text"
                                                                        name="description"
                                                                        value={exp.description}
                                                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                                        placeholder="Description"
                                                                    />
                                                                </div>
                                                                {/* Repeat similar lines for other fields in experience */}
                                                                <div className='post_detail_form_update'>
                                                                    <button 
                                                                        onClick={() => handleRemoveExperience(index)}
                                                                        style={{ margin: '0.25rem 0', borderRadius: '1rem', backgroundColor: 'rgb(238, 60, 90)' }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </>
                                                    ))}
                                                    <button 
                                                        onClick={handleAddExperience}
                                                        style={{
                                                            height: '2.5rem',
                                                            borderRadius: '1rem',
                                                            border: 'none',
                                                            margin: '0.75rem 0',
                                                            backgroundColor: '#8DD7AB',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <span style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Add Experience</span>
                                                    </button>
                                                </div>
                                                <div className='post_detail_form_requirements'>
                                                    <label htmlFor='requirements'>Education (one per line):</label>
                                                    {profileOwnerFormDetails?.education?.map((edu, index) => (
                                                        <>
                                                            <div 
                                                                key={index}
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'flex-start',
                                                                    minWidth: '90%',
                                                                    padding: '1rem',
                                                                    justifyContent: 'space-evenly',
                                                                    backgroundColor: '#f6f7f8',
                                                                    borderRadius: '1rem',
                                                                    margin: '0.5rem 0'
                                                                }}
                                                            >
                                                                <div 
                                                                    style={{
                                                                        fontSize: '1.25rem',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    Education {index+1}
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>Degree</span>
                                                                    <input
                                                                        type="text"
                                                                        name="degree"
                                                                        value={edu.degree}
                                                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                                        placeholder="Degree"
                                                                    />
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>School</span>
                                                                    <input
                                                                        type="text"
                                                                        name="school"
                                                                        value={edu.school}
                                                                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                                                        placeholder="School"
                                                                    />
                                                                </div>
                                                                <div className='profile_detail_experience_form_field'>
                                                                    <span>Graduation Year</span>
                                                                    <input
                                                                        type="date"
                                                                        name="graduationYear"
                                                                        value={edu.graduationYear}
                                                                        onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                                                                        placeholder="Graduation Year"
                                                                    />
                                                                </div>
                                                                <div className='post_detail_form_update'>
                                                                    <button 
                                                                        onClick={() => handleRemoveEducation(index)}
                                                                        style={{ margin: '0.25rem 0', borderRadius: '1rem', backgroundColor: 'rgb(238, 60, 90)' }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </>
                                                    ))}
                                                    <button 
                                                        onClick={handleAddEducation}
                                                        style={{
                                                            height: '2.5rem',
                                                            borderRadius: '1rem',
                                                            border: 'none',
                                                            margin: '0.75rem 0',
                                                            backgroundColor: '#8DD7AB',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <span style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>Add Education</span>
                                                    </button>
                                                </div>
                                                <div className='post_detail_form_skills'>
                                                    <label htmlFor='skills'>Skills (Separate By Comma):</label>
                                                    <textarea
                                                        name='skills'
                                                        value={profileOwnerFormDetails?.skills}
                                                        onChange={(e) => {handleChange(e, 'skills')}}
                                                        placeholder="Enter skills"
                                                    />
                                                </div>
                                                <div className='post_detail_form_update'>
                                                    <button style={{ margin: '1rem 0' }} onClick={handleFreelancerProfileUpdateSubmit}>Update Profile</button>
                                                </div>
                                                {
                                                    message ? 
                                                    ( <div className='post_detail_informative_message'><span>{message}</span></div> ) : ( <></> )
                                                }
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
                                                    <span>Company Name</span>
                                                    <input 
                                                        type="text"
                                                        defaultValue={profileOwnerDetails.companyName}
                                                        onChange={(e) => handleChange(e, 'companyName')}
                                                        placeholder='Add Company Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_title'>
                                                    <span>Industry</span>
                                                    <input 
                                                        type="text"
                                                        defaultValue={profileOwnerDetails.industry}
                                                        onChange={(e) => handleChange(e, 'industry')}
                                                        placeholder='Add Industry Name'
                                                    />
                                                </div>
                                                <div className='post_detail_form_description'>
                                                    <label htmlFor="description">About:</label>
                                                    <textarea 
                                                        name="description" 
                                                        rows="5" 
                                                        cols="67"
                                                        defaultValue={profileOwnerDetails.about}
                                                        onChange={(e) => handleChange(e, 'about')}
                                                        placeholder="Add to About Section"
                                                    />
                                                </div>
                                                <div className='post_detail_form_update'>
                                                    <button style={{ margin: '1rem 0' }} onClick={handleProducerProfileUpdateSubmit}>Update Profile</button>
                                                </div>
                                                {
                                                    message ? 
                                                    ( <div className='post_detail_informative_message'><span>{message}</span></div> ) : ( <></> )
                                                }
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
                                        src={'/default_profile.jpg'} 
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
                                        overflowY: 'auto'
                                    }}
                                >
                                    {
                                        profileOwnerDetails.role === 'FREELANCER' ?
                                        (
                                            <div>
                                                <div className='general_post_detail_heading'>
                                                    <h1><span style={{ color: 'black' }}>Profile of</span> {profileOwnerDetails.firstName} {profileOwnerDetails.lastName}</h1>
                                                </div>
                                                <div className='general_post_detail_description'>
                                                    <h2>Bio: </h2>
                                                    <span style={{ fontSize: '1.25rem' }}>{profileOwnerDetails.bio}</span>
                                                </div>
                                                <div className='general_post_detail_description'>
                                                    <h2>Work Experience: </h2>
                                                    {
                                                        profileOwnerDetails.experience.map((exp, index) => {
                                                            return (
                                                                <div
                                                                    style={{
                                                                        backgroundColor: '#f6f7f8',
                                                                        minHeight: '2.5rem',
                                                                        borderRadius: '0.75rem',
                                                                        padding: '1rem',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center'
                                                                    }}    
                                                                >
                                                                    <span style={{ fontSize: '1.5rem', flex: 1 }}>{exp.jobTitle}</span>
                                                                    <span style={{ fontSize: '1.5rem', flex: 1, textAlign: 'center', marginRight: '2rem' }}>{exp.company}</span>
                                                                    <span style={{ flex: 1, textAlign: 'right' }}>{new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='general_post_detail_description'>
                                                    <h2>Education: </h2>
                                                    {
                                                        profileOwnerDetails.education.map((edu, index) => {
                                                            return (
                                                                <div
                                                                    style={{
                                                                        backgroundColor: '#f6f7f8',
                                                                        minHeight: '2.5rem',
                                                                        borderRadius: '0.75rem',
                                                                        padding: '1rem',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center'
                                                                    }}    
                                                                >
                                                                    <span style={{ fontSize: '1.5rem', flex: 1 }}>{edu.school}</span>
                                                                    <span style={{ fontSize: '1.5rem', flex: 1, textAlign: 'center', marginRight: '2rem' }}>{edu.degree}</span>
                                                                    <span style={{ flex: 1, textAlign: 'right' }}>{new Date(edu.graduationYear).toLocaleDateString()}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='general_post_detail_skills'>
                                                    <h2>Skills:</h2>
                                                    <ul
                                                        style={{
                                                            margin: '0 1rem'
                                                        }}
                                                    >
                                                    {
                                                        profileOwnerDetails.skills.map((skill, index) => {
                                                            return (
                                                                <li style={{ fontSize: '1.5rem', margin: '0.5rem' }} key={index}>{skill}</li> 
                                                            )
                                                        })
                                                    }
                                                    </ul>
                                                </div>
                                            </div>
                                        ) 
                                        : 
                                        (
                                            <div>
                                                <div className='general_post_detail_heading'>
                                                    <h1><span style={{ color: 'black' }}>Profile of</span> {profileOwnerDetails.username}</h1>
                                                </div>
                                                <div className='general_post_detail_description'>
                                                    <h2>Company: </h2>
                                                    <span style={{ fontSize: '1.25rem' }}>{profileOwnerDetails.companyName}</span>
                                                </div>
                                                <div className='general_post_detail_description'>
                                                    <h2>Industry: </h2>
                                                    <span>{profileOwnerDetails.industry}</span>
                                                </div>
                                                <div className='general_post_detail_description'>
                                                    <h2>About: </h2>
                                                    <span>{profileOwnerDetails.about}</span>
                                                </div>
                                            </div>
                                        )
                                    }
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