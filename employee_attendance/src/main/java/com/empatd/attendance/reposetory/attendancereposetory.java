package com.empatd.attendance.reposetory;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.empatd.attendance.entity.attendance;
import com.empatd.attendance.entity.employee;

public interface attendancereposetory extends JpaRepository<attendance, Integer> {

	public boolean existsByEmp_IdAndAttendancedate(int id,LocalDate attendancedate);
	
	
	
	public attendance findByEmp_IdAndAttendancedate(int id,LocalDate date);
	
	public List<attendance> findAllByAttendancedateOrderByCheckinDesc(LocalDate date);
	
	@Modifying
	@Query( value = "DELETE FROM attendance  WHERE emp_id = :id",nativeQuery = true)
	void deleteAttendanceByEmployeeId(@Param("id") int id);
}
