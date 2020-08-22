<template>
  <el-upload
    class="avatar-uploader"
    :action="config.action"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.imageUrl" :src="data.imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { QiniuToken } from "@/api/common.js";
import { onMounted, reactive, watch } from "@vue/composition-api";
export default {
  /**
   * 七牛云的token  显示默认图片  选择图片后渲染自身图片
   * 返回选择的图片路径
   */
  name: "",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      imageUrl: "",
      uploadKey: {
        token: "",
        key: ""
      }
    });
    // 图片上传
    const handleAvatarSuccess = (res, file) => {
      let url = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      data.imageUrl = url;
      emit("update:imgUrl", url);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 2MB!");
      }
      //文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };
    /**
     * 获取七牛云Token
     */
    const getQiniuToken = () => {
      let requestData = {
        accesskey: props.config.accesskey,
        secretkey: props.config.secretkey,
        buckety: props.config.buckety
      };
      QiniuToken(requestData)
        .then(response => {
          data.uploadKey.token = response.data.data.token;
        })
        .catch(error => {});
    };
    /**
     * 监听
     */
    watch(
      () => props.imgUrl,
      value => {
        data.imageUrl = value;
      }
    );
    onMounted(() => {
      getQiniuToken();
    });
    return {
      data,
      handleAvatarSuccess,
      beforeAvatarUpload,
      getQiniuToken
    };
  }
};
</script>
<style lang="scss" scoped>
</style>