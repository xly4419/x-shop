let pagination = {
    data() {
        return {
            currentPage: 1,
            pageSize: 5,
            pageSizes: [5, 10, 20, 30],
            total: 100
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        handleSizeChange(val) {
            this.tableConfig.requestData.data.pageSize = val;
            this.tableLoadData();
        },
        handleCurrentChange(val) {
            this.tableConfig.requestData.data.pageNumber = val
            this.tableLoadData();
        }
    }
}
export default pagination;