import React from "react";
import { useState,useEffect } from "react";
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import {  signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc,getDoc,query,where,getDocs, onSnapshot } from "firebase/firestore"; 
import { firestore } from '../Firebase';
import { addDoc, collection } from 'firebase/firestore';
export let AuthContext = React.createContext();
export function AuthContextProvider({children}){
    let [mainLoader,setMainLoader] = React.useState(false);
    let [cUser,setUser] = useState(null);
    let [user,setUserData] = useState(null);
    let [docId,setDocId] = useState("");
    const [theme, setTheme] = React.useState('light')
    const signout = async function(){
      await signOut(auth);
      //setUser(null);
      //console.log(user);
    }
    useEffect(()=>{
      if(cUser==null){
        return;
      }
      console.log(cUser);
      const q = query(collection(firestore,"users"),where("userId","==",cUser.uid));
      const unsub = onSnapshot(q,(querySnapshot)=>{
          querySnapshot.forEach((doc)=>{
              let data = {...doc.data(),docId : doc.id}
              setUserData(data)
          })
      })
      
      return ()=>{unsub()}
    },[cUser])
    
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
          if(user){
            setUser(user);
            
          }
          else{
            setUser(null);
            setUserData(null);
          }
          setMainLoader(true);
        });
    },[]);
    return (
        <AuthContext.Provider value={{cUser,setUser,signout,user,docId,setUserData,setDocId,theme,setTheme}}>
            {mainLoader && children}
        </AuthContext.Provider>
    )
}