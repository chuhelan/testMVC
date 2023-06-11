import * as CryptoJS from 'crypto-js'

/**
 * register.html
 */

function vail_Email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function vail_userCode(userCode: string): boolean {
    const userCodeRegex = /^CZ\d{11}$/;
    return userCodeRegex.test(userCode);
}


function vail_name(name: string): boolean {
    const nameRegex = new RegExp("^[\\u4e00-\\u9fa5]{2,4}$");
    return nameRegex.test(name);
}

function ver_password(pass1: HTMLInputElement, pass2: HTMLInputElement) {
    return pass1.value === pass2.value ? true : false
}

interface User {
    userCode: string
    password: string
    RealName: string
    Email: string
    sex: string
}

// 注册前的准备
function ver_before_register() {
    const userEle = (document.getElementById("register_userCode") as HTMLInputElement)
    const passEle = (document.getElementById("register_password") as HTMLInputElement)
    const passRepEle = (document.getElementById("register_password_rep") as HTMLInputElement)
    const nameEle = (document.getElementById("register_realName") as HTMLInputElement)
    const emailEle = (document.getElementById("register_email") as HTMLInputElement)

    let selectedValue: string = ""

    if (vail_userCode(userEle.value) == false || userEle.value == null) {
        alert("您的学号输入有误，请输入以\"CZ\"开头的13位学号")
        return
    }

    if (passEle.value === '' || passRepEle.value === '') {
        alert("您的密码不能为空")
        return
    } else if (ver_password(passEle, passRepEle) == false) {
        alert("您两次输入的密码不正确")
        return
    }

    if (vail_name(nameEle.value) == false || nameEle.value == null) {
        alert("您的姓名输入有误")
        return
    }
    if (vail_Email(emailEle.value) == false || emailEle.value == null) {
        alert("您的邮件输入有误")
        return
    }
    if (selectedValue == null) {
        alert("请选择您的性别")
        return
    }

    const register_radioElement1 = document.getElementById("register_radio") as HTMLInputElement
    const register_radioElement2 = document.getElementById("register_radio2") as HTMLInputElement

    if (register_radioElement1.checked) {
        selectedValue = register_radioElement1.value
    } else if (register_radioElement2.checked) {
        selectedValue = register_radioElement2.value
    }

    const userInfo: User = {
        userCode: userEle.value,
        password: encryptPassword(passEle.value),
        RealName: nameEle.value,
        Email: emailEle.value,
        sex: selectedValue
    }
    do_register(userInfo)
}

function do_register(user: User) {

    const url: string = "/v1/register"
    const formData: FormData = new FormData()

    formData.append("userCode", user.userCode)
    formData.append("password", user.password)
    formData.append("RealName", user.RealName)
    formData.append("Email", user.Email)
    formData.append("sex", user.sex)

    fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formData
    })
        .then(Response => Response.json())
        .then(data => {

            if (data.code === 200) {
                alert("注册成功！")
                window.location.href = "login.html"
            } else if (data.code === 302) {
                alert("帐号已存在，请检查后重新输入！")
                location.reload()
            } else {
                alert("网络连接异常！")
                location.reload()
            }
        }).catch(console.error)

}

function encryptPassword(password: string) {
    const shaHash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
    return shaHash;
}

document.addEventListener('DOMContentLoaded', function () {

    //测试 查找浏览器cookie 记得删除
    verification_login()

    let reg_button: HTMLInputElement
    if ((document.getElementById("reg_button") as HTMLInputElement) != null) {

        reg_button = document.getElementById("reg_button") as HTMLInputElement
        reg_button.addEventListener("click", function (event) {
            ver_before_register()
            return false
        })
    }

})


/**
 * login.html
 */

interface login_ele {
    userKey: string,
    password: string
}

function before_login() {

    const userLoginKey = (document.getElementById("login_key") as HTMLInputElement)
    const userLoginPassword = (document.getElementById("login_password") as HTMLInputElement)

    if (userLoginKey.value == '') {
        alert("登录帐号不能为空")
        return
    } else if ((vail_Email(userLoginKey.value) == false) && vail_userCode(userLoginKey.value) == false) {
        alert("请确认您的帐号邮箱地址或者学号是否正确")
        return
    }

    if (userLoginPassword.value == '') {
        alert("密码不能为空")
    }

    const loginInfo: login_ele = {
        userKey: userLoginKey.value,
        password: encryptPassword(userLoginPassword.value)
    }

    do_login(loginInfo)

}

