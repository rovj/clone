import React, { useEffect, useState } from "react";
import { query, orderBy, limit, QuerySnapshot } from "firebase/firestore";
import { firestore } from "../Firebase";
import { collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import Modal from "./Modal";
import Video from "./Video";
import Like from "./Like";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import "../styles/Posts.css";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";
import { getDocs } from "firebase/firestore";

const Posts = ({ user }) => {
  const [posts, setPosts] = useState(null);
  const [prePosts,setPrePosts] = useState(null);
  let [isOpen, setIsOpen] = useState(false);
  let [userList, setUserList] = useState(null);
  let [cInd, setCIndex] = useState(0);
  let contextObj = useContext(AuthContext);
  let [seenPosts,setSeenPosts] = useState(null);
  let navigate = useNavigate();
  // console.log("post=>***********************************");
  // console.log(posts);
  // console.log("pre=>-------------------");
  // console.log(prePosts);
  const handleOpen = (val, ind) => {
    setCIndex(ind);
    setIsOpen(val);
  };
  const handleVisit = (user) => {
    contextObj.setVisitedUser(user);
    navigate("/visit/" + user.docId);
  };
  useEffect(()=>{
    if(contextObj.seenPosts!==null){
      setSeenPosts(contextObj.seenPosts);
    }
  },[contextObj.seenPosts])
  useEffect(()=>{
    if(posts!=null){
      if(prePosts!=null && prePosts.length<posts.length && prePosts[0].postId !== posts[0].postId){
        const topLink = document.getElementById(`#${posts[0].postId}`);
        topLink.click();
      }
      setPrePosts(posts);
    }
  },[posts])
  useEffect(() => {
    setUserList(contextObj.userList.slice(0, 5));
  }, [contextObj.userList]);
  useEffect(() => {
    if (contextObj.user) {
      let postArr = [];
      const postQuery = query(collection(firestore, "posts"), orderBy("createdAt"));
      const unsub = onSnapshot(postQuery, (querySnapshot) => {
        postArr = [];
        querySnapshot.forEach((doc) => {
          let data = { ...doc.data(), postId: doc.id };
          if(data.userId === contextObj.user.docId){
            postArr.unshift(data);
          }
          else{
            postArr.push(data);
          }
        });
        // console.log("----------------------------");
        // console.log(posts);
        // console.log("-----------------------------");
        // if(posts){
        //   console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        //   console.log(postArr);
        //   console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        //   if(postArr.length > posts.length && posts[0].postId != postArr[0].postId ){
        //     console.log("*******************************");
        //     console.log(postArr);
        //     console.log("*******************************");
        //     window.scrollTo(0, 0);
        //   }
        // }
        //console.log("/////////////////////////////////////////");
        setPosts(postArr);
        //console.log("/////////////////////////////////////////");
      });
      return () => {
        unsub();
      };
    }
  }, [contextObj.user?.docId]);

  const callback = (entries) => {
    entries.forEach((entry) => {
      let ele = entry.target.childNodes[0];
      ele.play().then(() => {
        if (!ele.paused && !entry.isIntersecting) {
          ele.pause();
        }
      });
    });
  };
  let observer = new IntersectionObserver(callback, { threshold: 0.6 });

  useEffect(() => {
    const elements = document.querySelectorAll(".videos ");
    elements.forEach((element) => {
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
    };
  }, [posts, user]);

  return (
    <>
      {(posts == null || user == null || seenPosts==null) ? (
        <div class="loader">
          <svg className="circular">
            <circle
              class="path"
              cx="50"
              cy="50"
              r="0"
              fill="none"
              stroke-width="5"
              stroke-miterlimit="10"
            ></circle>
          </svg>
        </div>
      ) : (
        <div className="post-container">
          <div className="post-left-container"></div>
          <div id="video-container-box" className="video-container">
            {posts
              .filter((post) => {
              //  console.log(seenPosts);
              //  console.log("boolean value => "+((seenPosts[post.postId])?(!seenPosts[post.postId].includes(contextObj.user.docId)) : true));
              //  console.log("another boolean => "+(contextObj.user.following.includes(post.userId) || contextObj.user.docId===post.userId));
              //  console.log("final value => "+(((contextObj.user.following.includes(post.userId) || contextObj.user.docId===post.userId)) && ((seenPosts[post.postId])?(!seenPosts[post.postId].includes(contextObj.user.docId)) : true)) )
                return (
                  (contextObj.user.following.includes(post.userId) ||
                    contextObj.user.docId === post.userId) &&
                  (seenPosts[post.postId]
                    ? !seenPosts[post.postId].includes(contextObj.user.docId)
                    : true)
                );
              })
              .map((post, index) => {
                return (
                  <React.Fragment key={index} >
                    <a href={`#${post.postId}`} id={`#${post.postId}`} style={{display : "none"}}/>
                    <div className="videos" id={post.postId}>
                      <Video src={post.pUrl} post={post} />
                      <div class="fa">
                        <img className="img_reel" src={post.uProfile} />
                        <h4 className="name">{post.uName}</h4>
                      </div>
                      <div className="like">
                        <Like user={user} post={post} />
                      </div>
                      <div
                        onClick={() => handleOpen(true, index)}
                        className="chat"
                      >
                        <i class="far fa-comment"></i>
                      </div>
                      <Modal
                        open={isOpen}
                        handleOpen={handleOpen}
                        post={post}
                        index={index}
                        cIndex={cInd}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
          <div className="post-right-container">
            {!userList ? (
              <div class="loader">
                <svg className="circular">
                  <circle
                    class="path"
                    cx="50"
                    cy="50"
                    r="0"
                    fill="none"
                    stroke-width="5"
                    stroke-miterlimit="10"
                  ></circle>
                </svg>
              </div>
            ) : (
              userList.map((user, index) => {
                return (
                  <div onClick={() => handleVisit(user)}>{user.fullname}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Posts;
