<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="20">
        <div class="label-wrap category">
          <label for>类型：</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="5">
                <SelectVue ref="userSelect" :config="data.configOption" />
              </el-col>
              <el-col :span="5">
                <el-input placeholder="请输入内容" v-model="data.keyWord"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" style="height:32px;line-height:7px" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <el-button
          type="danger"
          class="pull-right"
          style="height:32px;line-height:7px"
          @click="operationAdd"
        >添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- TableVue组件  -->
    <TableVue ref="userTable" :config="data.configTable" :checkTableRow.sync="data.checkTableRow">
      <!-- 插槽 -->
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.status"
          inactive-value="1"
          active-value="2"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handlerSwitch(slotData.data)"
        ></el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button size="small" type="danger" @click="operationDelete(slotData.data)">删除</el-button>
        <el-button size="small" type="success" @click="operationEdit(slotData.data)">编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft>
        <el-button size="small" @click="tableCheckDelete">批量删除</el-button>
      </template>
      <!-- 插槽 -->
    </TableVue>
    <DialogAdd
      :flag.sync="data.dialog_user_add"
      :editData.sync="data.editData"
      @refreshTableData="refreshTable"
    />
  </div>
</template>
<script>
import { UserActives } from "@/api/user";
import { global } from "@/utils/global.js";
import { reactive } from "@vue/composition-api";
import { UserDelete } from "@/api/user";
// 组件
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";
export default {
  name: "userIndex",
  components: {
    SelectVue,
    TableVue,
    DialogAdd
  },
  setup(props, { root, refs }) {
    const { confirm } = global();
    /**
     * 数据
     */
    const data = reactive({
      dialog_user_add: false,
      // select组件参数
      configOption: {
        init: ["username", "phone"]
      },
      // 搜索关键词
      keyWord: "",
      // 多选框选择的数据
      checkTableRow: {},
      // 阻止禁启用按钮
      updateUserStatus: false,
      // table组件参数
      configTable: {
        //多选框
        selection: true,
        //表头
        tHead: [
          { label: "邮箱/用户名", field: "username", width: "180px" }, //email
          { label: "真实姓名", field: "truename", width: "90px" },
          { label: "手机号", field: "phone", width: "120px" },
          { label: "地区", field: "region" },
          { label: "角色", field: "role", width: "100px" },
          {
            label: "禁启用角色",
            field: "status",
            columnType: "slot",
            slotName: "status",
            width: "100px"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ],
        // 请求接口URL
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 5
          }
        },
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationClass: "pull-right"
      },
      // 编辑弹窗携带的数据
      editData: {}
    });
    /**
     * 方法
     */
    /**
     * 查询
     */
    const search = () => {
      let selectValue = refs.userSelect.data.selectValue;
      let requestData = {
        [selectValue]: data.keyWord //ES6写法
      };
      refs.userTable.paramsLoadData(requestData);
    };
    /**
     * 添加用户
     */
    const operationAdd = () => {
      data.dialog_user_add = true;
      // 子组件赋值
      data.editData = Object.assign({});
    };
    // 修改操作
    const operationEdit = val => {
      data.dialog_user_add = true;
      data.editData = Object.assign({}, val);
    };
    // 单行删除操作
    const operationDelete = val => {
      data.checkTableRow.idItem = [val.id];
      confirm({
        content: "确定删除此信息?",
        tip: "提示",
        method: confirmDelete
      });
    };
    // 批量删除
    const tableCheckDelete = () => {
      let id = data.checkTableRow.idItem;
      if (!id || id.length === 0) {
        root.$message({
          message: "请选择删除对象！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确定删除此信息?",
        tip: "提示",
        method: confirmDelete
      });
    };
    // 调用删除接口
    const confirmDelete = () => {
      let requestData = {
        id: data.checkTableRow.idItem
      };
      UserDelete(requestData)
        .then(response => {
          // 刷新页面数据
          refreshTable();
        })
        .catch(error => {});
    };
    // 刷新页面数据
    const refreshTable = () => {
      refs.userTable.refreshData();
    };
    // 禁启用按钮开关修改
    const handlerSwitch = val => {
      // 优化 添加阻止
      if (data.updateUserStatus) {
        return false;
      }
      data.updateUserStatus = true;
      let requestData = {
        id: val.id,
        status: val.status
      };
      UserActives(requestData)
        .then(response => {
          root.$message({
            type: "success",
            message: response.data.message
          });
          data.updateUserStatus = !data.updateUserStatus;
        })
        .catch(error => {
          data.updateUserStatus = !data.updateUserStatus;
        });
    };
    return {
      data,
      search,
      operationAdd,
      operationEdit,
      operationDelete,
      tableCheckDelete,
      confirmDelete,
      refreshTable,
      handlerSwitch
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60px, 32px);
  }
}
</style>