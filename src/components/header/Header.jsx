import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { BrowserRouter, Link, NavLink } from "react-router-dom";
import "./Header.css";
import { Box, Button, Grid } from "@mui/material";
import {
  HomeOutlined,
  PersonOutlined,
  LogoutOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  AddBoxOutlined,
  ExploreOutlined,
  InvertColors,
} from "@mui/icons-material";
import { useRef } from "react";
import {Autocomplete} from "@mui/material";
import {TextField} from "@mui/material";
import { query } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { firestore } from "../../Firebase";
import SearchBar from "../searchbar/SearchBar";

const Header = (props) => {
  let contextObj = useContext(AuthContext);
  let [id, setId] = useState("");
  let theme = contextObj.theme;
  let [profileUrl, setProfileUrl] = useState("");
  let [userList,setUserList] = useState([]);
  let setTheme = contextObj.setTheme;
  let aRef = useRef();
  
  useEffect(()=>{
    setUserList(contextObj.userList);
  },[contextObj.userList])
  useEffect(() => {
    if (contextObj.user == null) {
      setProfileUrl("");
    } else {
      setProfileUrl(contextObj.user.profileUrl);
    }
  }, [contextObj.user]);
  useEffect(() => {
    if (contextObj.user == null) {
      setId("");
    } else {
      setId(contextObj.user.docId);
    }
  }, [contextObj.user]);

  const handleAdd = () => {
    if (window.location.pathname == "/feed") {
      props.handleClick();
    } else {
      props.handleClickProfile();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <a
        href="https://about.instagram.com/blog/announcements/introducing-instagram-reels-announcement"
        ref={aRef}
        style={{ display: "none" }}
      />
      <Grid
        container
        className="header"
        sx={{ backgroundColor: "background.paper" }}
      >
        <Grid item lg={4} className="header-logo" >
          <img
            className={theme === "light" ? "light-logo" : "dark-logo"}
            src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
            height="110px"
            width="110px"
            alt=""
          />
        </Grid>
        <Box display="flex" alignItems="center" lg={4} className="header-search" justifyContent="center" >
            <SearchBar placeholder={"Search Users"} data={userList} />
        </Box>
        
        <Grid item lg={4} className="header-links" >
          
          <Grid item>
            <Link style={{ textDecoration: "none" }} to="/feed">
              <HomeOutlined sx={{ color: "text.primary", fontSize: "28px" }} />
            </Link>
          </Grid>
          <Grid item>
            <AddBoxOutlined onClick={handleAdd} />
          </Grid>
          <Grid item>
            <ExploreOutlined onClick={() => aRef.current.click()} />
          </Grid>
          <Grid item onClick={toggleTheme}>
            {theme === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
          </Grid>
          <Grid item>
            <NavLink style={{ textDecoration: "none" }} to={`/profile/${id}`}>
              <img src={profileUrl} className="user-image" />
            </NavLink>
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
