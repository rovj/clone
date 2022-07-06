import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter,Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import './App.css';
import Feed from './components/Feed';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Profile from './components/pages/profile/Profile'
import Signup from './components/Signup';
import VisitedProfile from './components/pages/VisitedProfile/VisitedProfile';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import { Box, Grid, Paper, ThemeProvider, Typography } from '@mui/material';
import { darkTheme, lightTheme } from './theme/Themes';
import Header from './components/header/Header';


const App = () => {
  
  

  let location = window.location.pathname;
  let contextObj = useContext(AuthContext);
  console.log(contextObj);
  let theme = contextObj.theme;
  console.log(location)
  return (
    <BrowserRouter>
      <ThemeProvider theme={(theme === 'light') ? lightTheme : darkTheme}>
       
          <Paper>
            
            <Routes>
              <Route path="/login" element={<PrivateRoute2 comp={Login} />} ></Route>
              <Route path="/feed" element={<PrivateRoute comp={Feed}  />} ></Route>
              <Route  path="/profile/:id" element={<PrivateRoute comp={Profile}  />} ></Route>
              <Route  path="/visit/:id" element={<PrivateRoute comp={VisitedProfile}  />} ></Route>
              <Route path="/signup" element={<PrivateRoute2 comp={Signup}/>} ></Route>
              
              <Route path="/" element={<Navigate to ="/feed" />}/>
              <Route  element={<PageNotFound/>} ></Route>
            </Routes>
          </Paper>
        
      </ThemeProvider>
    </BrowserRouter>
    
    
  );
}
function PrivateRoute(props){
  let Component = props.comp;
  let contextObj = useContext(AuthContext);
  return contextObj.cUser != null ? <Component {...props}></Component> : <Navigate {...props} to ="/login" />
}
function PrivateRoute2(props){
  let Component = props.comp;
  let contextObj = useContext(AuthContext);
  return contextObj.cUser ==null ? <Component {...props}></Component> : <Navigate {...props} to ="/feed" />
}
export default App;
