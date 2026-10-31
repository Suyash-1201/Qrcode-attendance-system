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


	    long count = adminrepo.count();

	    

	    if (count <= 1) {
	        throw new RuntimeException("Cannot delete the last admin");
	    }

	    adminrepo.delete(value);

	    boolean exists = adminrepo.existsById(id);

	    System.out.println("ADMIN STILL EXISTS: " + exists);

	    if (exists) {
	        throw new RuntimeException("Admin deletion failed");
	    }

	    System.out.println("ADMIN DELETED SUCCESSFULLY");
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
