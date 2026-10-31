package com.empatd.attendance.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class attendance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "emp_id")
	private employee emp;
	private LocalDate attendancedate;
	private LocalDateTime checkin;
	private LocalDateTime checkout;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public employee getEmp() {
		return emp;
	}
	public void setEmp(employee emp) {
		this.emp = emp;
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
	
	
	
}
