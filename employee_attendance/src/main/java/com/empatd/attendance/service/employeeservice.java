package com.empatd.attendance.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.empatd.attendance.DTO.signuprequest;
import com.empatd.attendance.DTO.signupresponse;
import com.empatd.attendance.entity.employee;
import com.empatd.attendance.reposetory.attendancereposetory;
import com.empatd.attendance.reposetory.employeereposetory;
import com.google.zxing.WriterException;

import jakarta.transaction.Transactional;

@Service
public class employeeservice {
	
	@Autowired
	private employeereposetory emprepo;
	
	@Autowired
	private qrcodeservicd qrcodeservce;
	
	@Autowired
	private emailservice emailservice;
	
	@Autowired
	private attendancereposetory atrepo;
	
	@Transactional 
	public signupresponse signup(signuprequest req) {
		String name = req.getName();
		long number = req.getMobileNumber();
		String email = req.getEmail();
		
		if (emprepo.existsByEmailIgnoreCase(email)) {
			throw new IllegalArgumentException("This email is already registered");
		}
		
		if (emprepo.existsByNumber(number)) {
			throw new IllegalArgumentException("This number is already registered");
		}
		
		String qrtoken = UUID.randomUUID().toString();
		
		employee emp = new employee();
		emp.setEmpname(name);
		emp.setEmail(email);
		emp.setNumber(number);
		emp.setQrtoken(qrtoken);
		
		emprepo.saveAndFlush(emp);
		
		byte[] qrimage;
		String testemail="patilsuyash1201@gmail.com";
		
		try {
			qrimage = qrcodeservce.generateqrcode(qrtoken);
		} catch (WriterException | IOException ex) {
			throw new IllegalStateException("Unable to generate qr code");
		}
		
		boolean emailsent = false;
		
		try {
			// This calls your updated Resend-powered email service
			emailservice.sendqrcode(testemail, name, qrimage);
			emailsent = true;
		} catch (Exception ex) {
			System.err.println("QR email sending failed: " + ex.getMessage());
		}
		
		signupresponse res = new signupresponse();
		res.setEmail(email);
		res.setEmailSent(emailsent);
		res.setName(name);
		res.setEmployeeId(emp.getId());
		
		return res;
	}
	
	@Transactional
	public void deleteemployee(int id) {
	    employee emp = emprepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Employee not found"));

	    // Delete all attendance records belonging to employee
	    atrepo.deleteAttendanceByEmployeeId(emp.getId());
	    atrepo.flush();

	    // Delete employee
	    emprepo.delete(emp);
	    emprepo.flush();
	}
	
	public List<employee> allemployees() {
		List<employee> emplist = emprepo.findAll();
		
		if (emplist == null) {
			throw new RuntimeException("No employee found");
		}
		return emplist;
	}
}