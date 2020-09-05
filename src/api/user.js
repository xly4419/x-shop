import instance from '@/utils/axios.js'
/**
 * 获取角色
 */
export function GetRole(data = {}) {
    return instance.request({
        method: "POST",
        url: "/role/",
        data
    })
}
/**
 * 获取系统列表
 */
export function GetSystem(data = {}) {
    return instance.request({
        method: "POST",
        url: "/system/",
        data
    })
}
/**
 * 获取按钮权限
 */
export function GetPermButton(data = {}) {
    return instance.request({
        method: "POST",
        url: "/permButton/",
        data
    })
}/**
 * 用户添加
 * @param {*} data 
 */
export function UserAdd(data) {
    return instance.request({
        method: "POST",
        url: "/user/add/",
        data
    })
}
/**
 * 用户删除
 * @param {*} data 
 */
export function UserDelete(data) {
    return instance.request({
        method: "POST",
        url: "/user/delete/",
        data
    })
}
/**
 * 用户禁用启用
 * @param {*} data 
 */
export function UserActives(data) {
    return instance.request({
        method: "POST",
        url: "/user/actives/",
        data
    })
}
/**
 * 用户编辑
 * @param {*} data 
 */
export function UserEdit(data) {
    return instance.request({
        method: "POST",
        url: "/user/edit/",
        data
    })
}