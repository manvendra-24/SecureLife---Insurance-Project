package com.insurance.exceptions;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {

	
	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ErrorResponse> handleException(UnauthorizedException exc) {
		ErrorResponse error = new ErrorResponse();
		error.setStatus(HttpStatus.UNAUTHORIZED.value());
		error.setMessage(exc.getMessage());
		exc.printStackTrace();
		error.setTimeStamp(LocalDateTime.now());
		logger.error(exc.getMessage());
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleException(AccessDeniedException exc) {
		ErrorResponse error = new ErrorResponse();
		error.setStatus(HttpStatus.UNAUTHORIZED.value());
		error.setMessage(exc.getMessage());
		exc.printStackTrace();
		error.setTimeStamp(LocalDateTime.now());
		logger.error(exc.getMessage());
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(ApiException exc) {
		ErrorResponse error = new ErrorResponse();
		error.setStatus(HttpStatus.BAD_REQUEST.value());
		error.setMessage(exc.getMessage());
		exc.printStackTrace();
		error.setTimeStamp(LocalDateTime.now());
		logger.error(exc.getMessage());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        ErrorResponse error = new ErrorResponse();
		error.setStatus(HttpStatus.BAD_REQUEST.value());
		error.setMessage(ex.getMessage());
		ex.printStackTrace();
		error.setTimeStamp(LocalDateTime.now());
		logger.error(ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(ResourceNotFoundException exc) {
		ErrorResponse error = new ErrorResponse();
		error.setStatus(HttpStatus.NOT_FOUND.value());
		error.setMessage(exc.getMessage());
		exc.printStackTrace();
		error.setTimeStamp(LocalDateTime.now());
		logger.error(exc.getMessage());

		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(MethodArgumentNotValidException exc) {
		
		ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed: " + exc.getBindingResult().getFieldError().getDefaultMessage(),
                LocalDateTime.now()
        );
		
		exc.printStackTrace();
		logger.error(exc.getMessage());

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	
	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(Exception exc) {
		ErrorResponse error = new ErrorResponse();
		error.setStatus(HttpStatus.BAD_REQUEST.value());
		System.out.println(error.getStatus());
		error.setMessage(exc.getClass().getSimpleName());
		exc.printStackTrace();
		error.setTimeStamp(LocalDateTime.now());
		logger.error(exc.getMessage() + HttpStatus.BAD_REQUEST.value());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	
	
	

	
}