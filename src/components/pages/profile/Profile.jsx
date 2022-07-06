import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { query } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { firestore } from "../../../Firebase";
import { where } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import Modal from "../../Modal";
import Header from "../../header/Header";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import {LinearProgress} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc } from "firebase/firestore";
import { doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { storage } from "../../../Firebase";
import { updateDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { red } from "@mui/material/colors";

function Profile() {
  let contextObj = useContext(AuthContext);
  let [posts, setPosts] = useState([]);
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [profileUrl, setProfileUrl] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  let [cInd, setCIndex] = useState(0);
  let [username, setUsername] = useState(null);
  let [error, setError] = useState("");
  let [numFollowers, setNumFollowers] = useState(0);
  let [numFollowing, setNumFollowing] = useState(0);
  let user = contextObj.user;
  const handleClickProfile = () => {
    document.getElementById("upload-input").value = "";
    document.getElementById("upload-input").click();
  };
  const handleSignOut = () => {
    contextObj.signout();
  };
  const handleOpen = (val, ind) => {
    setCIndex(ind);
    setIsOpen(val);
  };
  const apply = () => {
    document.getElementById("pb").style.display = "block";
  };
  const remove = () => {
    document.getElementById("pb").style.display = "none";
  };
  useEffect(() => {
    if (contextObj.user != null) {
      let temp = [];
      setName(contextObj.user.fullname);
      const unsub2 = onSnapshot(doc(firestore, "users", contextObj.user.docId), (doc) => {
        setNumFollowers(doc.data().followers.length);
        setNumFollowing(doc.data().following.length)
      });
      let nameArr = contextObj.user.fullname.split(" ");
      let tempUserName = "";
      nameArr.forEach((name)=>{
        tempUserName = tempUserName + name.toLowerCase() + "_"
      })
      tempUserName = tempUserName + (contextObj.user.email.length);
      setUsername(tempUserName);

      setProfileUrl(contextObj.user.profileUrl);
      const q = query(
        collection(firestore, "posts"),
        where("userId", "==", contextObj.user.docId),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        temp = [];
        querySnapshot.forEach((doc) => {
          let data = { ...doc.data(), postId: doc.id };
          temp.push(data);
        });
        setPosts(temp);
      });
      return () => {
        unsub();
        unsub2();
      };
    }
  }, [contextObj.user]);
  const handleChangeProfile = (file) => {
    console.log(file);
    if (file == null) {
      setError("Please upload a file");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (file.size / (1024 * 1024) > 100) {
      setError("Please select a file less than 100MB");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    apply();
    let uid = uuidv4();
    const storageRef = ref(storage, `/users/${uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        setError(error);

        setTimeout(() => {
          setError("");
        }, 2000);
        remove();
        return;
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc((collection(firestore,"seenposts")),{postId : "" , visitedUsers : []}).then((seenRef)=>{
            let obj = {
              likes: [],
              comments: [],
              pId: uid,
              pUrl: downloadURL,
              uName: user.fullname,
              uProfile: user.profileUrl,
              userId: user.docId,
              createdAt: Timestamp.now(),
              seenpost : seenRef.id
            }
            addDoc(collection(firestore, "posts"), obj)
            .then(async (ref) => {
              let newArr = [...user.postIds, ref.id];
              await updateDoc(doc(firestore, "users", user.docId), {
                postIds: newArr,
              })
              await updateDoc(doc(firestore,"seenposts",seenRef.id),{
                postId : ref.id
              })
            })
            .then(() => {
              remove();
            })
            .catch((err) => {
              setError(err.message);
              setTimeout(() => {
                setError("");
              }, 2000);
              remove();
            });
          })
        });
      }
    );
  };
  return (
    <>
      <Header handleClickProfile={handleClickProfile} />
      <Grid
        className="profile-container"
        sx={{ backgroundColor: "background.paper" }}
      >
        <Grid container lg={12} className="profile-details">
          <Grid item lg={3} className="profile-image">
            <img src={profileUrl} />
          </Grid>
          <Grid container lg={9} className="profile-content-container">
            <Grid container lg={12} className='profile-content'>
              <Grid item >
                <Typography variant="h5" sx={{ fontWeight: "normal" }}>
                  {username}
                </Typography>
              </Grid>
              <Grid item >
                <Button
                  variant="outlined"
                  sx={{
                    color: "text.primary",
                    textTransform: "capitalize",
                    padding: "1px 10px",
                    borderColor: "text.secondary",
                    fontSize: "12px",
                  }}
                >
                  Edit Pofile
                </Button>
              </Grid>
              <Grid item >
                <Settings />
              </Grid>
              <Grid item >
                <Logout onClick={handleSignOut} />
              </Grid>
            </Grid>
            <Grid container lg={12} className='profile-stats' >
              <Grid item  >
                <Typography variant="h6" sx={{ fontWeight: "normal", fontSize: '14px' }}>
                  <Typography variant="strong" sx={{ fontWeight: "bold", fontSize: '14px' }}>{posts.length}</Typography> &nbsp;posts
                </Typography>
              </Grid>
              <Grid item >
                <Typography variant="h6" sx={{ fontWeight: "normal", fontSize: '14px' }}>
                  <Typography variant="strong" sx={{ fontWeight: "bold", fontSize: '14px' }}>{numFollowers}</Typography> &nbsp;followers
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: "normal", fontSize: '14px' }}>
                  <Typography variant="strong" sx={{ fontWeight: "bold", fontSize: '14px' }}>{numFollowing}</Typography> &nbsp;following
                </Typography>
              </Grid>
            </Grid>
            <Grid container lg={12} className='profile-stats' >
              <Typography variant="h6" sx={{ fontWeight: "500", fontSize: '15px' }}>{name}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} className="profile-posts" sx={{ margin: '30px 0' }}><Divider /></Grid>
        <LinearProgress id="pb" className="progressbar" color="inherit" sx={{display:"none"}} />
        <input
          type="file"
          accept="video/*"
          id="upload-input"
          onChange={(e) => handleChangeProfile(e.target.files[0])}
          style={{ display: "none" }}
        />
        {error != "" && <div>{error}</div>}
        <Grid container lg={12} className="profile-posts">
          {
            posts.map((post,index) => {
              return <Grid item lg={2.6}>
                        <video onClick={() => handleOpen(true,index)} src={post.pUrl} className="profile-videos"></video>
                        <Modal open={isOpen} handleOpen={handleOpen} post={post} index={index} cIndex={cInd} />
                    </Grid>
            })
          }
        </Grid>
      </Grid>
    </>

  );
}

export default Profile;
