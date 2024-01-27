import React, { useEffect, useState } from 'react';
import './home.css';
import LeftBar from '../../components/left_bar/LeftBar';
import Feed from '../../components/feed/Feed';
import RightBar from '../../components/right_bar/RightBar';

import axios from 'axios';

const Home = () => {
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

   // Render nothing until the user data is available
   if (!user) {
    return null;
  }

  return (
    <div className="home">
        <LeftBar/>
        <Feed user={loggedInUser}/>
        <RightBar user={user}/>
    </div>
  )
}

export default Home