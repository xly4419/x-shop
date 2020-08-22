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
 * 获取七牛云接口
 */
export function QiniuToken(data) { 
    return instance.request({
        method: "POST",
        url: "/uploadImgToken/",
        data
    })
}