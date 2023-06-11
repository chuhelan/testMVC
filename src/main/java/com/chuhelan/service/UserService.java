package com.chuhelan.service;


import com.chuhelan.beans.User;

public interface UserService {

    int register_user(User user);

    String login_by_key(String login_key, String password);

    String select_userCode_by_user_key(String loginKey);

    boolean verify_token_by_userCode(String userCode, String token);

    User select_user_by_userCode(String userCode);

    int delete_user_by_userCode(String userCode);

    int update_user_by_userCode(String userCode, String realName, String sex);

    int update_userPassword_by_userCode(String userCode, String password);
}
