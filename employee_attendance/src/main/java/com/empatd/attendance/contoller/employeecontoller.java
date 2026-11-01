package com.empatd.attendance.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.empatd.attendance.DTO.signuprequest;
import com.empatd.attendance.DTO.signupresponse;
import com.empatd.attendance.entity.employee;
import com.empatd.attendance.service.employeeservice;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class employeecontoller {

	@Autowired
	private employeeservice empserv;
	
	@PostMapping("/employee/signup")
	public ResponseEntity<signupresponse> signup(@Valid @RequestBody signuprequest req){
		signupresponse res=empserv.signup(req);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(res);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteEmployee(
	        @PathVariable int id) {

	    empserv.deleteemployee(id);

	    return ResponseEntity.ok(
	        "Employee deleted successfully"
	    );
	}
	
	@GetMapping("/getemployees")
	public ResponseEntity<List<employee>> getallemployees(){
		return ResponseEntity.ok().body(empserv.allemployees());
	}
	
	@GetMapping("/getcode/{number}")
	public ResponseEntity<?> getempbynum(@PathVariable long number){
		
		return ResponseEntity.ok().body(empserv.getcode(number));
	}
}
