package com.empatd.attendance.reposetory;

import org.springframework.data.jpa.repository.JpaRepository;

import com.empatd.attendance.entity.admin;

public interface adminreposetory extends JpaRepository<admin, Integer> {

	public admin findByNumber(long number);
	
	boolean existsByNumber(long number);
}
