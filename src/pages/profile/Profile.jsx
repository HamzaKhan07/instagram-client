import React, { useEffect, useState } from 'react';
import './profile.css';
import LeftBar from '../../components/left_bar/LeftBar';
import { useNavigate, useParams } from 'react-router-dom';
import noAvatar from '../../images/noAvatar.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {IoIosSettings} from 'react-icons/io';
 
const Profile = () => {

  const {username} = useParams();
  const [otherUser, setOtherUser] = useState();
  const [otherPosts, setOtherPosts] = useState([]);
  const [followingStatus, setFollowingStatus] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  //for otherUser
  useEffect(()=> {
    async function getUserData(){
      const otherUserData = await axios.get(`http://localhost:4000/api/users/${username}`);
      setOtherUser(otherUserData.data);
    }
    getUserData();
  }, [username, followingStatus]);

  //for followStatus
  useEffect(()=> {
    if(otherUser){
      if(otherUser.followers.includes(loggedInUser.userId)){
        setFollowingStatus(true);
        console.log("following");
      }
      else{
        setFollowingStatus(false);
        console.log("not following");
      }
    }
  }, [otherUser, loggedInUser, followingStatus]);


  //for otherPosts
  useEffect(()=>{
    async function getOtherPosts(){
      const otherUserPosts = await axios.get(`http://localhost:4000/api/posts/timeline/${username}`);
      setOtherPosts(otherUserPosts.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      }));
    }
    getOtherPosts();
  }, [username]);

  async function handleFollowClick(){

    if(followingStatus===false){
      //user not follows other user
      const currentUser = {
        userId: loggedInUser.userId
      }

      try{
        await axios.put(`http://localhost:4000/api/users/follow/${otherUser.username}`, currentUser);
      }catch(err){
        alert(err.message);
      }
      //update status
      setFollowingStatus(true);
    }
    else{
      //user already follows other user
      const currentUser = {
        userId: loggedInUser.userId
      }

      try{
        await axios.put(`http://localhost:4000/api/users/unfollow/${otherUser.username}`, currentUser);
      }catch(err){
        alert(err.message);
      }
      //update status
      setFollowingStatus(false);
    }

  }

  function handleLogOut(){
    localStorage.clear();
    navigate(0);
  }
 

  //for otherPosts
  return (
    <div className="profile">
      <LeftBar/>
      <div className="wrapper">
        <div className="container">
          <div className="profileImage">
              <img className="image" src={otherUser?.profilePicture ? otherUser?.profilePicture : noAvatar} alt=""/>
          </div>
          <div className="info">
              <div className="user-info">
                <span className="username">{otherUser?.username}</span>
                {loggedInUser.username !== otherUser?.username && (
                  <button className="btn" onClick={handleFollowClick}>{followingStatus===false ? `Follow` : 'Unfollow'}</button>
                )}

                {loggedInUser.username === username && (
                    <div className="more-menu">
                    <IoIosSettings 
                    className="settings-icon"
                    onClick={()=> (setOptionsVisible(!optionsVisible))}
                    />
                    
                    {optionsVisible && (
                      <div className="more-container">
                        <ul className="more-list">
                          <Link to={`/editProfile/${loggedInUser.userId}`}><li>Edit</li></Link>
                          <li onClick={handleLogOut}>Logout</li>
                        </ul>
                    </div>
                    )}
                  </div>
                )}
                
                
              </div>
          
              <p className="metrics"><span className="posts">{otherPosts?.length}</span> posts <span className="followers">{otherUser?.followers.length}</span> followers <span className="following">{otherUser?.following.length}</span> following</p>


              <p className="description">
                {otherUser?.description}
              </p>

          </div>
        </div> 

        <div className="profileHr"></div>

        <div className="gallery">
          {otherPosts?.map((post) => {
            return <Link to={`/posts/${username}/${post._id}`}><img src={post.image} alt=""/></Link>
          })}
        </div>

      </div>

      
    </div>
  )
}

export default Profile