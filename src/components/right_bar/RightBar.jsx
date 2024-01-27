import React, { useEffect, useState } from 'react';
import './rightbar.css';
import axios from "axios";
import {Link} from 'react-router-dom';

import noAvatar from '../../images/noAvatar.png';

const RightBar = () => {
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
    <div className="rightbar"> 
      <div className="righttop">
        <div>
          <span className="heading">Explore people</span>
        </div>
        <div>
        </div>
        
      </div>

      <div className="people-list">
          {users.slice(0, 5).map((user) => {
            return  <Link to={`/profile/${user.username}`}>
              <div className="person">
                <div className="person-left">
                <img src={user?.profilePicture ? user?.profilePicture : noAvatar} alt=""/>
                <span className="person-name">{user?.username}</span>
              </div>
            </div>
          </Link>
          })}

        <Link className="see-more-link" to="/users">
          <span className="see-more">See All</span>
        </Link> 

      </div>
    </div>
  )
}

export default RightBar