package com.empatd.attendance.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class scanrequest {

	@NotBlank(message = "Qr code is required")
	private String qrtiken;
	
	private double lat1;
	private double lon1;

	public String getQrtiken() {
		return qrtiken;
	}

	public void setQrtiken(String qrtiken) {
		this.qrtiken = qrtiken;
	}

	public double getLat1() {
		return lat1;
	}

	public void setLat1(double lat1) {
		this.lat1 = lat1;
	}

	public double getLon1() {
		return lon1;
	}

	public void setLon1(double lon1) {
		this.lon1 = lon1;
	}
	
	
	
}
