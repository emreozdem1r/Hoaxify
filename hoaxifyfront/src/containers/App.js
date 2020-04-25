import React from 'react';
import { Route, Switch} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserSignupPage from '../pages/UserSignupPage';
import { render } from '@testing-library/react';
import UserPage from '../pages/UserPage';
import * as apiCalls from '../api/apiCalls';
import Topbar from '../components/TopBar';


function App() {
  return (
    <div>
      <Topbar />
    <div className = "container">
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/signup" component={UserSignupPage}/>
        <Route path="/:username" component={UserPage}/>
      </Switch>
    </div>
    </div>
  );
}

export default App;
