<template>
  <div>
    <el-table :data="tableDataItem" border>
      <!-- 多选框 -->
      <el-table-column v-if="tableConfig.selection" type="selection" width="50"></el-table-column>

      <template v-for="item in tableConfig.tHead">
        <!-- v-slot -->
        <el-table-column
          v-if="item.columnType == 'slot'"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 文本渲染框 -->
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          v-else
        ></el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="tableConfig.paginationShow"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="tableConfig.paginationLayout"
      :total="total"
      :class="tableConfig.paginationClass"
      background
    ></el-pagination>
  </div>
</template>
<script>
import tableLoadData from "@/mixins/tableLoadData.js";
import pagination from "@/mixins/pagination.js";
export default {
  name: "tableVue",
  mixins: [tableLoadData, pagination],
  data() {
    return {
      tableConfig: {
        selection: true,
        requestData: {},
        tHead: [],
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationClass: "pull-right"
      },
      tableDataItem: []
    };
  },
  beforeMount() {
    this.initTableConfig();
  },
  mounted() {},
  methods: {
    initTableConfig() {
      let configData = this.config;
      let keys = Object.keys(this.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          this.tableConfig[key] = configData[key];
        }
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
<!--
组件目录位置： src > compontents > Table > index.vue;
组件引用方式： import TableVue from "@c/Table";
template:    <TableVue :config="data.configTable" />
配置参数：
    configTable: {
        selection: true,                是否需要多选框
        tHead: [
            { 
                label: "邮箱/用户名"     :label绑定值
                field: "email"          :prop绑定值
                width                   列宽
                columnType              每一列的类型
                slotName                slot的name属性绑定值
            }
        ],
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        paginationShow: true,            是否需要页码
        paginationLayout: "total, sizes, prev, pager, next, jumper"      layout配置信息  
        paginationClass: "pull-right"           页码class属性
    },
-->
