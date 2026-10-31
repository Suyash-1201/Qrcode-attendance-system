package com.empatd.attendance.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.empatd.attendance.entity.admin;
import com.empatd.attendance.service.adminservice;


@RestController
@RequestMapping("/admin")
public class admincontroller {

	@Autowired
	private adminservice adserv;
	
	@PostMapping("/save")
	public ResponseEntity<admin> saveadmins(@RequestBody admin data){
		
		admin ad=adserv.saveadmin(data);
		
		ad.setPassword(null);
		
		return ResponseEntity.ok().body(ad);
		
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteadmins(@PathVariable int id) {
		adserv.deleteadmin(id);
		return ResponseEntity.ok().body("admin deleted");
	}
	
	@GetMapping("/alladmin")
	public ResponseEntity<List<admin>> getalladmin(){
		return ResponseEntity.ok().body(adserv.findalladmin());
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> loginadmin(@RequestBody admin data){
		if(adserv.loginadmin(data)) {
			return ResponseEntity.ok().body("Login Successfull");
		}
		
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized Person");
	}
	
	@GetMapping("/getadmin/{number}")
	public ResponseEntity<?> getadminbynum(@PathVariable long number) {
		
		return ResponseEntity.ok().body(adserv.getAdminbynumber(number));
		
	}
	
}
