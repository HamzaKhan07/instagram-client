import React from 'react';
import './userposts.css';

import LeftBar from '../../components/left_bar/LeftBar';
import Feed from '../../components/feed/Feed';
import { useParams } from 'react-router-dom';

const UserPosts = () => {
    const {username, postId} = useParams();
    const user = {
        username: username,
        type: "other",
        postId: postId
    }

  return (
    <div className="userPosts">
        <LeftBar/>
        <Feed user={user}/>
        <div className="blank"></div>
    </div>
  )
}

export default UserPosts