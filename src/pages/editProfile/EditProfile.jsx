import React, { useEffect, useState } from 'react';
import './editprofile.css';
import logo from '../../images/instagram-logo.png';
import noAvatar from '../../images/noAvatar.png';
import {BsFillCameraFill} from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import uploadFile from '../../services/uploadFile';
import axios from "axios";

const EditProfile = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [prevProfilePicture, setPreviousProfilePicture] = useState('');
    const navigate = useNavigate();

    const [prevUser, setprevUser] = useState();
    const {userId} = useParams();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    useEffect(()=> {
        async function getPrevUser(){
            const prevUserData = await axios.get(`http://localhost:4000/api/users/id/${userId}`);
            setprevUser(prevUserData.data);

            //set data
            setDescription(prevUserData.data.description);
            setPreviousProfilePicture(prevUserData.data.profilePicture);
        }
        getPrevUser();
        
    }, [userId]);
    

    async function handleSubmit(ev){
        ev.preventDefault();
        //show loading
        setLoading(true);

        let profilePicture='';
      
        try{
            if(file){
                profilePicture = await uploadFile(file);
                console.log("no file uploaded");
            }
            //create user object
            const user = {
                userId: loggedInUser.userId,
                description: description,
                profilePicture: profilePicture==='' ? prevProfilePicture : profilePicture,
            };

            //update user to backend
            await axios.put(`http://localhost:4000/api/users/update/${userId}`, user);

            //clear form
            setFile(null);
            setDescription('');

            //show dialog
            alert("User updated successfully!");

            //navigate to previous screen
            navigate(-1);

        }catch(err){
            alert(err.message);
        }

        //hide loading
        setLoading(false);
    }
    
  return (
    <div className="editprofile">
        <form className="registerContainer" onSubmit={handleSubmit}>
            <img className="logo" src={logo} alt=""/>
            <div className="profileContainer">
                <img className="profile" src={file ?  URL.createObjectURL(file) : prevProfilePicture ? prevProfilePicture : noAvatar} alt=""/>
                <label htmlFor="fileUpload">
                    <BsFillCameraFill className="close"></BsFillCameraFill>
                    <input style={{display: "none"}} type="file" id="fileUpload" accept=".png, jpg, jpeg" onChange={(ev)=> {setFile(ev.target.files[0])}}/>
                </label>
                <input style={{display: "none"}}id="fileUpload" type="file"></input>
            </div>
            <textarea type="text" rows="5" value={description} placeholder="Profile Description" onChange={(ev)=> setDescription(ev.target.value)}/>
            <button disabled={loading} type="submit" className="btn">{loading ? <span className="loader"></span> : `Update`}</button>
        </form>
    </div>
  )
}

export default EditProfile