<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="700px"
    @opened="openDialog"
  >
    <el-form :model="data.form" ref="addUserForm" :rules="rules">
      <el-form-item label="用户名" :label-width="data.formLabelWidth" prop="username">
        <el-input v-model="data.form.username" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item label="密码" :label-width="data.formLabelWidth" prop="password">
        <el-input v-model="data.form.password" placeholder="请输入6-20位数字+字母"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名" :label-width="data.formLabelWidth" prop="truename">
        <el-input v-model="data.form.truename" placeholder="请输入真实姓名"></el-input>
      </el-form-item>

      <el-form-item label="手机号" :label-width="data.formLabelWidth" prop="phone">
        <el-input v-model.number="data.form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item label="地区" :label-width="data.formLabelWidth" prop="region">
        <CityPicker
          :cityPickerLevel="['province','city', 'area', 'street']"
          :cityPickerData.sync="data.cityData"
        />
      </el-form-item>

      <el-form-item label="是否启用" :label-width="data.formLabelWidth" prop="status">
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>

      <el-form-item label="系统" :label-width="data.formLabelWidth" prop="role">
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox v-for="item in data.roleItem" :key="item.role" :label="item.name"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" @click="submit('addUserForm')" :loading="data.submitLoading">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import sha1 from "js-sha1";
import { stripscript, validateEmail, validatePass } from "@/utils/validate.js";
import { GetRole, GetSystem, UserAdd, UserEdit } from "@/api/user.js";
import { currentTime } from "@/utils/common.js";
import { ref, watch, reactive } from "@vue/composition-api";
// 组件
import CityPicker from "@c/CityPicker/index";
export default {
  components: {
    CityPicker
  },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit, root, refs }) {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      /**
       *  业务逻辑
       *  1、编辑状态：
       *     需要校验：   data.form.id存在并且，密码不为空
       *     不需要校验： data.form.id存在并且，密码为空
       *
       *  2、添加状态：
       *     需要校验：   data.form.id不存在
       */
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        if (value) {
          // 过滤后的值
          data.form.password = stripscript(value);
          value = data.form.password;
        }
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          callback(new Error("密码为6至20的数字+字母"));
        } else {
          callback();
        }
      }
    };
    //验证角色
    let validateRole = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    // 数据
    const data = reactive({
      dialog_info_flag: false, //弹窗标记
      formLabelWidth: "70px",
      form: {
        username: "",
        truename: "",
        password: "",
        phone: "",
        region: "",
        status: "2",
        role: []
      },
      submitLoading: false, //按钮加载
      cityData: {}, //地区数据
      roleItem: [] //角色数据
    });
    //表单的验证
    const rules = reactive({
      username: [
        { required: true, validator: validateUsername, trigger: "blur" }
      ],
      password: [
        { required: true, validator: validatePassword, trigger: "blur" }
      ],
      role: [{ required: true, message: "请选择角色", trigger: "change" }]
    });
    watch(
      () => props.flag,
      val => {
        data.dialog_info_flag = val;
      }
    );
    // 方法
    /**
     * 弹窗打开
     */
    const openDialog = () => {
      // 角色以及按钮权限请求
      getSystem();
      // 初始值处理
      let editData = props.editData;
      if (editData.id) {
        // 编辑
        editData.role = editData.role ? editData.role.split(",") : []; // 数组
        //循环JSON对象
        for (let key in editData) {
          data.form[key] = editData[key];
        }
      } else {
        // 添加
        data.form.id && delete data.form.id;
      }
    };
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      emit("update:flag", false);
    };
    const submit = formName => {
      refs[formName].validate(valid => {
        //表单验证
        if (valid) {
          // 数据处理
          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.role = requestData.role.join();
          requestData.region = JSON.stringify(data.cityData);
          /**
           * 业务逻辑
           * 编辑： 请求数据中存在id
           *        data.form.password值存在，需要密码，并且加密，否则删除请求数据里面的密码字段
           * 添加： 请求数据中不存在id
           *        需要密码并且加密
           */
          if (requestData.id) {
            if (requestData.password) {
              requestData.password = sha1(requestData.password);
            } else {
              delete requestData.password;
            }
            userEdit(requestData);
          } else {
            requestData.password = sha1(requestData.password);
            userAdd(requestData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     *  用户添加
     */
    const userAdd = requestData => {
      // console.log(requestData);
      // return false;
      UserAdd(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: "success"
          });
          close();
          emit("refreshTableData");
        })
        .catch(error => {});
    };
    /**
     *  用户修改
     */
    const userEdit = requestData => {
      // console.log(requestData);
      // return false;
      UserEdit(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: "success"
          });
          close();
          emit("refreshTableData");
        })
        .catch(error => {});
    };
    // 清空数据
    const resetForm = () => {
      data.cityData = {};
      refs.addUserForm.resetFields();
    };
    /**
     * 请求角色
     */
    const getSystem = () => {
      if (data.roleItem.length === 0) {
        GetSystem().then(response => {
          data.roleItem = response.data.data;
        });
      }
    };
    return {
      data,
      rules,
      // 方法
      close,
      submit,
      openDialog,
      userAdd,
      userEdit,
      resetForm,
      getSystem
    };
  }
};
</script>
<style lang="scss" scoped>
</style>