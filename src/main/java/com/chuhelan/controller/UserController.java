package com.chuhelan.controller;

import com.chuhelan.beans.User;
import com.chuhelan.model.CodeMessage;
import com.chuhelan.service.UserService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@ResponseBody
@RequestMapping("/v1/")
public class UserController {

    Gson gson = new Gson();

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public String register_user(User user) {
        int code = userService.register_user(user);
        if (code == 200) {
            return gson.toJson(new CodeMessage(200, "注册成功！"));
        } else {
            return gson.toJson(new CodeMessage(302, "账号已存在！"));
        }
    }

    @PostMapping("/login")
    public String login(String login_key, String password) {
        String login_status = userService.login_by_key(login_key, password);
        int code = 500;
        String message = "未知错误";
        switch (login_status) {
            case "404": {
                code = Integer.parseInt(login_status);
                message = "帐号或密码错误";
            }
            default: {
                if (login_status.length() > 3) {
                    code = 200;
                    message = login_status + "|" + userService.select_userCode_by_user_key(login_key);
                }
            }
        }
        return gson.toJson(new CodeMessage(code, message));
    }

    @PostMapping("/verify")
    public String verify_by_userCode(String userCode, String token) {
        if (userService.verify_token_by_userCode(userCode, token)) {
            return gson.toJson(new CodeMessage(200, "验证通过"));
        } else {
            return gson.toJson(new CodeMessage(302, "验证失败"));
        }
    }

    @GetMapping("/info")
    public String select_user_by_userCode(String userCode) {
        User user = userService.select_user_by_userCode(userCode);
        return gson.toJson(user);
    }

    @DeleteMapping("/delete")
    public String delete_user_by_userCode(String userCode) {
        int code = userService.delete_user_by_userCode(userCode);
        switch (code) {
            case 200: {
                return gson.toJson(new CodeMessage(200, "删除成功"));
            }
            case 404: {
                return gson.toJson(new CodeMessage(404, "帐号不存在"));
            }
            default: {
                return gson.toJson(new CodeMessage(500, "网络超时"));
            }
        }
    }

    @PutMapping("/update")
    public String update_user_by_userCode(String userCode, String RealName, String sex) {
        int code = userService.update_user_by_userCode(userCode, RealName, sex);
        return getString(code);
    }

    @PutMapping("/update/password")
    public String update_userPassword_by_userCode(String userCode, String password) {
        int code = userService.update_userPassword_by_userCode(userCode, password);
        return getString(code);
    }

    private String getString(int code) {
        switch (code) {
            case 200: {
                return gson.toJson(new CodeMessage(200, "更新成功"));
            }
            case 404: {
                return gson.toJson(new CodeMessage(404, "帐号不存在"));
            }
            default: {
                return gson.toJson(new CodeMessage(500, "网络超时"));
            }
        }
    }

}
