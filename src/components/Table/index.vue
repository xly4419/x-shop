<template>
  <div>
    <el-table :data="data.tableDataItem" border @selection-change="thatSelectionChange">
      <!-- 多选框 -->
      <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>

      <template v-for="item in data.tableConfig.tHead">
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
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          <slot name="tableFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
            v-if="data.tableConfig.paginationShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizeS"
            :page-size="pageData.pageSize"
            :layout="data.tableConfig.paginationLayout"
            :total="pageData.total"
            :class="data.tableConfig.paginationClass"
            background
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  reactive,
  onBeforeMount,
  onMounted,
  watch
} from "@vue/composition-api";
import { LoadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    checkTableRow: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    // 加载数据
    const { tableData, tableLoadData } = LoadData({ root });
    // 页码
    const {
      pageData,
      totalCount,
      handleSizeChange,
      handleCurrentChange
    } = paginationHook();
    const data = reactive({
      tableConfig: {
        selection: true,
        requestData: {},
        tHead: [],
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationClass: "pull-right"
      },
      tableDataItem: []
    });
    /**
     * watch监听
     */
    watch(
      [() => tableData.item, () => tableData.total],
      ([tableData, tableCount]) => {
        data.tableDataItem = tableData;
        totalCount(tableCount);
      }
    );
    //页码监听
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        // 修改页码传值信息     通过页码组件改变
        let requestData = data.tableConfig.requestData;
        requestData.data.pageNumber = currentPage;
        requestData.data.pageSize = pageSize;
        refreshData();
      }
    );
    /**
     * 方法
     */

    // 初始化table配置项
    const initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };
    // 勾选checkbox多选
    const thatSelectionChange = val => {
      let rowData = {
        idItem: val.map(item => item.id)
      };
      emit("update:checkTableRow", rowData);
    };
    //刷新数据
    const refreshData = () => {
      tableLoadData(data.tableConfig.requestData);
    };
    // 带参数刷新数据（搜索后）
    const paramsLoadData = params => {
      let requestData = Object.assign({}, params, {
        pageNumber: data.tableConfig.requestData.data.pageNumber,
        pageSize: data.tableConfig.requestData.data.pageSize
      });
      data.tableConfig.requestData.data = requestData;
      tableLoadData(data.tableConfig.requestData);
    };
    onBeforeMount(() => {
      initTableConfig();
      //   laodData();
      refreshData();
    });
    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      thatSelectionChange,
      refreshData,
      paramsLoadData
    };
  }
};
</script>
<style lang="scss" scoped>
.table-footer {
  padding-top: 15px;
}
</style>
<!--
组件目录位置： src > compontents > Table > index.vue;
组件引用方式： import TableVue from "@c/Table";
template:    <TableVue :config="data.configTable" :checkTableRow.sync="data.checkTableRow" />
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
    // 多选框选择的数据
    checkTableRow: {},
-->
