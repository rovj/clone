import React from 'react'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../Firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useContext } from 'react';
import {AuthContext} from '../context/AuthContext'
import "../styles/Login.css"
function Login() {
  let [email,setEmail] = useState("");
  let [password,setPassword] = useState("");
  //let [user,setUser] = useState(null);
  let [loader,setLoader] = useState(false);
  let [error,setError] = useState("");
  let contextObj = useContext(AuthContext);
  const changeEmail = (e) =>{
    setEmail(e.target.value);
  }
  const changePassword = (e) =>{
    setPassword(e.target.value);
  }
  const display = async function() {
    try{
      setLoader(true);
      let userCred = await signInWithEmailAndPassword(auth,email,password);
      //setUser(userCred.user);
      //console.log(user);
    }
    catch(err){
      setError(err.message);
      contextObj.setUser(null);
      setTimeout(()=>{
        setError("");
      },2000)
    }
    setLoader(false);
  }
  
  
  return (
    <>
    
    {
     loader == true ?
      <div class="loader">
          <svg className="circular">
              <circle class="path" cx="50" cy="50" r="0" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
          </svg>
      </div>:
     <>
     <div className='back-login'></div>
     <div className='container-login'>
        <img src="
        https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png
        " alt="" className=""  height="160px" width="160px"/>
        {error!="" && <div className='error'>{error}</div>}
        <input type="email" placeholder='Enter Email' value={email} onChange={changeEmail} width="100px" height="30px"/>
        <input type="password" placeholder='Password' value={password} onChange={changePassword}/>
        
        <button onClick={display}>LOG IN</button>
        <p className='forgot'>Forgot Password?</p>
     </div>
     <div className='second'>
       <p>Don't have an account? <Link to={"/signup"}>Sign Up</Link></p>
     </div>
     <div class="get-the-app">
        <span>Get the app</span>
        <div class="badge">
          <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" alt="android App" />
          <img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" alt="ios app"/>
        </div>
    </div>
    <div class="container-login-footer">
      <nav class="footer-nav">
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
      <div class="copyright-notice">
        &copy; 2019 Complaints
      </div>
    </div>
      
     </>
     }
    </>
  )
}

export default Login