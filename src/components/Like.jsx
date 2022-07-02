import React, { useEffect, useState } from 'react'
import { firestore } from '../Firebase';
import Posts from './Posts';
import { updateDoc,doc } from 'firebase/firestore';

function Like({user,post}) {
  const [like,setLike] = useState(true);
  useEffect(()=>{
    console.log("likes => "+post.likes.length+" hi");
    let check = post.likes.includes(user.docId)?true:false;
    setLike(check);
    
  },[post]);
  const  handleClick = async ()=>{
    if(like==true){
        let narr = post.likes.filter((el)=>el!=user.docId);
        
        await updateDoc(doc(firestore, "posts", post.postId), {
            likes : narr
        })
    }
    else{
        let narr = [...post.likes,user.docId];
        
        await updateDoc(doc(firestore, "posts", post.postId), {
            likes : narr
        })
    }
  }
  return (
    <div>
        {like!=null?
        <>
         {
            like==true?<div > <i onClick={handleClick} className="far fa-solid fa-heart-o liked" ></i> <div className='likes'>{post.likes.length}</div> </div>: 
            <div ><i onClick={handleClick} className="far  fa-heart-o dislike" ></i><div className='likes'>{post.likes.length}</div> </div>
         }
        </>
        :
        <></>}
    </div>
  )
}

export default Like