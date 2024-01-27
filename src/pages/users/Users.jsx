import React from 'react';
import './users.css';
import LeftBar from '../../components/left_bar/LeftBar';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import noAvatar from '../../images/noAvatar.png';

const Users = () => {
    const [users, setUsers] = useState([]);

  useEffect(()=> {
    async function getUsersData(){
      const usersData = await axios.get('http://localhost:4000/api/users/allUsers/all');
      setUsers(usersData.data);
      console.log("userdata: "+usersData.data);
    }
    getUsersData();

  }, []);  

  return (
    <div className="users">
        <LeftBar/>
        <div className="usersListWrapper">
            <div className="usersContainer">
                <div className="heading">Users</div>

                <div className="usersList">
                    {/* <Link to="">
                    <div className="user">
                        <img src={profilePic} alt=""/>
                        <span className="username">hamzakhan</span>
                    </div>
                    </Link> */}
                    {users.map((user) => {
                        return <Link to={`/profile/${user?.username}`}>
                            <div className="user">
                                <img src={user?.profilePicture ? user?.profilePicture : noAvatar} alt=""/>
                                <span className="username">{user?.username}</span>
                            </div>
                            </Link>
                    })}
                   

                </div>
            </div>
        </div>
    </div>
  )
}

export default Users