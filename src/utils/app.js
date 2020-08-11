import cookie from "cookie_js";

const adminToken = "admin_token";
const UserName = "username";
/**
 * 设置 cookie 函数
 */
export function getToken() {
    return cookie.get(adminToken);
}

export function setToken(toKen) {
    return cookie.set(adminToken, toKen);
}

export function removeToken() {
    return cookie.remove(adminToken);
}

export function setUserName(value) {
    return cookie.set(UserName, value);
}

export function getUserName() {
    return cookie.get(UserName);
}

export function removeUserName() {
    return cookie.remove(UserName);
}