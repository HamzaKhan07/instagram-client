import React, { useState } from 'react';
import './create.css';
import LeftBar from '../../components/left_bar/LeftBar';
import {GoFileMedia} from 'react-icons/go'; 
import {MdCancel} from 'react-icons/md'; 
import uploadFile from '../../services/uploadFile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Create = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                image: image,
                description: description
            };

            //add into db
            await axios.post('http://localhost:4000/api/posts/create', newPost);
            alert("Post created successfully!");

            //make inputs blank
            setDescription('');
            setFile(null);

            //go to back screen
            navigate(-1);
        
        }catch(err){
            alert(err);
        }

        //hide loading
        setLoading(false);
    }

  return (
    <div className="create">
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

                {file && (
                <div className="shareImgContainer">
                    <img className="shareImg" src={URL.createObjectURL(file)} alt="fileImg"/>
                    <MdCancel className="shareCancelImg"
                        onClick={() => {setFile(null);}}
                    />
                </div>
            )}

            <button className="btn">{loading ? <span className="loader"></span> : `Post`}</button>
            
            </form>

            
        </div>
    </div>
  )
}

export default Create