package com.chuhelan.model;

import lombok.Data;

@Data
public class BaseMessage {
    int code;
    String message;

    public BaseMessage(int i, String s) {
        code = i;
        message = s;
    }
}
