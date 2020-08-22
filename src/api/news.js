import instance from "@/utils/axios.js";
/**
 * 信息分类添加一级
 */
export function AddFirstCategory(data) {
    return instance.request({
        method: "POST",
        url: "/news/addFirstCategory/",
        data
    })
}
/**
 * 信息分类添加二级
 */
export function AddChildrenCategory(data) {
    return instance.request({
        method: "POST",
        url: "/news/addChildrenCategory/",
        data
    })
}
/**
 * 新增信息
 */
export function AddInfo(data) {
    return instance.request({
        method: "POST",
        url: "/news/add/",
        data
    })
}
/**
 * 删除信息
 */
export function EditInfo(data) {
    return instance.request({
        method: "POST",
        url: "/news/editInfo/",
        data
    })
}
/**
 * 获取信息列表
 */
export function GetList(data) {
    return instance.request({
        method: "POST",
        url: "/news/getList/",
        data
    })
}
/**
 * 删除信息
 */
export function DeleteInfo(data) {
    return instance.request({
        method: "POST",
        url: "/news/deleteInfo/",
        data
    })
}
/**
 * 获取信息分类
 */
export function GetCategory(data) {
    return instance.request({
        method: "POST",
        url: "/news/getCategory/",
        data
    })
}
/**
 * 获取全部信息分类
 */
export function GetCategoryAll(data) {
    return instance.request({
        method: "POST",
        url: "/news/getCategoryAll/",
        data
    })
}
/**
 * 删除信息分类
 */
export function DeleteCategory(data) {
    return instance.request({
        method: "POST",
        url: "/news/deleteCategory/",
        data
    })
}
/**
 * 编辑信息分类
 */
export function EditCategory(data) {
    return instance.request({
        method: "POST",
        url: "/news/editCategory/",
        data
    })
}