function do_login(element: login_ele) {

    const url = "/v1/login"
    const formData: FormData = new FormData()

    formData.append("login_key", element.userKey)
    formData.append("password", element.password)

    fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formData
    })
        .then(Response => Response.json())
        .then(data => {

            if (data.code === 200) {

                let dateTime = new Date()
                dateTime.setDate(dateTime.getDate() + 3)
                dateTime = new Date(dateTime)
                document.cookie = "token=" + data.message.split('|')[0] + "; expires=" + dateTime.toString() + "; path=/";
                document.cookie = "userCode=" + data.message.split('|')[1] + "; expires=" + dateTime.toString() + "; path=/";

                window.location.href = "home.html"
            } else if (data.code === 404) {
                alert("用户名或密码错误！")
                location.reload()
            } else {
                alert("网络连接异常！")
                location.reload()
            }
        }).catch(console.error)

}

document.addEventListener('DOMContentLoaded', function () {

    let login_button: HTMLInputElement
    if ((document.getElementById("login_button") as HTMLInputElement) != null) {

        login_button = (document.getElementById("login_button") as HTMLInputElement)
        login_button.addEventListener("click", function (event) {
            before_login()
            return false
        })
    }

})


/**
 * home.index
 */


document.addEventListener('DOMContentLoaded', function () {

    //退出帐号操作
    let home_signout: HTMLInputElement
    if ((document.getElementById("home_signout_button") as HTMLInputElement) != null) {

        home_signout = (document.getElementById("home_signout_button") as HTMLInputElement)
        home_signout.addEventListener("click", function (event) {
            signout_account()
        })
    }
    setHome()

})

/**
 * 设置 home.html 页面数据
 */

function selectUserInfo(userCookieCode: string, callback: (userInfo: User) => void, errorCallback: (error: Error) => void) {

    const url = "/v1/info?userCode=" + userCookieCode;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const userCookieInfo: User = {
                userCode: data.userCode,
                password: data.password,
                RealName: data.RealName,
                Email: data.Email,
                sex: data.sex
            };
            callback(userCookieInfo);
        })
        .catch(error => {
            errorCallback(error);
        });
}

function setHome() {

    //顶部区域
    const home_top_userCode = document.getElementById("home_top_userCode") as HTMLElement
    const home_top_RealName = document.getElementById("home_top_RealName") as HTMLElement

    //用户信息区域
    const home_userCode = document.getElementById("home_userCode") as HTMLInputElement
    const home_RealName = document.getElementById("home_RealName") as HTMLInputElement
    const home_Email = document.getElementById("home_Email") as HTMLInputElement

    const home_nan_input = document.getElementById("home_nan_input") as HTMLInputElement
    const home_nv_input = document.getElementById("home_nv_input") as HTMLInputElement

    /**
     * interface User
            userCode: string
            password: string
            RealName: string
            Email: string
            sex: string
     */


    const userCookieCode = getCookie("userCode")

    let userInfo: User = {
        userCode: "",
        password: "",
        RealName: "",
        Email: "",
        sex: ""
    };

    selectUserInfo(userCookieCode, (userInfo) => {
        home_top_userCode.textContent = userInfo.userCode
        home_top_RealName.textContent = userInfo.RealName
        home_userCode.value = userInfo.userCode
        home_RealName.value = userInfo.RealName
        home_Email.value = userInfo.Email
        if (userInfo.sex == "男") {
            home_nan_input.checked = true
        } else {
            home_nv_input.checked = true
        }
    }, (error) => {
        console.error
    });

}

/**
 * home.inedx 删除用户按钮点击
 */

document.addEventListener('DOMContentLoaded', function () {

    let delete_button: HTMLInputElement
    if ((document.getElementById("home_delete_account_button") as HTMLInputElement) != null) {

        delete_button = document.getElementById("home_delete_account_button") as HTMLInputElement
        delete_button.addEventListener("click", function (event) {
            delete_account()
        })
    }

})


function delete_account() {

    const check_button = document.getElementById("home_delete_account_check") as HTMLInputElement
    if (check_button.checked === true) {

        const cookie_userCode = getCookie("userCode")
        const url = "/v1/delete"
        const formData: FormData = new FormData()

        formData.append("userCode", cookie_userCode)

        fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            body: formData
        })
            .then(Response => Response.json())
            .then(data => {
                if (data.code === 200) {
                    alert("删除成功！")
                    signout_account()
                    window.location.href = "index.html"
                }
            })

    } else {
        alert("你真的想要删除嘛，还是点错了")
    }

}

/**
 * home页面更新账户操作
 */
document.addEventListener('DOMContentLoaded', function () {

    let home_update_account_button: HTMLInputElement
    if ((document.getElementById("home_delete_account_button") as HTMLInputElement) != null) {

        home_update_account_button = document.getElementById("home_update_account_button") as HTMLInputElement
        home_update_account_button.addEventListener("click", function (event) {
            update_account()
        })
    }

})


