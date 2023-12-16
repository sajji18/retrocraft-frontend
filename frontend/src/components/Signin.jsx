import { useEffect, useState } from 'react';
import '../static/css/components/Signin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleSubmit = () => {
        axios
        .post('http://localhost:3000/login', {
            username: username,
            password: password
        })
        .then((response) => {
            console.log(response.data)
            localStorage.setItem("token", response.data.token)
            navigate("/");
        })
        .catch((error) => {
            console.error("Error Logging in: ", error);
        })
    }

    return (
        <div className="signin_container">
            <div className="heading">
                Login
            </div>
            <div className="form_fields">
                <input type="text" placeholder='Username'value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder='Password'value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="form_submit">
                <button onClick={handleSubmit}>Login</button>
                <div className="signin_prompt">
                    <span>Don't Have an Account? </span>
                    <a href="/signin">Join Now</a>
                </div>
            </div> 
            <div className="or_signin_container">
                <div className="or_signin_text">Or</div>
            </div>
            <div className='alternate_login_options'>
                <button>Channeli Login</button>
            </div>
        </div>
    )
}

export default Signin;