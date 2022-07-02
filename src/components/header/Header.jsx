import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import "./Header.css"
import { Box, Grid } from '@mui/material'
import { HomeOutlined, PersonOutlined, LogoutOutlined, LightModeOutlined, DarkModeOutlined, AddBoxOutlined,  ExploreOutlined, InvertColors } from '@mui/icons-material'
import { useRef } from 'react';


const Header = (props) => {
    let contextObj = useContext(AuthContext);
    let [id,setId] = useState("");
    let theme = contextObj.theme;
    let [profileUrl,setProfileUrl] = useState("");
    let setTheme = contextObj.setTheme;
    let {handleClick} = props;
    let aRef = useRef();

    useEffect(()=>{
        if(contextObj.user==null){
            setProfileUrl("");
        }
        else{
            setProfileUrl(contextObj.user.profileUrl)
        }
    },[contextObj.user])
    useEffect(()=>{
        if(contextObj.user==null){
            setId("");
        }
        else{
            setId(contextObj.user.docId);
        }
    },[contextObj.user])
    const handleSignOut = () =>{
        contextObj.signout();
    }

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }
    
    return (
        <>
            <a href="https://about.instagram.com/blog/announcements/introducing-instagram-reels-announcement" ref={aRef} style={{display:"none"}}/>
            <Grid container className='header' sx={{ backgroundColor: 'background.paper' }}>
                <Grid item lg={6} className='header-logo'>
                    <img className={theme === 'light' ? "light-logo" : "dark-logo"} src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" height="110px" width="110px" alt=""  />
                </Grid>
                <Grid item lg={6} className='header-links'>
                    <Grid item><Link style={{ textDecoration: 'none' }} to='/feed'><HomeOutlined  sx={{ color: 'text.primary', fontSize: '28px' }}/></Link></Grid>
                    <Grid item><AddBoxOutlined onClick={handleClick} /></Grid>
                    <Grid item><ExploreOutlined onClick={()=> aRef.current.click()}/></Grid>
                    <Grid item onClick={toggleTheme}>{ theme === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}</Grid>
                    <Grid item><Link style={{ textDecoration: 'none' }} to={`/profile/${id}`}><img src={profileUrl} className='user-image' /></Link></Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Header