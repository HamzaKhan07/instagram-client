import React, { useState } from 'react';
import './register.css';
import logo from '../../images/instagram-logo.png';
import noAvatar from '../../images/noAvatar.png';
import {BsFillCameraFill} from 'react-icons/bs';
import { Link } from 'react-router-dom';

import uploadFile from '../../services/uploadFile';
import axios from "axios";

const Register = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');
    

    async function handleSubmit(ev){
        ev.preventDefault();
        //show loading
        setLoading(true);

        let profilePicture='';
      
        try{
            if(file){
                profilePicture = await uploadFile(file);
            }
            //create user object
            const user = {
                username: username,
                password: password,
                description: description,
                profilePicture: profilePicture
            };

            //save user to backend
            await axios.post("http://localhost:4000/api/auth/register", user);

            //clear form
            setFile(null);
            setUsername('');
            setPassword('');
            setDescription('');

            //show dialog
            alert("User registered successfully!");

        }catch(err){
            alert(err.message);
        }

        //hide loading
        setLoading(false);
    }
    
  return (
    <div className="register">
        <form className="registerContainer" onSubmit={handleSubmit}>
            <img className="logo" src={logo} alt=""/>
            <div className="profileContainer">
                <img className="profile" src={file ?  URL.createObjectURL(file) : noAvatar} alt=""/>
                <label htmlFor="fileUpload">
                    <BsFillCameraFill className="close"></BsFillCameraFill>
                    <input style={{display: "none"}} type="file" id="fileUpload" accept=".png, jpg, jpeg" onChange={(ev)=> {setFile(ev.target.files[0])}}/>
                </label>
                <input style={{display: "none"}}id="fileUpload" type="file"></input>
            </div>
            <input type="text" value={username} placeholder="Username" required onChange={(ev)=> setUsername(ev.target.value)}/>
            <input type="password" value={password} placeholder="Password" minLength="6" required onChange={(ev)=> setPassword(ev.target.value)}/>
            <textarea type="text" rows="5" value={description} placeholder="Profile Description" onChange={(ev)=> setDescription(ev.target.value)}/>
            <button disabled={loading} type="submit" className="btn">{loading ? <span className="loader"></span> : `Register`}</button>
            <p className="registerInfo">Already Have an account ? <Link to="/login"><span>Login</span></Link></p>
        </form>
    </div>
  )
}

export default Register