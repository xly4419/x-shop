<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
        >{{ item.txt }}</li>
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
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="0"
            maxlength="20"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="checkpass" class="item-form" v-if="model==='register'">
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.checkpass"
            autocomplete="off"
            minlength="0"
            maxlength="20"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input type="text" v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{ codeButtonStatus.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn block"
            :disabled="submitButtonStatus"
          >{{ model === "login" ? "登录" : "注册" }}</el-button>
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
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login.js";
import { reactive, ref, onMounted, onUnmounted } from "@vue/composition-api";
export default {
  name: "login",
  setup(props, { refs, root }) {
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
      // 过滤后的值
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20的数字+字母"));
      } else {
        callback();
      }
    };
    //验证再次输入的密码
    let validateCheckpass = (rule, value, callback) => {
      //判断是登陆还是注册 登录直接通过
      if (model === "login") {
        callback();
      }
      // 过滤后的值
      ruleForm.checkpass = stripscript(value);
      value = ruleForm.checkpass;
      if (value === "") {
        callback(new Error("再次请输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else if (validateVCode(value)) {
        callback(new Error("验证码为6位的数字/字母"));
      } else {
        callback();
      }
    };
    //在这里放置data数据、生命周期、自定义的函数
    /**
     * 声明数据
     */
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    //模块值
    const model = ref("login");
    const timer = ref(null);
    // 登录按钮禁用状态
    const submitButtonStatus = ref(true);
    // 验证码按钮状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    //表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      checkpass: "",
      code: ""
    });
    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      checkpass: [{ validator: validateCheckpass, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    /**
     * 声明函数
     */
    const toggleMenu = data => {
      menuTab.forEach(element => {
        element.current = false;
      });
      data.current = true; //高光亮
      model.value = data.type; //修改模块值
      resetFormData();
      clearDown();
    };
    //清除表单数据
    const resetFormData = () => {
      refs["ruleForm"].resetFields(); //初始化表单
    };
    // 更新验证码按钮状态
    const updateButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    //获取验证码
    const getSms = () => {
      // 判断邮箱是否填写
      if (ruleForm.username == "") {
        root.$message({
          message: "邮箱不能为空",
          type: "error",
          duration: 2000
        });
        return false;
      }
      // 检验邮箱格式
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误,请重新输入");
        return false;
      }
      // 改变验证码按钮状态
      updateButtonStatus({
        status: true,
        text: "发送中"
      });
      // 请求接口 获取验证码
      let data = {
        username: ruleForm.username,
        module: model.value
      };
      GetSms(data)
        .then(response => {
          let data = response.data;
          root.$message({
            type: "success",
            message: data.message,
            duration: 2000
          });
          // 启用登录或注册按钮
          submitButtonStatus.value = false;
          //调计数器 倒计时
          countDown(60);
          console.log(data); //后面取消掉
        })
        .catch(error => {
          clearDown();
          submitButtonStatus.value = false;
          updateButtonStatus({
            status: false,
            text: "重新发送"
          });
          console.log(error);
        });
    };
    /**
     * 倒计时
     */
    const countDown = number => {
      // 判断定时器是都存在 存在即清楚
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        if (time === 0) {
          clearInterval(timer.value);
          // 改变验证码按钮状态
          updateButtonStatus({
            status: false,
            text: "重新发送"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
          time--;
        }
      }, 1000);
    };
    /**
     * 清除倒计时
     */
    const clearDown = () => {
      // 还原验证码按钮默认状态
      updateButtonStatus({
        status: false,
        text: "获取验证码"
      });
      // 清除倒计时
      clearInterval(timer.value);
    };
    // 表单方法
    const submitForm = formName => {
      refs[formName].validate(valid => {
        //表单验证
        if (valid) {
          // 三元运算
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     *  注册方法
     */
    const register = () => {
      let resquestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Register(resquestData)
        .then(response => {
          let data = response.data;
          root.$message({
            type: "success",
            message: data.message,
            duration: 2000
          });
          // 注册成功 跳到登陆界面
          toggleMenu(menuTab[0]);
          clearDown();
        })
        .catch(error => {
          console.log(error);
        });
    };
    /**
     *  登录方法
     */
    const login = () => {
      let resquestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store
        .dispatch("app/login", resquestData)
        .then(response => {
          // console.log(response);
          console.log("登陆成功");
          root.$router.push({
            name: "Console"
          });
          clearDown();
        })
        .catch(error => {
          console.log(error);
        });
    };
    /**
     * 生命周期
     */
    //挂载完成后
    onMounted(() => {});
    // 销毁页面
    onUnmounted(()=>{
      clearInterval(timer.value);
    });
    return {
      menuTab,
      model,
      timer,
      submitButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      toggleMenu,
      resetFormData,
      updateButtonStatus,
      submitForm,
      countDown,
      clearDown,
      getSms,
      register,
      login
    };
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
