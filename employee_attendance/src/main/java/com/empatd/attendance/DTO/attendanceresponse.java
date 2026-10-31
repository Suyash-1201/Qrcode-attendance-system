package com.empatd.attendance.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class attendanceresponse {

	private int id;
	private int attendanceid;
	private String name;
	private String email;
	private LocalDate attendancedate;
	private LocalDateTime checkin;
	private LocalDateTime checkout;
	private String message;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getAttendanceid() {
		return attendanceid;
	}
	public void setAttendanceid(int attendanceid) {
		this.attendanceid = attendanceid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public LocalDate getAttendancedate() {
		return attendancedate;
	}
	public void setAttendancedate(LocalDate attendancedate) {
		this.attendancedate = attendancedate;
	}
	public LocalDateTime getCheckin() {
		return checkin;
	}
	public void setCheckin(LocalDateTime checkin) {
		this.checkin = checkin;
	}
	public LocalDateTime getCheckout() {
		return checkout;
	}
	public void setCheckout(LocalDateTime checkout) {
		this.checkout = checkout;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	
	
}
