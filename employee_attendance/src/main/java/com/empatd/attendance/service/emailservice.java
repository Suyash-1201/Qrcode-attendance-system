package com.empatd.attendance.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class emailservice {

	@Autowired
	private JavaMailSender mailSender;
	
	@Value("${spring.mail.username}")
	private String mailusername;
	
	public void sendqrcode(String email,String empname,byte[] qrimage) throws MessagingException,IOException {
		
		MimeMessage message=mailSender.createMimeMessage();
		
		MimeMessageHelper helper=new MimeMessageHelper(message,true);
		
		helper.setFrom(mailusername);
		
		helper.setTo(email);
		
		helper.setSubject("Your Employee attendance Qr code");
		
		helper.setText("Hello "+empname + ",\n\n"+"Your employee attendance Qr code is attached.\n"
		+"Keep it safe and use it to mark your attendance.\n\n");
		
		ByteArrayResource attach=new ByteArrayResource(qrimage);
		
		helper.addAttachment("attendance-qr,png", attach);
		
		mailSender.send(message);
		
	}
}
