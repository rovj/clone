import React, { useEffect, useState } from 'react'
import { query, orderBy, limit, QuerySnapshot } from "firebase/firestore";  
import { firestore } from '../Firebase';
import { collection } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import Modal from './Modal';
import Video from './Video';
import Like from './Like';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import "../styles/Posts.css"
const Posts = ({user}) =>{
  const [posts,setPosts] = useState(null);
  let [isOpen,setIsOpen] = useState(false);
  let [cInd,setCIndex] = useState(0);
  const handleOpen = (val,ind) =>{
    setCIndex(ind)
    setIsOpen(val);
  }
  if(posts!=null){
    console.log("rendered   "+posts.length);
  }
  useEffect(()=>{
    let parr = [];
    const q = query(collection(firestore,"posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q,(querySnapshot)=>{
        parr=[];
        querySnapshot.forEach((doc)=>{
            let data = {...doc.data(),postId : doc.id}
            console.log(data.postId+" called");
            parr.push(data);
            
            console.log("called");
        })
        setPosts(parr);
        
    })
    return ()=>{unsub()}
  },[])
  useEffect(()=>{
    if(posts!=null && posts.length>0){
        console.log(posts[0].likes+" hope...........");
    }
    else{
        console.log("something bullshit");
    }
  },[posts])
  const callback = (entries) => {
    entries.forEach((entry)=>{
        let ele = entry.target.childNodes[0];
        console.log(ele);
        ele.play().then(()=>{
            if(!ele.paused && !entry.isIntersecting){
                ele.pause();
            }
        })
    })
  }
  let observer = new IntersectionObserver(callback,{threshold:0.6});

  useEffect(()=>{
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
    const elements = document.querySelectorAll(".videos ");
    elements.forEach((element)=>{
        console.log("hehehehehehehehehehe")
        observer.observe(element);
    })
    return ()=>{
        observer.disconnect();
    }
  },[posts,user])
  return (
    < >
    
    {(posts==null || user==null) ?  
        <div class="loader">
            <svg className="circular">
                <circle class="path" cx="50" cy="50" r="0" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
            </svg>
        </div> 
    :
    <div className='video-container'>
        {   
            posts.map((post,index)=>{
                
                return (
                    <React.Fragment key={index} >
                        <div className='videos'>
                            <Video src={post.pUrl}/>
                            <div class="fa">
                                <img className="img_reel"src={post.uProfile}/>
                                <h4 className='name'>{post.uName}</h4>
                            </div>
                            <div className="like">
                               <Like  user={user} post={post} />
                            </div>
                            <div onClick={() => handleOpen(true,index)} className='chat'>
                               <i class='far fa-comment'></i>
                            </div>
                            <Modal  open={isOpen} handleOpen={handleOpen} post={post} index={index} cIndex={cInd} />
                        </div>
                        
                    </React.Fragment>
                )
            })
        }
    </div>
   }
    </>
  )
}
export default Posts