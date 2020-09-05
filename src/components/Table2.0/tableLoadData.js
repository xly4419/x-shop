import { reactive } from "@vue/composition-api";
import { RequestUrl } from "@/api/requestUrl.js";
import { loadTableData } from "@/api/common.js";
export function LoadData() {
    const tableData = reactive({
        item: [],
        total: 0
    });

    const tableLoadData = (params) => {
        let requestJson = params;
        let requestData = {
            url: RequestUrl[requestJson.url],
            method: requestJson.method,
            data: requestJson.data
        };
        loadTableData(requestData)
            .then(response => {
                let responseData = response.data.data.data
                if (responseData && responseData.length > 0) {
                    tableData.item = responseData;
                    tableData.total = response.data.data.total;
                }
            })
            .catch(error => { });
    }
    return {
        tableData,
        tableLoadData
    }
}
/**
 * 业务逻辑  --  获取表格数据
 * tableData           得到的数据
 * tableLoadData       调接口返回数据赋值给tableData
 */