function update_account() {

    const check_box = (document.getElementById("home_account_check")) as HTMLInputElement
    const RealNameValue = ((document.getElementById("home_RealName")) as HTMLInputElement).value

    const radioNanEle = document.getElementById("home_nan_input") as HTMLInputElement
    const radioNvEle = document.getElementById("home_nv_input") as HTMLInputElement

    let sexValue: string

    if (radioNanEle.checked === true) {
        sexValue = "男"
    } else {
        sexValue = "女"
    }

    const pageUserCode = getCookie("userCode")

    const url: string = "/v1/update"
    const formData: FormData = new FormData
    formData.append("userCode", pageUserCode)
    formData.append("RealName", RealNameValue)
    formData.append("sex", sexValue)

    if (check_box.checked === true) {
        fetch(url, {
            method: "PUT",
            headers: {
                Accept: "Application/json"
            },
            body: formData
        }).then(Response => Response.json())
            .then(data => {
                if (data.code === 200) {
                    alert("更新成功")
                    check_box.checked = false
                    setTimeout(function () {
                        location.reload();
                    }, 100);
                } else if (data.code === 404) {
                    alert("用户不存在")
                    window.location.href = "index.html"
                } else {
                    alert("网络连接异常")
                    location.reload()
                }
            })
    } else {
        alert("请先同意")
    }

}

/**
 * home页面更新密码操作
 */

document.addEventListener('DOMContentLoaded', function () {

    let home_update_account_button: HTMLInputElement
    if ((document.getElementById("update_accountPassword_button") as HTMLInputElement) != null) {

        home_update_account_button = document.getElementById("update_accountPassword_button") as HTMLInputElement
        home_update_account_button.addEventListener("click", function (event) {
            update_account_password()
        })
    }

})

function update_account_password() {
    const password_input = document.getElementById("password") as HTMLInputElement
    const password_repeat_input = document.getElementById("confirm_password") as HTMLInputElement

    const confirm_update_password_checkbox = document.getElementById("password_checkbox") as HTMLInputElement

    if (password_input.value === '' || password_repeat_input.value === '') {
        alert("您的密码不能为空")
    } else if (ver_password(password_input, password_repeat_input) === false) {
        alert("请检查您的密码，两次输入不匹配")
    }
    else if (confirm_update_password_checkbox.checked === false) {
        alert("请确认您的操作")
    } else {
        const passowrd_after = encryptPassword(password_input.value)
        update_password(passowrd_after)
    }

}

function update_password(password: string) {
    const url: string = "v1/update/password"
    const formData: FormData = new FormData()

    formData.append("userCode", getCookie("userCode"))
    formData.append("password", password)

    fetch(url, {
        method: "PUT",
        headers: {
            Accept: "Application/json"
        },
        body: formData
    })
        .then(Response => Response.json())
        .then(data => {
            if (data.code === 200) {
                alert("更新成功")
                signout_account()
            } else if (data.code === 404) {
                alert("用户不存在")
                window.location.href = "index.html"
            } else {
                alert("网络连接异常")
                location.reload()
            }
        })
}


/**
 * cookie相关
 */

function signout_account() {
    document.cookie = "token=; userCode=; expires=Sun, 31 Dec 2017 12:00:00 UTC; path=/";
    window.location.replace("index.html")
}

function getCookie(name: string) {
    let cookieValue = '';
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * 获取浏览器token
 */

function verification_login() {

    let userCode: string = ''
    let cookie: string = ''

    const cookies = document.cookie
    const cookie_list = cookies.split(";")

    let save: string = ''
    cookie_list.forEach(function (element) {
        if (element.trim().substring(0, 8) === 'userCode' || element.trim().substring(0, 5) === 'token') {
            save += element + "&"
        }
    })

    save = save.substring(0, save.length - 1)
    save = save.split(" ").join("")

}

document.addEventListener('DOMContentLoaded', function () {
    verify_login()
})

/**
 *                      有token通过验证         无token
 *  /                       home.html           不动
 *  /index.html             home.html           不动
 *  /register.html          不动                不动
 *  /home.html              不动                login.html
 *  /login.html             home.html           不动
 * 
 */

function verify_login() {

    const userCode: string = getCookie('userCode')
    const token: string = getCookie('token')

    // 无token
    if (token === '' || token === null) {
        switch (current_path()) {
            case 'home.html': {
                window.location.href = 'index.html'
                return
            }
            default: {
                return
            }
        }
    } else if (verify(userCode, token)) {
        switch (current_path()) {
            case '': {
                window.location.href = 'home.html'
                return
            }
            case 'index.html': {
                window.location.href = 'home.html'
                return
            }
            case 'login.html': {
                window.location.href = 'home.html'
                return
            }
            default: {
                return
            }
        }
    }


}

function current_path(): string {
    const path: string = window.location.href.split("/")[3]
    return path
}

function verify(userCode: string, token: string): boolean {

    const url: string = "/v1/verify"
    const formData: FormData = new FormData()

    formData.append("userCode", userCode)
    formData.append("token", token)

    fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formData
    })
        .then(Response => Response.json())
        .then(data => {
            if (data.code === 200) {
                return true
            } else if (data.code === 302) {
                return false
            } else {
                return false
            }
        }).catch(console.error)
    return false
}