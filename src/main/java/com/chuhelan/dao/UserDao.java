package com.chuhelan.dao;

import com.chuhelan.beans.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Mapper
@Repository
public interface UserDao {

    int register_user(User user);

    User select_user_by_userCode(String userCode);

    User select_user_by_userCodeKey(String userCode, String password);

    User select_user_by_email(String Email, String password);

    void update_token_by_email(String Email, String session, Date sessionDie);

    String select_userCode_by_Email(String loginKey);

    int delete_user_by_userCode(String userCode);

    int update_user_by_userCode(String userCode, String RealName, String sex);

    int update_userPassowrd_by_userCode(String userCode, String password);
}
