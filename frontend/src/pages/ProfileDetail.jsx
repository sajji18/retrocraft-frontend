import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';

const ProfileProfileDetail = () => {
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
                <div>Profile: {userDetails.username} {userDetails.role} {userDetails.email}</div>
            )
        }
        else if ((userRole === 'PRODUCER' && username !== userDetails.username) || (userRole === 'FREELANCER' && username !== userDetails.username)){
            return <div>TODO = Show Profile without edit Options To Other Users - Both Freelancers and Producers</div>
        }
    }
}

export default ProfileProfileDetail