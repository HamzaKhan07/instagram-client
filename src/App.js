import './App.css';
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Create from './pages/create/Create';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { useEffect, useState } from 'react';
import UserPosts from './pages/userPosts/UserPosts';
import Users from './pages/users/Users';
import EditProfile from './pages/editProfile/EditProfile';
import EditPost from './pages/editPost/EditPost';

function App() {

  // useEffect(()=> {
  //   localStorage.clear();
  // });
  return (
    <Routes>
      <Route 
        path="/"
        element= {
          <div>
            {localStorage.getItem('loggedInUser') ? <Home /> : <Login />}
          </div>
        }
      />

      <Route 
        path="/profile/:username"
        element= {
          <div>
            {localStorage.getItem('loggedInUser') ? <Profile /> : <Navigate to="/"/>}
          </div>
        }
      />

      <Route 
        path="/create"
        element= {
          <div>
            <Create/>
          </div>
        }
      />

      <Route 
        path="/login"
        element= {
          <div>
            {localStorage.getItem('loggedInUser') ? <Navigate to="/"/> : <Login />}
          </div>
        }
      />

      <Route 
        path="/register"
        element= {
          <div>
            <Register/>
          </div>
        }
      />

      <Route 
        path="/posts/:username/:postId"
        element= {
          <div>
            <UserPosts/>
          </div>
        }
      />

      <Route 
        path="/users"
        element= {
          <div>
            <Users/>
          </div>
        }
      />

      <Route 
        path="/editProfile/:userId"
        element= {
          <div>
            <EditProfile/>
          </div>
        }
      />


      <Route 
        path="/editPost/:postId"
        element= {
          <div>
            <EditPost/>
          </div>
        }
      />


    </Routes>
  );
}

export default App;
