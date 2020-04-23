import React from 'react';
import { Route, Switch} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserSignupPage from '../pages/UserSignupPage';
import { render } from '@testing-library/react';
import UserPage from '../pages/UserPage';
import * as apiCalls from '../api/apiCalls';
import Topbar from '../components/TopBar';
const actions = {
     postSignup: apiCalls.signup,
     postLogin: apiCalls.login
}


function App() {
  return (
    <div>
      <Topbar />
    <div className = "container">
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/login" component={(props) => <LoginPage {...props} actions = {actions}/>}/>
        <Route path="/signup" component={(props) => <UserSignupPage {...props} actions = {actions}/>}/>
        <Route path="/:username" component={UserPage}/>
      </Switch>
    </div>
    </div>
  );
}

export default App;
