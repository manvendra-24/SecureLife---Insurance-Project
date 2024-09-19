package com.insurance.request;


import lombok.Data;
@Data
public class ClaimRequest {
    
   
	
	    private String explanation;
	    private String documentId;

	    
	    public String getExplanation() {
	        return explanation;
	    }

	    public void setExplanation(String explanation) {
	        this.explanation = explanation;
	    }
	}

