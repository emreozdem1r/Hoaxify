import React from 'react'
import { render, fireEvent, waitForDomChange, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopBar  from './TopBar';
import {MemoryRouter} from 'react-router-dom'
import Topbar from './TopBar';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';




const defaultState = {
    id : 0,
    username : '',
    displayName : '',
    image : '',
    password : '',
    isLoggedIn : false
};
const loggedInState = {
    id : 1,
    username : 'user1',
    displayName : 'display1',
    image : 'profile1.png',
    password : 'P4ssword',
    isLoggedIn : true
};

const setup = (state = defaultState) => {
    const store = createStore(authReducer, state);
    return render (
        <Provider store = {store}>
            <MemoryRouter>
                <Topbar/>
            </MemoryRouter>
        </Provider>
       
    )
}

describe('TopBar', () => {
    describe('Layout', () => {
        it('has application image', () => {
        
            const {container} = setup()
            const image = container.querySelector('img')
            expect(image.src).toContain('hoaxify-logo.png')

        })
        it('has link to home from logo', () => {
        
            const {container} = setup()
            const image = container.querySelector('img')
            expect(image.parentElement.getAttribute('href')).toBe('/')

        })
        /*it('has link to signup', () => {
        
            const {queryByText} = setup()
            const signupLink = queryByText('Sign Up')
            expect(signupLink.getAttribute('href')).toBe('/signup')

        })
        it('has link to login', () => {
        
            const {queryByText} = setup()
            const loginLink = queryByText('Login')
            expect(loginLink.getAttribute('href')).toBe('/login')

        })*/
        it('has link to logout when user logged in', () => {
        
            const {queryByText} = setup(loggedInState)
            const logoutLink = queryByText('Logout')
            expect(logoutLink).toBeInTheDocument();
        })
        it('has link to user profile when user logged in', () => {
        
            const {queryByText} = setup(loggedInState)
            const profileLink = queryByText('My Profile')
            expect(profileLink.getAttribute('href')).toBe('/user1');
        })

    })
})

describe("Interactions", () => {
    it('displays the login and signup when user click logut', () => {
        const {queryByText} = setup(loggedInState);
        const logoutLink = queryByText('Logout');
        fireEvent.click(logoutLink);

        const loginLink = queryByText('Login');
        expect(loginLink).toBeInTheDocument();
    })
})