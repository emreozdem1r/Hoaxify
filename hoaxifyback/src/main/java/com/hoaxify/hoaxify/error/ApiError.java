package com.hoaxify.hoaxify.error;


import java.util.Date;
import java.util.Map;
public class ApiError {
	
	private long timestampt = new Date().getTime();
	
	private int status;
	
	private String message;
	
	private String url;

	private Map<String, String> validationErrors;
	
	
	
	public Map<String, String> getValidationErrors() {
		return validationErrors;
	}

	public void setValidationErrors(Map<String, String> validationErrors) {
		this.validationErrors = validationErrors;
	}

	public long getTimestampt() {
		return timestampt;
	}

	public void setTimestampt(long timestampt) {
		this.timestampt = timestampt;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public ApiError(int status, String message, String url) {
		super();
		this.status = status;
		this.message = message;
		this.url = url;
	}
	
	public ApiError() {
		
	}

}
