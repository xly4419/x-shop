import { reactive } from "@vue/composition-api";

export function paginationHook() {
    const pageData = reactive({
        currentPage: 1,
        pageSize: 5,
        pageSizeS: [5, 10, 20, 30],
        total: 100
    });
    // 统计条数综合总和
    const totalCount = val => pageData.total = val;
    const handleSizeChange = (val) => {
        pageData.pageSize = val;
    };
    const handleCurrentChange = (val) => {
        pageData.currentPage = val;
    }
    return {
        pageData,
        totalCount,
        handleSizeChange,
        handleCurrentChange
    }
}
/**
 * 业务逻辑  --  页面变化功能
 * pageData
 * handleSizeChange
 * handleCurrentChange
 */