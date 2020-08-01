<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{'current':item.current}"
          @click="toggleMenu(item)"
        >{{item.txt}}</li>
      </ul>
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="0"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="checkpass" class="item-form" v-show="model==='register'">
          <label>重复密码</label>
          <el-input
            type="text"
            v-model="ruleForm.checkpass"
            autocomplete="off"
            minlength="0"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input type="text" v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate.js";
export default {
  name: "login",
  data() {
    // 验证用户名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    //验证密码
    var validatePassword = (rule, value, callback) => {
      // 过滤后的值
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20的数字+字母"));
      } else {
        callback();
      }
    };
    //验证再次输入的密码
    var validateCheckpass = (rule, value, callback) => {
      //判断是登陆还是注册 登录直接通过
      if (this.model === "login") {
        callback();
      }
      // 过滤后的值
      this.ruleForm.checkpass = stripscript(value);
      value = this.ruleForm.checkpass;
      if (value === "") {
        callback(new Error("再次请输入密码"));
      } else if (value != this.ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //验证验证码
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else if (validateVCode(value)) {
        callback(new Error("验证码为6位的数字/字母"));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: "登录", current: true, type: "login" },
        { txt: "注册", current: false, type: "register" }
      ],
      //模块值
      model: "login",
      // 表单数据
      ruleForm: {
        username: "",
        password: "",
        checkpass: "",
        code: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        checkpass: [{ validator: validateCheckpass, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
      }
    };
  },
  methods: {
    toggleMenu(data) {
      this.model = data.type;
      this.menuTab.forEach(element => {
        element.current = false;
      });
      data.current = true;
    },
    // 表单方法
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>