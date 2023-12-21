import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';

const ProducerPostDetail = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const { jobId } = useParams();
    const [selectedJobData, setSelectedJobData] = useState({})
    const [producerId, setProducerId] = useState({});

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

    useEffect(() => {
        axios.get(`http://localhost:3000/producer/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setSelectedJobData(response.data)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3000/producer/profile`, {
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
    }, []);

    if (token === null) {
        return (
            <div>
                <h1>Unauthorized, Please Signin <a href="/signin">Here</a></h1>
            </div>
        )
    }

    else if (userRole === 'PRODUCER' && selectedJobData.producer === producerId) {
        return (
            <div>Post detail view: {selectedJobData._id}</div>
        )
    }

    else {
        return <div>Producers cannot see other Producer Job's Edit View</div>
    }
}

export default ProducerPostDetail