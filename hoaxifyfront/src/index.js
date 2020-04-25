import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { UserSignupPage } from './pages/UserSignupPage';
import {LoginPage} from './pages/LoginPage';
import App from './containers/App';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore'

const store = configureStore();

const loggedInState = {
    id : 1,
    username : 'user1',
    displayName : 'display1',
    image : 'profile1.png',
    password : 'P4ssword',
    isLoggedIn : true
};



ReactDOM.render(
    <Provider store = {store}>
        <HashRouter>
        <App/>
    </HashRouter>
    </Provider>,
    document.getElementById('root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
