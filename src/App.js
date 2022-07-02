import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import './App.css';
import Feed from './components/Feed';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Profile from './components/pages/profile/Profile'
import Signup from './components/Signup';
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
    
      <ThemeProvider theme={(theme === 'light') ? lightTheme : darkTheme}>
        <BrowserRouter>
          <Paper>
            
            <Switch>
              <PrivateRoute2  path="/login" comp={Login} />
              <PrivateRoute  path="/feed" comp={Feed} />
              <PrivateRoute  path="/profile/:id" comp={Profile} />
              <PrivateRoute2  path="/signup" comp={Signup} />
              <Redirect from="/" to="/feed"/>
              <Route>
                <PageNotFound/>
              </Route>
            </Switch>
          </Paper>
        </BrowserRouter>
      </ThemeProvider>
    
    
  );
}
function PrivateRoute(props){
  let Component = props.comp;
  let contextObj = useContext(AuthContext);
  return (
    <Route
      {...props}
      render={
        (props) => {
          return contextObj.cUser != null ? <Component {...props}></Component> :
          <Redirect {...props} to="/login"></Redirect>
        }
      }
    ></Route>
  )
}
function PrivateRoute2(props){
  let Component = props.comp;
  let contextObj = useContext(AuthContext);
  return (
    <Route
      {...props}
      render = {
        (props) => {
          return contextObj.cUser ==null ? <Component {...props}></Component> : 
          <Redirect {...props} to="/feed"></Redirect>
        }
      }
    ></Route>
  )
}
export default App;
