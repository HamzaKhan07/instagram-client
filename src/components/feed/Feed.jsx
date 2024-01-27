import React, { useEffect, useState } from 'react';
import './feed.css';
import Post from '../post/Post';
import axios from 'axios';

const Feed = ({user}) => {
  const [posts, setPosts] = useState([]);
 
  useEffect(()=> {
    async function getPostsData(){
      if(user.type==="other"){
        const postsData = await axios.get(`http://localhost:4000/api/posts/timeline/${user.username}`);
        setPosts(postsData.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }));

      }
      else{
        const postsData = await axios.get(`http://localhost:4000/api/posts/timeline/all/${user.username}`);
        setPosts(postsData.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }));
      }
    }
    getPostsData();
  }, [user.username, user.type]);

  //for scrolling
  useEffect(() => {
    const access = document.getElementById(`${user.postId}`);
    console.log(access);
    if (access) {
      access.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [user.postId, posts]);

  return (
    <div className="feed">
      {posts.map((post) => {
        return <Post 
        handleDelete={async (postId)=>{
          console.log("delete tapped: "+postId);
    
          //delete here
          await axios.delete(`http://localhost:4000/api/posts/delete/${postId}`);
          console.log("post deleted successfully!");

          //update UI
          //Remove the deleted post from the state
          setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        }}
        key={post._id} 
        post={post}/>
      })}
    </div>
  )
}

export default Feed