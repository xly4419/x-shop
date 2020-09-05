import { RequestUrl } from "@/api/requestUrl.js";
import { loadTableData } from "@/api/common.js";
let tableLoadData = {
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {
        this.tableLoadData()
    },
    methods: {
        tableLoadData() {
            let requestJson = this.tableConfig.requestData;
            let requestData = {
                url: RequestUrl[requestJson.url],
                method: requestJson.method,
                data: requestJson.data
            };
            loadTableData(requestData)
                .then(response => {
                    let responseData = response.data.data.data
                    if (responseData && responseData.length > 0) {
                        this.tableDataItem = responseData;
                        this.total = response.data.data.total;
                    }
                })
                .catch(error => { });
        }
    }
}
export default tableLoadData;