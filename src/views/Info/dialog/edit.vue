<template>
  <el-dialog
    title="修改"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form :model="data.form" ref="editInfoForm">
      <el-form-item label="类型" :label-width="data.formLabelWidth" prop="category">
        <el-select v-model="data.form.category" placeholder="请选择">
          <el-option
            v-for="item in data.categoryOptions"
            :label="item.category_name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" :label-width="data.formLabelWidth" prop="title">
        <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="概况" :label-width="data.formLabelWidth" prop="content">
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
import { EditInfo, GetList } from "@/api/news.js";
import { currentTime } from "@/utils/common.js";
import { ref, watch, reactive } from "@vue/composition-api";
export default {
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit, root, refs }) {
    // 数据
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "70px",
      form: { category: "", title: "", content: "" },
      categoryOptions: [], //分类下拉数据
      submitLoading: false, //按钮加载
      createDate: ""
    });
    watch(
      () => props.flag,
      val => {
        data.dialog_info_flag = val;
      }
    );
    // 方法
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      emit("update:flag", false);
    };
    const submit = () => {
      data.createDate = currentTime();
      let requestData = {
        id: props.id,
        categoryId: data.form.category,
        title: data.form.title,
        imgUrl: "",
        createDate: data.createDate,
        content: data.form.content
      };
      if (!data.form.category) {
        root.$message({
          message: "分类不能为空",
          type: "error"
        });
        return false;
      }
      data.submitLoading = true;
      EditInfo(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: "success"
          });
          data.submitLoading = false;
          emit("getInfo");
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    const openDialog = () => {
      data.categoryOptions = props.category;
      getInfoList();
    };
    const getInfoList = () => {
      let requestData = {
        id: props.id,
        pageNumber: 1,
        pageSize: 1
      };
      GetList(requestData)
        .then(response => {
          // 更新数据;
          let responseData = response.data.data.data[0];
          data.form = {
            category: responseData.categoryId,
            title: responseData.title,
            content: responseData.content
          };
        })
        .catch(error => {});
    };
    const resetForm = () => {
      refs.editInfoForm.resetFields();
    };

    return {
      data,
      // 方法
      close,
      submit,
      openDialog,
      getInfoList,
      resetForm
    };
  }
};
</script>
<style lang="scss" scoped>
</style>