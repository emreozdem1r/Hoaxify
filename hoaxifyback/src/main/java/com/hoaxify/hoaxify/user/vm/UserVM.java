package com.hoaxify.hoaxify.user.vm;

import com.hoaxify.hoaxify.user.User;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UserVM {

	private long id;
	
	private String username;
	
	private String displayName;
	
	private String image;
	
	public UserVM(User user) {
		this.setId(user.getId());
		this.setUsername(user.getUsername());
		this.setDisplayName(user.getUsername());
		this.setImage(user.getImage());
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

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
