import { reactive } from "@vue/composition-api";
import { GetCategoryAll, GetCategory } from "./news";
import instance from "@/utils/axios.js";
export function common() {
    const category = reactive({
        item: []
    });
    /**
     * 获取分类
     */
    const getInfoCategory = () => {
        GetCategory()
            .then(response => {
                category.item = response.data.data.data;
            })
            .catch(error => { });
    }
    /**
     * 获取全部分类
     */
    const getInfoCategoryAll = () => {
        GetCategoryAll()
            .then(response => {
                // 给数据添加属性 forEach  二级分类信息显示   svg图标名称
                response.data.data.forEach(item => {
                    item.showAll = false;
                    item.iconClass = "plus"
                });
                category.item = response.data.data;
            })
            .catch(error => { });
    }

    return {
        category,
        getInfoCategory,
        getInfoCategoryAll
    }
}
/**
 * 获取七牛云token
 * 
 * @param {
 * accesskey: 七牛云密钥AK  String,
 * secretkey: 七牛云密钥SK  String,
 * buckety: 七牛云命名空间名字  String,
 * } data 
 */
export function QiniuToken(data) {
    return instance.request({
        method: "POST",
        url: "/uploadImgToken/",
        data
    })
}
/**
 * 请求表格数据
 */
export function loadTableData(parms) {
    return instance.request({
        method: parms.method || "post",
        url: parms.url,
        data: parms.data || {}
    })
}
/**
 * 获取省市区关联数据
 * @param {*} data 
 */
export function GetCityPicker(data) {
    return instance.request({
        method: "POST",
        url: "/cityPicker/",
        data
    })
}