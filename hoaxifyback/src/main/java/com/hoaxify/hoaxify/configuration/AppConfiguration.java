package com.hoaxify.hoaxify.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "hoaxify")
public class AppConfiguration {
	
	String uploadPath;

	String profileImagesFolder = "profile";
	
	String attachmentsFolder = "attachments";
	
	public String getUploadPath() {
		return uploadPath;
	}

	public void setUploadPath(String uploadPath) {
		this.uploadPath = uploadPath;
	}

	public String getFullProfilImagePath() {
		return this.uploadPath + "/" + this.profileImagesFolder;
	}

	public String getProfileImagesFolder() {
		return profileImagesFolder;
	}

	public void setProfileImagesFolder(String profileImagesFolder) {
		this.profileImagesFolder = profileImagesFolder;
	}

	public String getFullAttachmentsPath() {
		return this.uploadPath + "/" + this.attachmentsFolder; 
	}
	
	
}
