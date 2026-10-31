package com.empatd.attendance.reposetory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.empatd.attendance.entity.employee;

public interface employeereposetory extends JpaRepository<employee, Integer> {

	public boolean existsByEmailIgnoreCase(String email);
	
	public boolean existsByNumber(long number);
	
	 public employee findByQrtoken(String qrtoken);
	
}
