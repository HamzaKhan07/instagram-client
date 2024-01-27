import React, {useEffect, useState } from 'react';
import './login.css';
import logo from '../../images/instagram-logo.png';
import {Link, Navigate} from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate()

  async function handleSubmit(ev){
    ev.preventDefault();

    //set loading
    setLoading(true);

    const userData = {
      username: username,
      password: password
    };

    try{
      const user = await axios.post('http://localhost:4000/api/auth/login', userData);
      //success
      console.log(user.data);

      //save user
      const loggedInUser = {
        username: user.data.username,
        userId: user.data._id
      };
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

      console.log(loggedInUser);

      //navigate to homescreen (refresh)
      navigate(0);
    }catch(err){
      alert(err.response.data);
      console.log(err.response.data);
    }
    


    //hide loading
    setLoading(false);
  }

  if(redirect){
    return <Navigate to="/"/>
  }
  
  return (
    <div className="login">
        <form className="loginContainer" onSubmit={handleSubmit}>
            <img className="logo" src={logo} alt=""/>
            <input type="text" value={username} placeholder="Username" onChange={(ev) => setUsername(ev.target.value)}/>
            <input type="password" value={password} placeholder="Password" onChange={(ev) => setPassword(ev.target.value)}/>
            <button type="submit" className="btn">{loading ? <span className="loader"></span> : `Login`}</button>
            <p className="registerInfo">Don't have an account ? <Link to="/register"><span>Register</span></Link></p>
        </form>
    </div>
  )
}

export default Login