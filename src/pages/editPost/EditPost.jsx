import React, { useEffect, useState } from 'react';
import './editpost.css';
import LeftBar from '../../components/left_bar/LeftBar';
import {GoFileMedia} from 'react-icons/go'; 
import {MdCancel} from 'react-icons/md'; 
import uploadFile from '../../services/uploadFile';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [prevPost, setPrevPost] = useState();
    const [prevPostImage, setPrevPostImage] = useState('');
    const {postId} = useParams();
    const navigate = useNavigate();

    useEffect(()=> {
        async function getPrevPostData(){
            const prevPostData = await axios.get(`http://localhost:4000/api/posts/getPost/${postId}`);
            setPrevPost(prevPostData.data);

            //set Data here
            setDescription(prevPostData.data.description);
            setPrevPostImage(prevPostData.data.image);
            console.log(prevPostData.data);
        }
        getPrevPostData();
        
    }, [postId]);

    async function handleSubmit(ev){
        ev.preventDefault();
        
        //set loading
        setLoading(true);

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        let image='';

        try{
            //upload file
            if(file){
                image = await uploadFile(file);
            }

            const newPost={
                userId: loggedInUser.userId,
                image: image ==='' ? prevPostImage : image,
                description: description
            };

            //add into db
            await axios.put(`http://localhost:4000/api/posts/update/${postId}`, newPost);
            alert("Post updated successfully!");

            //make inputs blank
            setDescription('');
            setFile(null);

            //go to back page
            navigate(-1);
            
        
        }catch(err){
            alert(err);
        }

        //hide loading
        setLoading(false);
    }

  return (
    <div className="editpost">
        <LeftBar/>
        <div className="wrapper">
            <form className="container" onSubmit={handleSubmit}>

                <p>Add Decription</p>
                <textarea 
                    value={description} 
                    className="uploadDesc" 
                    placeholder="A sweet description here..." 
                    rows="5" 
                    onChange={(ev) => {setDescription(ev.target.value)}}
                />

                <p>Add Media</p>
                <label htmlFor="file" className="shareOption">
                        <GoFileMedia htmlcolor="tomato" className="shareIcon"/>
                        <span className="shareOptionText">Photo or Video</span>
                        <input style={{display: "none"}} type="file" id="file" accept=".png, jpg, jpeg" onChange={(ev)=> {setFile(ev.target.files[0])}}/>
                    </label>

                <input style={{display: "none"}}id="file" type="file"></input>

                {(file || prevPostImage) && (
                <div className="shareImgContainer">
                    <img className="shareImg" src={file ? URL.createObjectURL(file) : prevPostImage ? prevPostImage : null} alt="fileImg"/>

                    {file && (<MdCancel className="shareCancelImg"
                        onClick={() => {setFile(null);}}/>)}
                    
                </div>
            )}

            <button className="btn">{loading ? <span className="loader"></span> : `Update`}</button>
            
            </form>

            
        </div>
    </div>
  )
}

export default EditPost