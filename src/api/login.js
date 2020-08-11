import instance from '@/utils/axios.js'
/**
 * 获取验证码
 */
export function GetSms(data) {
    return instance.request({
        method: "POST",
        url: "/getSms/",
        data
    })
}
/**
 * 获取用户信息
 */
/**
 * 登录
 */
export function Login(data) {
    return instance.request({
        method: "POST",
        url: "/login/",
        data
    })
}
/**
 * 注册
 */
export function Register(data) {
    return instance.request({
        method: "POST",
        url: "/register/",
        data
    })
}