package com.empatd.attendance.DTO;

public class signupresponse {

	private int empid;
    private String name;
    private String email;
    private boolean emailSent;
    private String message;

    public signupresponse() {
    }

    public signupresponse(
            int empid,
            String name,
            String email,
            boolean emailSent,
            String message) {

        this.empid = empid;
        this.name = name;
        this.email = email;
        this.emailSent = emailSent;
        this.message = message;
    }

    public int getEmpid() {
        return empid;
    }

    public void setEmployeeId(int empid) {
        this.empid = empid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEmailSent() {
        return emailSent;
    }

    public void setEmailSent(boolean emailSent) {
        this.emailSent = emailSent;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
