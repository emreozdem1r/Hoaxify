import React from 'react'
import {render, queryByText, waitForElement, fireEvent, waitForDomChange} from '@testing-library/react'
import UserPage from './UserPage'
import * as apiCalls from '../api/apiCalls'
import configureStore from '../redux/configureStore';
import { Provider } from 'react-redux';
const mockSucccessGetUser = {
    data:{
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
}
const mockFailGetUser = {
    response: {
        data: {
            message: 'User not found'
        }
    }
}
const match = {
    params: {
        username: 'user1'
    }
}
let store;

const setup = (props) => {
    store = configureStore(false);
    return render(
        <Provider store={store}>
            <UserPage {...props} />
        </Provider>
    );
};
const mockSuccessGetUser = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
    }
};
const mockSuccessUpdateUser = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1-update',
        image: 'profile1-update.png'
    }
};
const setUserOneLoggedInStorage = () => {
    localStorage.setItem('hoax-auth',
        JSON.stringify({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'P4ssword',
            isLoggedIn: true
        })
    );
};

const mockFailUpdateUser = {
    response: {
        data: {

        }
    }
}
describe('HomePage', () => {

    describe('Layout', () => {

        it('has root page div', () => {
            const { queryByTestId } = setup()
            const userPageDiv = queryByTestId('userpage');
            expect(userPageDiv).toBeInTheDocument()
        })
        it('displays the displayName@username when user data loaded', async() => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSucccessGetUser);
            const { queryByText } =  setup({match})
            const text = await waitForElement(() => queryByText('display1@user1')            )
            expect(text).toBeInTheDocument()
        })
        it('displays not found alert when user not found', async() => {
            apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
            const { queryByText } =  setup({match})
            const alert = await waitForElement(() => queryByText('User not found')            )
            expect(alert).toBeInTheDocument()
        })
        it('displays spinner while loading user data', () => {
            const mockDelayedResponse = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockSuccessGetUser)
                    }, 300)
                })
            })
            apiCalls.getUser = mockDelayedResponse;
            const { queryAllByText } = setup({ match });
            const spinners = queryAllByText('Loading...');
            expect(spinners.length).not.toBe(0);
        });
        it('displays the edit button when loggedInUser matches to user in url', async () => {
            setUserOneLoggedInStorage();
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
            const { queryByText } = setup({ match });
            await waitForElement(() => queryByText('display1@user1'));
            const editButton = queryByText('Edit');
            expect(editButton).toBeInTheDocument();
        });
        
    })
    describe('Lifecycle', () => {

        it('calls getUser when it is rendered', () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSucccessGetUser);
            setup({match})
            expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
        })
        it('calls getUser for user1 when it is rendered with user1 in match', () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSucccessGetUser);
            setup({match})
            expect(apiCalls.getUser).toHaveBeenCalledWith("user1");
        })
        
    })

    describe('ProfileCard Interactions', () => {
        const setupForEdit = async () => {
            setUserOneLoggedInStorage();
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
            const rendered = setup({ match });
            const editButton = await waitForElement(() => rendered.queryByText('Edit'));
            fireEvent.click(editButton);
            return rendered;
        }
        const mockDelayedUpdateSuccess = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockSuccessUpdateUser)
                    }, 300)
                })
            })
        }
        it('displays edit layout when clicking edit button ', async () => {
            const { queryByText } = await setupForEdit();
            expect(queryByText('Save')).toBeInTheDocument();
        });
        it('returns back to none edit mode after clicking cancel ', async () => {
            const { queryByText } = await setupForEdit();

            const cancelButton = queryByText('Cancel')
            fireEvent.click(cancelButton)
            expect(queryByText('Edit')).toBeInTheDocument();
        });
        it('calls updateUser api when clicking save', async () => {
            const { queryByText } = await setupForEdit();
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)
            expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
        });
        it('calls updateUser api with user id', async () => {
            const { queryByText } = await setupForEdit();
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            const userId = apiCalls.updateUser.mock.calls[0][0];
            expect(userId).toBe(1);
        });
        
        it('calls updateUser api with request body having changed displayName', async () => {
            const { queryByText, container } = await setupForEdit();
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

            const displayInput = container.querySelector('input');
            fireEvent.change(displayInput, { target: { value: 'display1-update' } });
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);
            const requestBody = apiCalls.updateUser.mock.calls[0][1];
            expect(requestBody.displayName).toBe('display1-update');
        });
        it('return to non edit mode after successfull updateUser api call', async () => {
            const { queryByText } = await setupForEdit();
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

            const saveButton = queryByText('Save')
            fireEvent.click(saveButton)

            const editButtonAfterClickingSave = await waitForElement(() => queryByText('Edit'))
            expect(editButtonAfterClickingSave).toBeInTheDocument();
        });
        
        it('returns to original displayName after its changed in edit mode but cancelled', async () => {
            const { queryByText, container } = await setupForEdit();
           
            const displayInput = container.querySelector('input');
            fireEvent.change(displayInput, { target: { value: 'display1-update' } });

            const cancelButton = queryByText('Cancel');
            fireEvent.click(cancelButton);
            
            const originalDisplayText = queryByText('display1@user1');
            expect(originalDisplayText).toBeInTheDocument()
        });
        
        it('returns to last updated displayName when display name is changed for another time but cancelled', async () => {
            const { queryByText, container } = await setupForEdit();
            let displayInput = container.querySelector('input');
            fireEvent.change(displayInput, { target: { value: 'display1-update' } });
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
            
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);
            
            const editButtonAfterClickingSave = await waitForElement(() => queryByText('Edit'));
            fireEvent.click(editButtonAfterClickingSave);
            displayInput = container.querySelector('input');
            
            fireEvent.change(displayInput, { target: { value: 'display1-update-second-time' } });
            const cancelButton = queryByText('Cancel');
            fireEvent.click(cancelButton);
            
            const lastSavedData = container.querySelector('h4');
            expect(lastSavedData).toHaveTextContent('display1-update@user1');
        });
        it('displays spinner when there is updateUser api call', async () => {
            const { queryByText } = await setupForEdit();
            apiCalls.updateUser = mockDelayedUpdateSuccess();
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);
            const spinner = queryByText('Loading...');
            expect(spinner).toBeInTheDocument();
        });
        it('disables save button when there is updateUser api call', async () => {
            const { queryByText } = await setupForEdit();
            apiCalls.updateUser = mockDelayedUpdateSuccess();
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);
            expect(saveButton).toBeDisabled();
        });
        it('disables cancel button when there is updateUser api call', async () => {
            const { queryByText } = await setupForEdit();
            apiCalls.updateUser = mockDelayedUpdateSuccess();
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);

            const cancelButton = queryByText('Cancel')
            expect(cancelButton).toBeDisabled();
        });
        it('enables save button after updateUser api call success', async () => {
            const { queryByText, container } = await setupForEdit();
            let displayInput = container.querySelector('input');
            fireEvent.change(displayInput, { target: { value: 'display1-update' } });
            apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);
            const editButtonAfterClickingSave = await waitForElement(() => queryByText('Edit'));
            fireEvent.click(editButtonAfterClickingSave);
            const saveButtonAfterSecondEdit = queryByText('Save');
            expect(saveButtonAfterSecondEdit).not.toBeDisabled();
        });
        it('enables save button after updateUser api call fails', async () => {
            const { queryByText, container } = await setupForEdit();
            let displayInput = container.querySelector('input');
            fireEvent.change(displayInput, { target: { value: 'display1-update' } });
            apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);
            const saveButton = queryByText('Save');
            fireEvent.click(saveButton);

            await waitForDomChange();

            expect(saveButton).not.toBeDisabled();
        });
    })
})

console.error = () =>{}
