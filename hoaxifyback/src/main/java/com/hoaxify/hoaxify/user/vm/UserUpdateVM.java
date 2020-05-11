package com.hoaxify.hoaxify.user.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.hoaxify.hoaxify.shared.ProfileImage;

public class UserUpdateVM {

	@NotNull
	@Size(min = 4, max = 255)
	private String displayName;
	
	@ProfileImage
	private String image;

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}
	
	
}
