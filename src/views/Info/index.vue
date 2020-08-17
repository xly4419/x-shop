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
            <el-select v-model="search_key" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in search_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width: 100%;"></el-input>
      </el-col>

      <el-col :span="2">
        <el-button type="danger" style="width: 100%;">搜索</el-button>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%;"
          @click="dialog_info= true"
        >新增</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格数据 -->
    <el-table :data="table_data" border style="width: 100%">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="title" label="标题" width="440"></el-table-column>
      <el-table-column prop="category" label="类型" width="90"></el-table-column>
      <el-table-column prop="date" label="日期" width="150"></el-table-column>
      <el-table-column prop="user" label="管理员" width="70"></el-table-column>
      <el-table-column label="操作">
        <template>
          <!--slot-scope="scope"-->
          <el-button type="danger" size="mini" @click="delet_item">删除</el-button>
          <el-button type="success" size="mini" @click="dialog_info= true">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button type size="medium" @click="delet_all">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增的弹窗 -->
    <DialogInfo :flag.sync="dialog_info" :category="options.category" />
  </div>
</template>
<script>
import { timestampToTime } from "@/utils/common.js";
import { GetCategory, GetList } from "@/api/news.js";
import DialogInfo from "./dialog/info.vue";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global.js";
import { common } from "@/api/common.js";
export default {
  components: {
    DialogInfo
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
    const dialog_info = ref(false);
    const total = ref(0);
    // 搜索关键字
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
      pageSize: 10
    });
    //表格数据
    const table_data = reactive([
      {
        title: "上海市普陀区金沙江路 1518 弄",
        category: "国内信息",
        date: "2016-05-02",
        user: "管理员"
      },
      {
        title: "上海市普陀区金沙江路 1518 弄",
        category: "国内信息",
        date: "2016-05-02",
        user: "管理员"
      },
      {
        title: "上海市普陀区金沙江路 1518 弄",
        category: "国内信息",
        date: "2016-05-02",
        user: "管理员"
      },
      {
        title: "上海市普陀区金沙江路 1518 弄",
        category: "国内信息",
        date: "2016-05-02",
        user: "管理员"
      }
    ]);
    /**
     * 方法
     */
    const handleSizeChange = val => {
      page.pageSize = val;
      console.log(val);
    };
    const handleCurrentChange = val => {
      page.pageNumber = val;
      console.log(val);
    };
    const delet_item = () => {
      confirm({
        content: "确定删除此信息?",
        tip: "提示",
        method: confirmDelete,
        id: "一行"
      });
    };
    const delet_all = () => {
      confirm({
        content: "确定批量删除信息?",
        tip: "提示",
        method: confirmDelete,
        id: "批量"
      });
    };
    const confirmDelete = value => {
      console.log(value);
    };
    const getIngoList = () => {
      let requestData = {
        categoryId: "",
        startTiem: "",
        endTime: "",
        title: "",
        id: "",
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      GetList(requestData)
        .then(response => {
          //  更新数据
          // let responseData = response.data.data
          // table_data.item = responseData.data
          //更新页码统计数量
          // total.value = responseData.total
          console.log(response.data.data);
        })
        .catch(error => {});
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
      return categoryData.category_name;
    };
    /**
     * 生命周期
     */
    onMounted(() => {
      getInfoCategory();
      getIngoList();
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
      dialog_info,
      total,
      // reactive
      search_option,
      options,
      page,
      table_data,
      // 方法名
      handleSizeChange,
      handleCurrentChange,
      delet_item,
      delet_all,
      confirmDelete,
      toData,
      toCategory
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 70, 40);
  }
  &.key-work {
    @include labelDom(right, 80, 40);
  }
}
</style>