package com.insurance.exceptions;

import java.time.LocalDateTime;

public class ErrorResponse {

	private int status;
	private String message;
	private LocalDateTime timeStamp;
	
	public ErrorResponse(int status, String message, LocalDateTime localDateTime) {
		super();
		this.status = status;
		this.message = message;
		this.timeStamp = localDateTime;
	}

	public ErrorResponse() {
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

	public LocalDateTime getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(LocalDateTime timeStamp) {
		this.timeStamp = timeStamp;
	}
}