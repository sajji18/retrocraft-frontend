import axios from 'axios';
import '../static/css/components/Signup.css';
import { useState } from 'react';


const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")

    const handleSignupClick = () => {
        axios
        .post('http://localhost:3000/signup', {
            username,
            password,
            firstName,
            lastName,
            email,
            role
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Error Signing up: ", error);
        })
    }

    return (
        <div className="signup_container">
            <div className="heading">
                Sign Up
            </div>
            <div className="signup_form_fields">
                <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="" disabled>-- Select Role --</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Producer">Producer</option>
                </select>
            </div>
            <div className="signup_form_submit">
                <button onClick={handleSignupClick}>Login</button>
                <div className="signup_prompt">
                    <span>Already Have An Account? </span>
                    <a href="/signin">Sign In</a>
                </div>
            </div> 
        </div>
    )
}

export default Signup;