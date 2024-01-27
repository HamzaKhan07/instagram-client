import React, { useEffect, useState } from 'react';
import './leftbar.css';
import logo from '../../images/instagram-logo.png';
import {AiFillHome} from 'react-icons/ai';
import {MdOutlineAddBox, MdPeople} from 'react-icons/md';

import {BiLogOutCircle} from 'react-icons/bi';
import noAvatar from '../../images/noAvatar.png';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

const LeftBar = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(()=> {
    
    
    async function getUserData(){
      const userData = await axios.get(`http://localhost:4000/api/users/${loggedInUser.username}`);
      
      console.log(loggedInUser.username);
      setUser(userData.data);
      console.log(userData.data);
    }
    
    getUserData();
  }, []);

  return (
    <div className="leftbar">
      <div className="logo">
        <img src={logo} alt="logo"/>
      </div>

      <div className="menu">
        <div className="menu-container">
          <Link to="/">
            <div className="option">
              <AiFillHome size={28} />
              <span className="text homeText">Home</span>
            </div>
          </Link>
          
          <Link to="/create">
            <div className="option">
              <MdOutlineAddBox size={28}/>
              <span className="text createText">Create</span>
            </div>
          </Link>

          <Link className="exploremenu-left" to="/users">
            <div className="option">
              <MdPeople size={28}/>
            </div>
          </Link>
          
          <Link to={`/profile/${loggedInUser.username}`}>
            <div className="option">
              <img src={user?.profilePicture ? user?.profilePicture : noAvatar} alt=""/>
              <span className="text profileText">Profile</span>
            </div>
          </Link>
          
        </div>
      </div>
    </div>
  )
}

export default LeftBar