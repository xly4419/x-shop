<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>类型：</label>
          <div class="wrap-content">
            <el-select v-model="category_value" placeholder="请选择" clearable style="width: 100%;">
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="label-wrap date">
          <label for>日期：</label>
          <div class="wrap-content">
            <el-date-picker
              style="width: 100%;"
              v-model="data_value"
              type="datetimerange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            ></el-date-picker>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="label-wrap key-work">
          <label for>关键字：</label>
          <div class="wrap-content">
            <SelectVue :config="data.configOption" />
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width: 100%;"></el-input>
      </el-col>

      <el-col :span="2">
        <el-button type="danger" style="width: 100%;" @click="searchInfo">搜索</el-button>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%;"
          @click="dialog_info_add= true"
        >新增</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格数据 -->
    <el-table
      :data="table_data.item"
      border
      v-loading="loadingData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="title" label="标题" width="360"></el-table-column>
      <el-table-column prop="categoryId" label="类型" width="80" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="160" :formatter="toData"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--slot-scope="scope"-->
          <el-button type="danger" size="mini" @click="delete_item(scope.row.id)">删除</el-button>
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
          <el-button type="success" size="mini" @click="detailed(scope.row)">编辑详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button type size="medium" @click="detele_all">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5,10,15,20]"
          :page-size="5"
          background
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增的弹窗 -->
    <DialogInfo :flag.sync="dialog_info_add" :category="options.category" @getInfo="getInfoList" />
    <!-- 编辑的弹窗 -->
    <DialogEditInfo
      :flag.sync="dialog_info_edit"
      :id="infoId"
      :category="options.category"
      @getInfo="getInfoList"
    />
  </div>
</template>
<script>
import SelectVue from "@c/Select";
import DialogInfo from "./dialog/info.vue";
import DialogEditInfo from "./dialog/edit.vue";
import { timestampToTime } from "@/utils/common.js";
import { GetCategory, GetList, DeleteInfo } from "@/api/news.js";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global.js";
import { common } from "@/api/common.js";
export default {
  components: {
    DialogInfo,
    DialogEditInfo,
    SelectVue
  },
  setup(props, { root }) {
    const { confirm } = global();
    const { getInfoCategory, category } = common();
    /**
     * 数据
     */
    const category_value = ref("");
    const data_value = ref("");
    const search_key = ref("id");
    const search_keyWork = ref("");
    const dialog_info_add = ref(false);
    const dialog_info_edit = ref(false);
    const total = ref(0);
    const loadingData = ref(false);
    const deleteInfoId = ref("");
    const infoId = ref("");
    // 搜索关键字
    const data = reactive({
      configOption: {
        init: ["id", "title"]
      }
    });
    const search_option = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    const options = reactive({
      category: []
    });
    const page = reactive({
      pageNumber: 1,
      pageSize: 5
    });
    //表格数据
    const table_data = reactive({
      item: []
    });
    /**
     * 方法
     */
    const handleSizeChange = val => {
      page.pageSize = val;
      getInfoList();
    };
    const handleCurrentChange = val => {
      page.pageNumber = val;
      getInfoList();
    };
    const handleSelectionChange = value => {
      let id = value.map(item => item.id); //映射
      deleteInfoId.value = id;
    };
    const delete_item = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "确定删除此信息?",
        tip: "提示",
        method: confirmDelete
      });
    };
    const detele_all = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        root.$message({
          message: "请选择要删除的数据",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确定批量删除信息?",
        tip: "提示",
        method: confirmDelete
      });
    };
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value })
        .then(response => {
          root.$message({
            message: response.data.message,
            type: "success"
          });
          deleteInfoId.value = "";
          getInfoList();
        })
        .catch(error => {});
    };
    const searchInfo = () => {
      console.log(formatData());
      getInfoList();
    };
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类ID
      if (category_value.value) {
        requestData.categoryId = category_value.value;
      }
      // 日期
      if (data_value.value.length > 0) {
        requestData.startTiem = data_value.value[0];
        requestData.endTime = data_value.value[1];
      }
      // 关键字
      if (search_keyWork.value) {
        requestData[search_key.value] = search_keyWork.value;
      }
      return requestData;
    };
    const getInfoList = () => {
      let requestData = formatData();
      loadingData.value = true;
      GetList(requestData)
        .then(response => {
          // 更新数据;
          let responseData = response.data.data;
          table_data.item = responseData.data;
          // 更新页码统计数量;
          total.value = responseData.total;
          loadingData.value = false;
        })
        .catch(error => {
          loadingData.value = false;
        });
    };
    // 时间戳转换正常时间
    const toData = row => {
      return timestampToTime(row.createDate);
    };
    // 类型转换
    const toCategory = row => {
      let categoryData = options.category.filter(
        item => item.id == row.categoryId
      )[0];
      if (!categoryData) {
        return false;
      }
      return categoryData.category_name;
    };
    //
    const editInfo = val => {
      infoId.value = val;
      dialog_info_edit.value = true;
    };
    const detailed = row => {
      // 优先存储
      root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        // 里面的值要改动
        id: {
          value: row.id,
          session: true,
          sessionKey: "infoId"
        }
      });
      //跳转页面
      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: row.id
        }
      });
    };
    /**
     * 生命周期
     */
    onMounted(() => {
      // 获取分类
      getInfoCategory();
      // 获取列表
      getInfoList();
    });
    /**
     * watch监听
     */
    watch(
      () => category.item,
      value => {
        options.category = value;
      }
    );
    return {
      // ref
      category_value,
      data_value,
      search_key,
      search_keyWork,
      dialog_info_add,
      dialog_info_edit,
      total,
      loadingData,
      deleteInfoId,
      infoId,
      // reactive
      data,
      search_option,
      options,
      page,
      table_data,
      // 方法名
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      delete_item,
      detele_all,
      confirmDelete,
      toData,
      toCategory,
      detailed,
      searchInfo,
      editInfo,
      getInfoList
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60px, 40px);
  }
  &.date {
    @include labelDom(right, 70px, 40px);
  }
  &.key-work {
    @include labelDom(right, 80px, 40px);
  }
}
</style>