import React from 'react'
import { render, fireEvent, waitForDomChange, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopBar  from './TopBar';
import {MemoryRouter} from 'react-router-dom'
import Topbar from './TopBar';

const setup = () => {
    return render (
        <MemoryRouter>
            <Topbar/>
        </MemoryRouter>
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
            const loginLİnk = queryByText('Login')
            expect(loginLink.getAttribute('href')).toBe('/login')

        })*/
    })
})