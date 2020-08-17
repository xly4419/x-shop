<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form :model="data.form">
      <el-form-item label="类型" :label-width="data.formLabelWidth">
        <el-select v-model="data.form.category" placeholder="请选择">
          <el-option
            v-for="item in data.categoryOptions"
            :label="item.category_name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" :label-width="data.formLabelWidth">
        <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="概况" :label-width="data.formLabelWidth">
        <el-input v-model="data.form.content" placeholder="请输入内容" type="textarea"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" @click="submit" :loading="data.submitLoading">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo } from "@/api/news.js";
import { ref, watch, reactive, watchEffect } from "@vue/composition-api";
export default {
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 数据
    const data = reactive({
      dialog_info_flag: false,    //弹窗标记
      formLabelWidth: "70px",
      form: { category: "", title: "", content: "" }, 
      categoryOptions: [],        //分类下拉数据
      submitLoading: true         //按钮加载
    });
    // watch(
    //   () => props.flag,
    //   val => {
    //     dialog_info_flag.value = val;
    //   }
    // );
    // watch
    watchEffect(() => {
      data.dialog_info_flag = props.flag;
    });
    // 方法
    const close = () => {
      data.dialog_info_flag = false;
      emit("update:flag", false);
    };
    const submit = () => {
      let requestData = {
        categoryId: data.form.category,
        title: data.form.title,
        imgUrl: "",
        createDate: "",
        content: data.form.content
      };
      AddInfo(requestData)
        .then(response => {})
        .catch(error => {});
    };
    const openDialog = () => {
      data.categoryOptions = props.category;
    };
    const resetForm = () => {
      data.form.category = "";
      data.form.title = "";
      data.form.content = "";
    };
    return {
      data,
      // 方法
      close,
      submit,
      openDialog
    };
  }
};
</script>
<style lang="scss" scoped>
</style>