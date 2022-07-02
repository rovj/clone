import React, { useEffect, useState } from 'react'
import "./Profile.css"
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { query } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { firestore } from '../../../Firebase';
import { where } from 'firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import Modal from '../../Modal';
import Header from '../../header/Header';
import { Grid } from '@mui/material';

function Profile() {
  let contextObj = useContext(AuthContext);
  let [posts,setPosts] = useState([]);
  let [email,setEmail] = useState("");
  let [name,setName] = useState("");
  let [profileUrl,setProfileUrl] = useState("");
  let [isOpen,setIsOpen] = useState(false);
  let [cInd,setCIndex] = useState(0);
  const handleOpen = (val,ind) =>{
    setCIndex(ind)
    setIsOpen(val);
  }
  useEffect(()=>{
    if(contextObj.user!=null){
      let temp = [];
      setName(contextObj.user.fullname);
      setEmail(contextObj.user.email);
      
      setProfileUrl(contextObj.user.profileUrl);
      const q = query(collection(firestore,"posts"),where("userId","==",contextObj.user.docId), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(q,(querySnapshot)=>{
          temp = [];
          querySnapshot.forEach((doc)=>{
              let data = {...doc.data(),postId : doc.id};
              console.log(data.userId+" added");
              temp.push(data);
              
              console.log("called posts");
          })
          setPosts(temp);
          
      })
      return ()=>{unsub()}
    }
  },[contextObj.user])
  return (
    <>
    <Header/>
    <Grid container sx={{ backgroundColor: 'background.paper' }}>
        <Grid item lg={12}>
            <Grid item lg={6}>
                <img src={profileUrl} className='img' />
            </Grid>
            <Grid item lg={6}>

            </Grid>
        </Grid>
        <Grid item lg={12}>

        </Grid>
    </Grid>
    </>


            // <div>
            //   <b>Posts</b> : {posts.length}
            //   </div>
              
            //   <br/>
            // </div>
            // <hr className='separator rounded'/>
            // <div className='post-list'>
            //   {posts.map((post,index)=>{
            //     return (
            //       <>
            //       <video onClick={() => handleOpen(true,index)} src={post.pUrl} className="profile-videos"></video>
            //       <Modal  open={isOpen} handleOpen={handleOpen} post={post} index={index} cIndex={cInd} />
            //       </>
            //     )
            //   })}
            // </div>
    
  )
}

export default Profile