package com.empatd.attendance.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.empatd.attendance.DTO.attendanceresponse;
import com.empatd.attendance.DTO.scanrequest;
import com.empatd.attendance.entity.attendance;
import com.empatd.attendance.service.attendanceservice;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class attendancecontroller {

	@Autowired
	private attendanceservice atserv;
	
	@PostMapping("/attendance/scan")
	public ResponseEntity<attendanceresponse> scan(@Valid @RequestBody scanrequest req){
		return ResponseEntity.ok(atserv.scan(req));
	}
	
	
	@GetMapping("/attendance/today")
	public ResponseEntity<List<attendance>> gettodaysattendance(){
		
		List<attendance> atlist=atserv.gettodayschekin();
		
		return ResponseEntity.ok(atlist);
	}
}
