<template>
  <el-select v-model="data.selectValue" placeholder="请选择" >
    <el-option
      v-for="item in data.initOptionData"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script>
import { reactive, onMounted } from "@vue/composition-api";
export default {
  name: "",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      selectValue: "",
      initOptionData: [],
      options: [
        { value: "username", label: "用户名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    });
    /**
     * 初始化下拉选择
     */
    const initOption = () => {
      let initData = props.config.init;
      let oprionArr = [];
      // 数据校验
      if (initData.length === 0) {
        console.log("config的参数是空的，无法显示下拉菜单数据");
        return false;
      }
      initData.forEach(item => {
        let arr = data.options.filter(elem => elem.value == item)[0]; //filter匹配成功后得到的是一个数组
        oprionArr.push(arr);
      });
      if (oprionArr.length === 0) {
        console.log("数据未匹配成功");
        return false;
      }
      //初始化赋值
      data.initOptionData = oprionArr;
      data.selectValue = oprionArr[0].value;
    };
    onMounted(() => {
      initOption();
    });
    return {
      data,
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
<!--
组件目录位置： src > compontents > Select > index.vue;
组件引用方式： import SelectVue from "@c/Select";
template:    <SelectVue :config="data.configOption" />

参数配置：
configOption: {
   init: ["name", "phone"]
}
configOption: Object;
init: 
    数据类型：Array;
    可配置的数据："name","phone","email","id","title";
-->