
package com.empatd.attendance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.empatd.attendance.DTO.attendanceresponse;
import com.empatd.attendance.DTO.scanrequest;
import com.empatd.attendance.entity.attendance;
import com.empatd.attendance.entity.employee;
import com.empatd.attendance.reposetory.attendancereposetory;
import com.empatd.attendance.reposetory.employeereposetory;

import jakarta.transaction.Transactional;

@Service
public class attendanceservice {

    @Autowired
    private employeereposetory emprepo;

    @Autowired
    private attendancereposetory attandancerepo;
    
    @Autowired
    private distancecalculateservice geoserv;
    
    private final double gatelat2=18.3808762;
    private final double gatelon2=73.6496320;
    private final double radious=10000.0;

    @Transactional
    public attendanceresponse scan(scanrequest req) {

    	String qrtoken = req.getQrtiken();
    	
    	
    	double distance=geoserv.calculatedistance(req.getLat1(),req.getLon1(), gatelat2, gatelon2);
    	
    	if(distance > radious) {
    		throw new RuntimeException("Attendance failed: You are outside the company premises.");
    	}

        employee emp = emprepo.findByQrtoken(qrtoken);

        if (emp == null) {
            throw new RuntimeException("Employee not found");
        }

        LocalDate date = LocalDate.now();
        LocalDateTime todaytime = LocalDateTime.now();

        // Find today's attendance for this employee.
        attendance data =
            attandancerepo.findByEmp_IdAndAttendancedate(
                emp.getId(), date
            );

        attendance savedattendance;

        if (data == null) {

            // FIRST SCAN: CHECK-IN

            attendance at = new attendance();

            at.setEmp(emp);
            at.setAttendancedate(date);
            at.setCheckin(todaytime);

            savedattendance = attandancerepo.saveAndFlush(at);

        } else if (data.getCheckout() == null) {

            // SECOND SCAN: CHECK-OUT

            data.setCheckout(todaytime);

            savedattendance = attandancerepo.saveAndFlush(data);

        } else {

            // THIRD SCAN: ALREADY CHECKED OUT

            throw new RuntimeException(
                "Employee already checked in and checked out today."
            );

        }

        // Prepare response

        attendanceresponse res = new attendanceresponse();

        res.setAttendanceid(savedattendance.getId());
        res.setAttendancedate(savedattendance.getAttendancedate());
        res.setCheckin(savedattendance.getCheckin());
        res.setEmail(emp.getEmail());
        res.setName(emp.getEmpname());

        return res;
    }

    public List<attendance> gettodayschekin() {

        LocalDate date = LocalDate.now();

        List<attendance> atlist =
                attandancerepo.findAllByAttendancedateOrderByCheckinDesc(date);

        return atlist;
    }
}

