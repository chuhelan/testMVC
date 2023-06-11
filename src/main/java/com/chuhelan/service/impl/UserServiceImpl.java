package com.chuhelan.service.impl;

import com.chuhelan.beans.User;
import com.chuhelan.dao.UserDao;
import com.chuhelan.service.UserService;
import com.chuhelan.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    StringUtil stringUtil = new StringUtil();

    @Override
    public int register_user(User user) {
        if (userDao.select_user_by_userCode(user.getUserCode()) == null) {
            userDao.register_user(user);
            return 200;
        } else {
            return 302;
        }
    }

    @Override
    public String login_by_key(String login_key, String password) {

        User user = null;

        if (stringUtil.isEmail(login_key)) {
            user = userDao.select_user_by_email(login_key, password);
        } else if (stringUtil.isUserCode(login_key)) {
            user = userDao.select_user_by_userCodeKey(login_key, password);
        }

        if (user == null) {
            return "404";
        }

        String user_session = UUID.randomUUID().toString();
        user_session = user_session.replace("-", "");

        Date user_sessionDietime = new Date();
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(user_sessionDietime);
        calendar.add(Calendar.DATE, 3);
        user_sessionDietime = calendar.getTime();

        userDao.update_token_by_email(user.getEmail(), user_session, user_sessionDietime);
//            返回token
        return user_session;

    }

    @Override
    public String select_userCode_by_user_key(String loginKey) {

        if (stringUtil.isUserCode(loginKey)) {
            return loginKey;
        } else {
            return userDao.select_userCode_by_Email(loginKey);
        }

    }

    @Override
    public boolean verify_token_by_userCode(String userCode, String token) {
        User user = userDao.select_user_by_userCode(userCode);
//        return (user.getSession().equals(token)) && (new Date().before(user.getSessionDie()));
        if (user != null && user.getSession() != null && user.getSessionDie() != null) {
            return user.getSession().equals(token) && new Date().before(user.getSessionDie());
        } else {
            return false;
        }
    }

    @Override
    public User select_user_by_userCode(String userCode) {
        return userDao.select_user_by_userCode(userCode);
    }

    @Override
    public int delete_user_by_userCode(String userCode) {
        User user = userDao.select_user_by_userCode(userCode);
        if (user != null) {
            userDao.delete_user_by_userCode(userCode);
            return 200;
        } else {
            return 404;
        }
    }

    @Override
    public int update_user_by_userCode(String userCode, String RealName, String sex) {
        User user = userDao.select_user_by_userCode(userCode);
        if (user != null) {
            userDao.update_user_by_userCode(userCode, RealName, sex);
            return 200;
        } else {
            return 404;
        }
    }

    @Override
    public int update_userPassword_by_userCode(String userCode, String password) {
        User user = userDao.select_user_by_userCode((userCode));
        if (user != null) {
            userDao.update_userPassowrd_by_userCode(userCode, password);
            return 200;
        } else {
            return 404;
        }
    }
}
