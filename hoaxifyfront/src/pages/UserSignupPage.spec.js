import React from 'react'
import { render, fireEvent, waitForDomChange, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { UserSignupPage } from './UserSignupPage';


describe('UserSignupPage', () => {
    describe('Layout', () => {
        it('has header of Sign up', () => {
            const { container } = render(<UserSignupPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up');
        });
        it('has input for display name', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText('Your display name');
            expect(displayNameInput).toBeInTheDocument();
        })
        it('has input for username', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();
        })
        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        })
        it('has input for password repeat', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage/>);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeat).toBeInTheDocument();
        })
        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');
        })
        it("has submit button", () => {
            const {container} = render(<UserSignupPage/>);
            const button = container.querySelector("button");
            expect(button).toBeInTheDocument();
        })
    });
});
describe('Interactions', () => {
    const changeEvent = (content) => {
        return {
            target: {
                value: content
            }
        }
    };
    const mockAsyncDelayed = () => {
        return jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) =>{
                setTimeout(() => {
                    resolve({});
                }, 300)
            })
        })
    }
    let button, displayNameInput, usernameInput, passwordInput, passwordRepeat;

    const setupForSubmit = (props) => {
        const rendered = render(
            <UserSignupPage {...props}/>
        );

        const { container, queryByPlaceholderText } = rendered;

        const displayNameInput = queryByPlaceholderText("Your display name")
        const usernameInput = queryByPlaceholderText("Your username")
        const passwordInput = queryByPlaceholderText("Your password")
        const passwordRepeat = queryByPlaceholderText("Repeat your password")
        
        fireEvent.change(displayNameInput, changeEvent('my-display-name'));
        fireEvent.change(usernameInput, changeEvent('my-username'));
        fireEvent.change(passwordInput, changeEvent('my-password'));
        fireEvent.change(passwordRepeat, changeEvent('my-password'));

        button = container.querySelector('button');
        return rendered;
    }
    it("sets displayName value into state", () => {
        const {queryByPlaceholderText} = render(<UserSignupPage/>);
        const displayNameInput = queryByPlaceholderText("Your display name");

        fireEvent.change(displayNameInput, changeEvent('my-display-name'))
        expect(displayNameInput).toHaveValue('my-display-name')
    })
    it("sets userName value into state", () => {
        const {queryByPlaceholderText} = render(<UserSignupPage/>);
        const usernameInput = queryByPlaceholderText("Your username");

        fireEvent.change(usernameInput, changeEvent('my-user-name'));
        expect(usernameInput).toHaveValue("my-user-name");
    })
    it("sets password value into state", () => {
        const {queryByPlaceholderText} = render(<UserSignupPage/>);
        const passwordInput = queryByPlaceholderText("Your password");

        fireEvent.change(passwordInput, changeEvent('my-password'));
        expect(passwordInput).toHaveValue("my-password");
    })
    it("sets password repeat value into state", () => {
        const {queryByPlaceholderText} = render(<UserSignupPage/>);
        const passwordRepeat = queryByPlaceholderText("Repeat your password");

        fireEvent.change(passwordRepeat, changeEvent('my-password'));
        expect(passwordRepeat).toHaveValue("my-password");
    })
    it("calls postSignup when the fields are valid and the actions are provided in props", () => {
        const actions = {
            postSignup: jest.fn().mockResolvedValueOnce({})
        }
        setupForSubmit({actions})

        fireEvent.click(button);
        expect(actions.postSignup).toHaveBeenCalledTimes(1);
    })
    /*it("does not throw exception when clicking the button when actions not provided in props", () => {
       
        setupForSubmit();
        expect(() => fireEvent.click(button)).not.toThrow();
    })*/
    it("calls post with user body when the fields are valid", () => {
        const actions = {
            postSignup: jest.fn().mockResolvedValueOnce({})
        }
        setupForSubmit({actions})
        fireEvent.click(button);
        const expectedUserObject = {
            username: "my-username",
            displayName: "my-display-name",
            password: "my-password"
        }
        expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
    })
    it("does not allow user to click the Sign Up button when there is an ongoing api call", () => {
        const actions = {
            postSignup: mockAsyncDelayed()
        }
        setupForSubmit({actions})
        fireEvent.click(button);
        
        fireEvent.click(button)
        expect(actions.postSignup).toHaveBeenCalledTimes(1);
    })
    it("displays spinner when there is ongoing api call", () => {
        const actions = {
            postSignup: mockAsyncDelayed()
        }
        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button)
    
        const spinner = queryByText('Loading...');
        expect(spinner).toBeInTheDocument();
    })   
    it("hides spinner after api call finishes with error", async() => {
        const actions = {
            postSignup: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject({
                            response:{data:{}}
                        });
                    }, 300)
                })
            })
        }

        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button)
        
        await waitForDomChange();
        const spinner = queryByText("Loading...")
        expect(spinner).not.toBeInTheDocument();
    })
    /*
    it('displays validation error for displayName when error is recieved for the field', async() => {
        const actions = {
            postSignup: jest.fn().mockRejectedValue({
                response: {
                    data: {
                        validationErrors: {
                            displayName: 'Cannot be null'
                        }
                    }
                }
            })
        }
        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button);

        const errorMessage = await waitForElement(()=> queryByText('Cannot be null'));
        expect(errorMessage).toBeInTheDocument();
    })
    */

    it('enables the signup button when password and repeat password have same value', ()=>{
        setupForSubmit();
        expect(button).not.toBeDisabled();
    })
    /*it('disables the signup button when password repeat does not match to password', ()=>{
        setupForSubmit();
        fireEvent.change(passwordRepeat, changeEvent('new-pass'));
        expect(button).toBeDisabled();
    })*/
    /*it('disables the signup button when password does not match to password repeat', ()=>{
        setupForSubmit();
        fireEvent.change(passwordInput, changeEvent('new-pass'));
        expect(button).toBeDisabled();
    })
    it('displays error style for password repeat input when password repeat mismatch', ()=>{
        const { queryByText } = setupForSubmit();
        fireEvent.change(passwordRepeat, changeEvent('new-pass'));
        const mismatchWarning = queryByText('Does not match to password')
        expect(mismatchWarning).toBeInTheDocument()
    })*/

})