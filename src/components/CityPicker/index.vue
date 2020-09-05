<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select placeholder="请选择" v-model="data.provinceValue" @change="handlerProvince">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :value="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="6" v-if="init.city">
        <el-select placeholder="请选择" v-model="data.cityValue" @change="handlerCity">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :value="item.CITY_CODE"
            :label="item.CITY_NAME"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="6" v-if="init.area">
        <el-select placeholder="请选择" v-model="data.areaValue" @change="handlerArea">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :value="item.AREA_CODE"
            :label="item.AREA_NAME"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="6" v-if="init.street">
        <el-select placeholder="请选择" v-model="data.streetValue" @change="handlerStreet">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :value="item.STREET_CODE"
            :label="item.STREET_NAME"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { cityPicker } from "./cityPicker";
import { watch, onBeforeMount, reactive } from "@vue/composition-api";
export default {
  name: "cityPicker",
  props: {
    cityPickerLevel: {
      type: Array,
      default: () => []
    },
    cityPickerData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    // 组件方法
    const {
      // 数据集合
      data,
      resultData,
      // 事件
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet
    } = cityPicker();
    // 初始化省市区街联动
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false
    });
    /**
     * 初始化
     */
    const initCityPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length == 0) {
        for (let key in init) {
          init[key] = true;
        }
      } else {
        initData.forEach(item => {
          init[item] = true;
        });
      }
    };
    //监听后返回的数据
    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue
      ],
      ([province, city, area, street]) => {
        emit("update:cityPickerData", resultData); //提交给父组件
      }
    );
    /**
     * 获取省份
     */
    onBeforeMount(() => {
      initCityPicker();
      getProvince();
    });

    return {
      data,
      init,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
<!--
  关于组件
  组件目录位置： src > compontents > CityPicker > index.vue;
  组件引用方式： import CityPicker from "@c/CityPicker/index";
  <CityPicker
      :cityPickerLevel="['province','city', 'area', 'street']"
      :cityPickerData.sync="data.cityData"
    />
  参数配置
  cityPickerLevel:[]    //'province','city', 'area', 'street' 省市区选框
  cityData:{}           //地区数据

-->