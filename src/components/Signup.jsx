import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { auth, storage } from '../Firebase';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../Firebase';
import { useHistory,Link } from 'react-router-dom';
import { useContext } from 'react';
import {AuthContext} from '../context/AuthContext'
import "../styles/Signup.css"
import { database } from '../Firebase';
import { ref ,uploadBytes , getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function Signup() {
  let [email,setEmail] = React.useState("");
  let [password,setPassword] = React.useState("");
  let [name,setName] = React.useState("");
  let contextObj = useContext(AuthContext);
  let [loader,setLoader] = useState(false);
  let [error,setError] = useState("");
  let [file,setFile] = useState(null);
  
  //let history = useHistory();
  const changeEmail = (e) =>{
    setEmail(e.target.value);
  }
  const changePassword = (e) => {
    setPassword(e.target.value);
  }
  const changeName = (e) =>{
    setName(e.target.value);
  }
  async function temp (url,uid) {
    const docRef = await addDoc(collection(firestore,"users"),{
      email : email,
      userId : uid,
      fullname : name,
      profileUrl : url,
      createdAt : database.getTimeStamp,
      postIds : [],
      followers : [],
      following : []
    });
    //await signInWithEmailAndPassword(auth,email,password);
  }
  const signup = async () =>{
    if(file==null){
      setError("Please upload a profile image");
      setTimeout(()=>{
        setError("");
      },2000)
      return;
    }
    try{
      setError("");
      setLoader(true);
      let userCred = await createUserWithEmailAndPassword(auth,email,password);
      let uid = userCred.user.uid;
      const storageRef = ref(storage,`/users/${uid}/ProfileImage`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed",
        (snapshot) => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          setError(error);
        
          setTimeout(()=>{
            setError("");
          },2000)
          setLoader(false);
          return;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             temp(downloadURL,uid);
          });
        }
      );
      /*const docRef = await addDoc(collection(firestore,"users"),{
        email,
        name,
        reelsIds : [],
        profileImgUrl : "",
        userId : userCred.user.uid
      });*/
      
    }
    catch(err){
      setError(err.message);
      console.log(error);
      contextObj.setUser(null);
      setTimeout(()=>{
        setError("");
      },2000)
    }
    setLoader(false);
  }
  const select = () =>{
    document.getElementById("input_image").click();
  }
  
  return (
    <>
    {
      loader == true ? 
      <div class="loader">
          <svg className="circular">
              <circle class="path" cx="50" cy="50" r="0" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
          </svg>
      </div> :
      <div className='signup-parent'>
        <div className='signup'>
          <img src="
          https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png
          " alt="" className="" height="160px" width="160px" />
          <div className='bold-text'>Sign up to see photos and videos from your friends.</div>
          {error!="" && <div class="error">{error}</div>}
          <input type="email"  value={email} onChange={changeEmail} placeholder='Enter Email'/>
          <br/>
          <input type="password" value={password} onChange={changePassword} placeholder='Enter Password'/>
          <br/>
          <input type="text" value={name} onChange={changeName} placeholder='Enter Full Name'/>
          <br/>
          
          <input type="file" accept="image/png, image/jpeg" id="input_image"className="hidden" onChange={(e) => {setFile(e.target.files[0])}}></input>
          <div className='select' onClick={select}>Select a file</div>
          <div className='small'>People who use our service may have uploaded your contact information to Instagram. <b>Learn More</b></div>
          <div className='small'>By signing up, you agree to our Terms , <b>Data Policy</b> and <b>Cookies Policy</b> .</div>
          
          <button onClick={signup}>Sign Up</button>
        </div>
        <div className='signup-second'>
          Have an account?  {'\u00A0'} <Link to={"/login"}>Log in</Link>
        </div>
        <div class="get-the-app-sign-up">
            <span>Get the app</span>
            <div class="badge-signup">
              <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" alt="android App" />
              <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" alt="ios app"/>
            </div>
        </div>
        <div class="container-login-footer-signup">
          <nav className="footer-nav-signup">
            <ul>
              <li><a href="">About Us</a></li>
              <li><a href="">Support</a></li>
              <li><a href="">Jobs</a></li>
              <li><a href="">Privacy</a></li>
              <li><a href="">Terms</a></li>
              <li><a href="">Profiles</a></li>
              <li><a href="">Languages</a></li>
            </ul>
          </nav>
          <div className="copyright-notice">
            &copy; 2019 Complaints
          </div>
        </div>
      </div>
    }
    </>
    
  )
}

export default Signup