import React from 'react';
import defaultPicture from '../assets/profile.png';
import ProfilImageWithDefault from './ProfileImageWithDefault';
import Input from './Input'
import ButtonWithProgress from './ButtonWithProgress'
const ProfileCard = (props) => {
    const { displayName, username, image } = props.user;
    const showEditButton = props.isEditable && !props.inEditMode;
    
    return (
        <div className = "card center">
            <ProfilImageWithDefault 
            alt = "profile" 
            width = "200" 
            height = "200" 
            image = {image}
            className = "rounded-circle shadow"
            src = {props.loadedImage}
             />
            <div className = "card-body text-center">
               {!props.inEditMode && <h4>{`${displayName}@${username}`}</h4>}
                
                {props.inEditMode &&
                    <div className = "mb-2">
                        <Input 
                            value = {displayName}
                            label = {`Change Display Name for ${username}`}
                            onChange = {props.onChangeDisplayName}
                            
                        />
                        <input
                            className = "form-control-file mt-2"
                            type = "file" 
                            onChange = {props.onFileSelect}
                            />
                    </div>
                } 

                {showEditButton && (
                    <button className = "btn btn-outline-success" onClick = {props.onClickEdit} >
                        <i className ="fas fa-user-edit"> Edit</i>
                    </button> 
                )}    
                {props.inEditMode &&
                     (
                    <div>
                        <ButtonWithProgress
                            className = "btn btn-primary" 
                            onClick = {props.onClickSave}
                            text = {<span><i className ="fas fa-save">Save</i></span>}
                            pendingApiCall = {props.pendingUpdateCall}    
                            disabled = {props.pendingUpdateCall}
                        />
                        <button className = "btn btn-outline-second ml-1"  
                            onClick = {props.onClickCancel}
                            disabled = {props.pendingUpdateCall}
                            >
                            <i className ="fas fa-window-close">Cancel</i>
                        </button> 
                     </div>
                 )

                }   
            </div>
            
        </div>
    );

};

export default ProfileCard;