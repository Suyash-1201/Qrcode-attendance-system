package com.empatd.attendance.DTO;

import jakarta.validation.constraints.NotBlank;

public class scanrequest {

	@NotBlank(message = "Qr code is required")
	private String qrtiken;

	public String getQrtiken() {
		return qrtiken;
	}

	public void setQrtiken(String qrtiken) {
		this.qrtiken = qrtiken;
	}
	
	
	
}
