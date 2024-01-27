import React, { useState } from 'react';
import './post.css';
import {FiMoreHorizontal} from 'react-icons/fi';
import { useEffect } from 'react';
import axios from 'axios';

import noAvatar from '../../images/noAvatar.png';
import {format} from 'timeago.js';
import { Link } from 'react-router-dom';

const Post = ({post, handleDelete}) => {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes.length);
    const [user, setUser] = useState();
    const [currUser, setcurrUser] = useState();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [optionsVisible, setOptionsVisible] = useState(false);


    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    useEffect(()=> {
        //set initial comments
        setComments(post.comments.sort((c1, c2) => {
            return new Date(c2.createdAt) - new Date(c1.createdAt);
        }));
    }, [post.comments]);

    useEffect(()=> {
        //handle setLiked
        setLiked(post.likes.includes(loggedInUser.userId));
    }, [post.likes, loggedInUser.userId])

    useEffect(()=> {
        async function getUserData(){
            const userData = await axios.get(`http://localhost:4000/api/users/id/${post.userId}`);
            setUser(userData.data);
        }
        getUserData();
    }, [post.userId]);

    //get current user
    useEffect(()=> {
        async function getCurrUserData(){
            const currUserData = await axios.get(`http://localhost:4000/api/users/${loggedInUser.username}`);
            setcurrUser(currUserData.data);
        }
        getCurrUserData(); 
    }, [loggedInUser.username]);


    async function handleLikeClick(){
        const userData = {
            userId: loggedInUser.userId
        };
        const data = await axios.put(`http://localhost:4000/api/posts/like/${post._id}`, userData);
        console.log(data.data);

        if(!liked){
            setLikes(likes+1);
            setLiked(true);
        }else{
            setLikes(likes-1);
            setLiked(false);
        }
    }

    function handleCommentsClick(){
        //set visible
        setCommentsVisible(true);

    }

    async function addCommentSubmit(ev){
        ev.preventDefault();

        //show comments
        if(!commentsVisible){
            setCommentsVisible(true);
        }        

        const newComment = {
            username: currUser?.username,
            profilePicture: currUser?.profilePicture,
            comment: comment,
        };
        //add to db
        try{
            await axios.post(`http://localhost:4000/api/posts/addComment/${post._id}`, newComment);

            // Create a new array by spreading the existing comments and adding the new comment to it
            const updatedComments = [newComment, ...comments];

            // Update both the 'post' state and the 'comments' state
            setComments(updatedComments);

            //clear comment
            setComment('');
        }catch(err){
            alert(err.message);
        }

        //setPost({ ...post, comments: updatedComments });
    }

    function callHandleDelete(){
        handleDelete(post._id);
    }

  return ( 
    <div id={post._id} className="post">
        <div className="top">
            <div className="topLeft">
                <img src={user?.profilePicture ? user?.profilePicture: noAvatar} className="profilePic" alt=""/> 
                <span className="username">{user?.username}</span>
                <span className="date">• {format(post.createdAt)}</span>
            </div>
            <div className="topRight">
            {user?.username === loggedInUser.username && (
                <>
                    <FiMoreHorizontal className="more-menu" size="20px" onClick={()=> {setOptionsVisible(!optionsVisible)}}/>
                    {optionsVisible && (
                        <div className="more-container">
                        <ul className="more-list">
                          <Link to={`/editPost/${post._id}`}><li>Edit</li></Link>
                          <li onClick={callHandleDelete}>Delete</li>
                        </ul>
                    </div>
                    )}
                </>
               
                
            )}
                
            </div>
        </div>

        <div className="image">
            <img src={post.image} alt=""/>
        </div>

        <div className="options">
            {liked ? (
            <i className="fa fa-heart" aria-hidden="true" style={{color: "red"}} onClick={handleLikeClick}></i>
            ) : (
            <i className="fa fa-heart-o" aria-hidden="true" onClick={handleLikeClick}></i>
            )} 
        </div>

        <div className="likesCount" >
            <span>{likes} likes</span>
        </div>

        <div className="description">
            <p>{post.description}</p>
        </div>

        <div className="commentsCount" onClick={handleCommentsClick}>
            <span className="viewComments">View all {comments.length} comments</span>
        </div>

        {commentsVisible && 
            <>
                {
                    comments.map((comment) => {
                        return <div className="commentsContainer">
                        <div className="commentsProfile">
                            <img src={comment.profilePicture ? comment.profilePicture : noAvatar} alt=""/>
                        </div>
                        <div className="commentsContent">
                            <p className="commentsDescription"><span className="commentsUsername">{comment.username+" "}</span>{comment.comment}</p>
                            <p className="commentsDate">{format(comment.createdAt)}</p>
                        </div>
                    </div>
                    })
                }
                

                <div className="hide-comments" onClick={()=> {
                    if(commentsVisible){
                        setCommentsVisible(false);
                    }
                }}>
                    <span>Hide Comments</span>
                </div>

            </>

        }

        <form className="addComment" onSubmit={addCommentSubmit}>
            <input type="text" value={comment} placeholder="Add a comment" onChange={(ev)=> setComment(ev.target.value)}></input>
            <button type="submit" className="postComment">Post</button>
        </form>

        <div className="postHr"></div>

    </div>
  )
}

export default Post