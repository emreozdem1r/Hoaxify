import React from 'react'
import {render, queryByText, queryByTestId, waitForElement, fireEvent} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import App from './App'
import { Provider } from 'react-redux';
import axios from 'axios';
import configureStore from '../redux/configureStore'



beforeEach(() => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization']
})

const setup = (path) =>{
    const store = configureStore(false);
    return render(
        <Provider store = {store}>
            <MemoryRouter initialEntries={[path]}>
                <App/>
            </MemoryRouter>
        </Provider>
    )
  }
describe('App', () => {
    const changeEvent = (content) => {
        return {
            target: {
                value: content
            }
        }
    };
    it('displays homepage when url is /', () => {
            const { queryByTestId } = setup('/')
            const homePageDiv = queryByTestId('homepage');
            expect(homePageDiv).toBeInTheDocument()
    })
    it('displays LoginPage when url is /login', () =>{
        const { container } = setup('/login')
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent("Login")
    })
    
    it('displays only LoginPage when url is /login', () =>{
        const { queryByTestId } = setup('/login')
        expect(queryByTestId('homepage')).not.toBeInTheDocument();
    })

    it('displays UserSignupPage when url is /signup', () =>{
        const { container } = setup('/signup')
        const header = container.querySelector('h1')
        expect(header).toHaveTextContent("Sign Up")
    })
    it('displays homepage when url is other than /, /login or /signup', () => {
        const { queryByTestId } = setup('/user1')
        expect(queryByTestId('userpage')).toBeInTheDocument()
    })

    it('displays MyProfile on TopBar after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login')
        
        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            }
        }
        const usernameInput = queryByPlaceholderText('Your username')
        fireEvent.change(usernameInput, changeEvent('user1'))
        const passwordInput = queryByPlaceholderText('Your password')
        fireEvent.change(passwordInput, changeEvent('P4ssword'))
        const button = container.querySelector('button') 

        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display',
                image: 'profile1.png'
            }
        });
        fireEvent.click(button);

        const myProfileLink = await waitForElement(() => queryByText('My Profile'));
        expect(myProfileLink).toBeInTheDocument();
    })
    it('displays MyProfile on TopBar after signup success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/signup');
        const displayNameInput = queryByPlaceholderText('Your display name');
        const usernameInput = queryByPlaceholderText('Your username');
        const passwordInput = queryByPlaceholderText('Your password');
        const passwordRepeat = queryByPlaceholderText('Repeat your password');

        fireEvent.change(displayNameInput, changeEvent('display1'));
        fireEvent.change(usernameInput, changeEvent('user1'));
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

        const button = container.querySelector('button');
        axios.post = jest.fn().mockResolvedValueOnce({
            data: {
                message: 'User saved'
            }
        }).mockResolvedValueOnce({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        });

        fireEvent.click(button);

        const myProfileLink = await waitForElement(() => queryByText('My Profile'));
        expect(myProfileLink).toBeInTheDocument();
    });
    it('saves logged in user data to localStorage after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login');
        const usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('user1'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');
        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        });
        fireEvent.click(button);

        await waitForElement(() => queryByText('My Profile'));
        const dataInStore = JSON.parse(localStorage.getItem('hoax-auth'));
        expect(dataInStore).toEqual({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'P4ssword',
            isLoggedIn: true
        });
    })
    it('displays logged in topBar when storage has logged in user data', () => {
        localStorage.setItem('hoax-auth',JSON.stringify({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'P4ssword',
            isLoggedIn: true
        })
        );
        const { queryByText } = setup('/');
        const myProfileLink = queryByText('My Profile');
        expect(myProfileLink).toBeInTheDocument();
    })
    it('set axios authorization with Base64 encoded user credentials after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login');
        const usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('user1'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');
        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        });
        fireEvent.click(button);

        await waitForElement(() => queryByText('My Profile'));
        const axiosAuthorization = axios.defaults.headers.common['Authorization'];

        const encoded = btoa('user1:P4ssword');
        const expectedAuthorization = `Basic ${encoded}`;
        expect(axiosAuthorization).toBe(expectedAuthorization);
    })
    it('set axios authorization with Base64 encoded user credentials when storage has logged in user data', () => {
        localStorage.setItem('hoax-auth',JSON.stringify({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'P4ssword',
            isLoggedIn: true
        })
        );
        setup('/');
        const axiosAuthorization = axios.defaults.headers.common['Authorization'];
        const encoded = btoa('user1:P4ssword');
        const expectedAuthorization = `Basic ${encoded}`;
        expect(axiosAuthorization).toBe(expectedAuthorization);
    })
    it('removes axios authorization header when user logout', () => {
        localStorage.setItem('hoax-auth',JSON.stringify({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'P4ssword',
            isLoggedIn: true
        })
        );
        const { queryByText } = setup('/');
        fireEvent.click(queryByText('Logout'))
        const axiosAuthorization = axios.defaults.headers.common['Authorization'];
        expect(axiosAuthorization).toBeFalsy();

    })
    
})

