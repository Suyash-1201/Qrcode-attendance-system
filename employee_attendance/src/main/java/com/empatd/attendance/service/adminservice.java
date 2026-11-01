package com.empatd.attendance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.empatd.attendance.entity.admin;
import com.empatd.attendance.reposetory.adminreposetory;

import jakarta.transaction.Transactional;

@Service
public class adminservice {
	
	@Autowired
	private adminreposetory adminrepo;
	@Autowired
	private PasswordEncoder encodes;
	
	@Transactional
	public admin saveadmin(admin data) {
		
		if( adminrepo.existsByNumber(data.getNumber())) {
			throw new RuntimeException("Admin  already registed with this number");
			
		}
		
		admin value=new admin();
		
		value.setAdminname(data.getAdminname());
		value.setNumber(data.getNumber());
		value.setPassword(encodes.encode(data.getPassword()));
		value.setRole("admin");
		
		return adminrepo.save(value);
	}
	
	@Transactional
	public void deleteadmin(int id) {
	    admin value = adminrepo.findById(id)
	        .orElseThrow(() -> new RuntimeException("Admin not found"));

//	    // Prevent deletion of the primary super-admin email
//	    if ("patilsuyash1201@gmail.com".equalsIgnoreCase(value.get)) {
//	        throw new RuntimeException("Cannot delete super admin account");
//	    }

	    long count = adminrepo.count();

	    // Prevent deletion if this is the last admin remaining
	    if (count <= 1) {
	        throw new RuntimeException("Cannot delete the last admin");
	    }

	    // Perform deletion
	    adminrepo.delete(value);
	    
	    // Explicitly flush to execute the DELETE SQL query inside the transaction
	    adminrepo.flush();

	    System.out.println("ADMIN DELETED SUCCESSFULLY: " + id);
	}
	
	public List<admin> findalladmin() {
		return adminrepo.findAll();
	}
	
//	login admin
	public boolean loginadmin(admin data) {
		List<admin> adlist=findalladmin();
		
		for (admin a : adlist) {
			
			if(a.getNumber() == data.getNumber() && encodes.matches(data.getPassword(), a.getPassword())) {
				return true;
			}
		}
		
		return false;
	}
	
	public admin getAdminbynumber(long number) {
		
		admin data=adminrepo.findByNumber(number);
		
		if(data == null) {
			throw new RuntimeException("Admin number not valid");
		}
		
		data.setPassword(null);
		
		return data;
	}

}
