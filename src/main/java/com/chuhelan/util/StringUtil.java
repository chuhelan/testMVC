package com.chuhelan.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil {
    public boolean isEmail(String value) {
        String emailPattern = "^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$";
        Pattern p = Pattern.compile(emailPattern);
        Matcher m = p.matcher(value);
        return m.matches();
    }

    public boolean isUserCode(String value) {
        String userCodePattern = "^CZ\\d{11}$";
        Pattern p = Pattern.compile(userCodePattern);
        Matcher m = p.matcher(value);
        return m.matches();
    }

}
