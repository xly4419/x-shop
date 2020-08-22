<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="信息分类：">
      <el-select v-model="form.category" placeholder="请选择">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="form.title" style="width:350px"></el-input>
    </el-form-item>

    <el-form-item label="缩略图：">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="UploadImgConfig" />
    </el-form-item>

    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.dataTime" type="datetime" placeholder="选择日期时间" disabled></el-date-picker>
    </el-form-item>

    <el-form-item label="发布日期：">
      <quillEditor
        v-model="form.content"
        ref="myQuillEditor"
        :options="data.editorOption"
        class="ql-editor"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="data.submitLoading">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
//富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 组件
import UploadImg from "@c/UploadImg";
import { timestampToTime } from "@/utils/common.js";
import { EditInfo, GetList } from "@/api/news.js";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import { common } from "@/api/common.js";
export default {
  name: "infoDetailed",
  components: { quillEditor, UploadImg },
  setup(props, { root }) {
    const { getInfoCategory, category } = common();
    /**
     * 数据
     */
    const data = reactive({
      //vuex里面没有就从 session取值
      id: root.$route.params.id || root.$store.state.infoDetailed.id,
      category: [],
      editorOption: {},
      submitLoading: false
    });
    const form = reactive({
      category: "",
      title: "",
      dataTime: "",
      content: "",
      imgUrl: ""
    });
    // 图片上传配置
    const UploadImgConfig = reactive({
      action: "http://up-z1.qiniup.com",
      accesskey: "WfLfK80lty9v4xdoqYYLSX1rFUHSIiuvbxNX64UF",
      secretkey: "1YmdyhVL3oCGdpmjkCnmhLYBGqt9YlWYjwSpeTDz",
      buckety: "xuliny"
    });
    /**
     * 方法
     */
    const getInfoList = () => {
      let requestData = {
        id: data.id,
        pageNumber: 1,
        pageSize: 1
      };
      GetList(requestData)
        .then(response => {
          // 更新数据;
          let responseData = response.data.data.data[0];
          // console.log(responseData);
          form.category = responseData.categoryId;
          form.title = responseData.title;
          form.content = responseData.content;
          form.dataTime = timestampToTime(responseData.createDate);
          form.imgUrl = responseData.imgUrl;
        })
        .catch(error => {});
    };
    const onSubmit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.category,
        title: form.title,
        imgUrl: form.imgUrl,
        content: form.content
      };
      EditInfo(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: "success"
          });
          data.submitLoading = false;
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };

    /**
     * 生命周期
     */
    onMounted(() => {
      getInfoCategory();
      getInfoList();
    });
    /**
     * watch监听
     */
    watch(
      () => category.item,
      value => {
        data.category = value;
      }
    );
    return {
      data,
      form,
      UploadImgConfig,
      onSubmit,
      getInfoList
    };
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>