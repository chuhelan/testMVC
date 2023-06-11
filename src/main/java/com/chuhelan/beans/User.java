package com.chuhelan.beans;

import lombok.Data;

import java.util.Date;

@Data
public class User {
    private String userCode;
    private String password;
    private String RealName;
    private String Email;
    private String sex;
    private String session;
    private Date sessionDie;
}
