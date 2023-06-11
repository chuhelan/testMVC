package com.chuhelan.model;

import lombok.Data;

@Data
public class CodeMessage {

    /**
     * 只返回一个code值和一个message
     */

    int code;
    String message;

    public CodeMessage(int code, String message) {
        this.code = code;
        this.message = message;
    }

}