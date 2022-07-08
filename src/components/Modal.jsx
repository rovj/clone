import React from 'react'
import "../styles/Modal.css"
import ReactDOM from 'react-dom';
import ChatBox from './ChatBox';
function Modal({open,handleOpen,post,index,cIndex}) {
  
  return (
    <> 
        {(open==true && cIndex==index)  &&
        <><span className='close' onClick={()=>handleOpen(false)}><i class="fa-regular fa-circle-xmark"></i></span>
        <div className='back'/>
        <div className='container-modal'>
            <div className='video-wrapper'>
                <>
                    <video  src={post.pUrl} className="videos-styling"   autoPlay  muted="muted" controls>

                    </video>
                </>
            </div>
            <div className='chat-container'>
                <ChatBox post={post}/>
            </div>
        </div></>}
    </>
  )
}

export default Modal