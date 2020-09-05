import { reactive, toRefs } from "@vue/composition-api";
import { GetCityPicker } from "@/api/common";
export function cityPicker() {
    const data = reactive({
        provinceValue: "",
        cityValue: "",
        areaValue: "",
        streetValue: "",
        provinceData: [],
        cityData: [],
        areaData: [],
        streetData: []
    });
    const resultData = reactive({
        provinceValue: "",
        cityValue: "",
        areaValue: "",
        streetValue: "",
    });
    /**
     * 获取省份
     */
    const getProvince = () => {
        getData({ type: "province" });
    };
    /**
     * 选择省份，获取城市
     */
    const handlerProvince = val => {
        resetValue({ type: "city" });
        getData({ type: "city", province_code: val });
    };
    /**
     * 选择城市，获取区县
     */
    const handlerCity = val => {
        resetValue({ type: "area" });
        getData({ type: "area", city_code: val });
    };
    /**
     * 选择区县，获取街道
     */
    const handlerArea = val => {
        resetValue({ type: "street" });
        getData({ type: "street", area_code: val }); 
    };
    /**
     * 选择街道
     */
    const handlerStreet = val => {
        resetValue({ type: "" });
    };

    /**
     * 调用接口
     * @param {*} data 
     */
    const getData = (val) => {
        GetCityPicker(val)
            .then(response => {
                data[`${val.type}Data`] = response.data.data.data;
            })
            .catch(error => { });
    }

    /**
     * 重置选项
     */
    const resetValue = (params) => {
        const valueJson = {
            all: ["provinceValue", "cityValue", "areaValue", "streetValue"],
            city: ["cityValue", "areaValue", "streetValue"],
            area: ["areaValue", "streetValue"],
            street: ["streetValue"],
        }
        const arrObj = valueJson[params.type];
        if (arrObj) {
            // 清空指定的Key值
            arrObj.forEach(item => data[item] = "");
        }
        // 数据集合处理
        result()
    };
    /**
     * 返回数据集合
     */
    const result = () => {
        for (let key in resultData) {
            resultData[key] = data[key];
        }
    }

    return {
        // ...toRefs(data),
        data,
        resultData,
        getProvince,
        handlerProvince,
        handlerCity,
        handlerArea,
        handlerStreet,
        getData,
        resetValue,
        result
    }
}
