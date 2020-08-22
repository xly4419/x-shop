<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({btn_type:'category_first_add'})" size="medium">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="category-wrap">
            <div class="category" v-for="item in category_data.item" :key="item.id">
              <h4>
                <template @click="showChild(item)">
                  <svg-icon :icon-class="item.iconClass"></svg-icon>
                  {{item.category_name}}
                </template>
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="editCategoryBtn({data:item,btn_type:'category_first_edit'})"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="addChildren({data:item,btn_type:'category_children_add'})"
                  >添加子级</el-button>
                  <el-button size="mini" round @click="deleteCategoryConfirm(item.id)">删除</el-button>
                </div>
              </h4>
              <div class="CloseDetail" :class="{'MoreDetail':item.showAll === true}">
                <ul v-if="item.children">
                  <li v-for="childItem in item.children" :key="childItem.id">
                    {{childItem.category_name}}
                    <div class="button-group">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="editCategoryBtn({btn_type:'category_children_edit'})"
                        round
                      >编辑</el-button>
                      <el-button size="mini" round @click="deleteCategoryConfirm(childItem.id)">删除</el-button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form :model="formCategory" label-width="120px" class="form-wrap" ref="categoryForm">
            <el-form-item label="一级分类名称" v-if="category_first_input">
              <el-input v-model="formCategory.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称" v-if="category_children_input">
              <el-input
                v-model="formCategory.secCategoryName"
                :disabled="category_children_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_loading"
                :disabled="submit_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global.js";
import { common } from "@/api/common.js";
import {
  AddFirstCategory,
  AddChildrenCategory,
  DeleteCategory,
  EditCategory
} from "@/api/news.js";
export default {
  name: "category",
  setup(props, { root, refs }) {
    const { confirm } = global();
    const { category, getInfoCategory, getInfoCategoryAll } = common();
    /**
     *  ref
     */
    // 一级分类输入框存在
    const category_first_input = ref(true);
    // 二级分类输入框存在
    const category_children_input = ref(true);
    // 一级分类输入框禁用
    const category_first_disabled = ref(true);
    // 二级分类输入框禁用
    const category_children_disabled = ref(true);
    // 确认按钮加载
    const submit_loading = ref(false);
    // 确认按钮禁用
    const submit_disabled = ref(true);
    const submit_button_type = ref("");
    const deleteId = ref("");
    /**
     * reactive
     */
    const formCategory = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category_data = reactive({
      item: [],
      current: []
    });
    /**
     * 方法
     */
    const submit = () => {
      if (submit_button_type.value == "category_first_add") {
        // 添加一级分类
        addFirstCategory();
      }
      if (submit_button_type.value == "category_first_edit") {
        // 编辑一级分类
        editCategory();
      }
      if (submit_button_type.value == "category_children_add") {
        // 添加二级分类
        addChildrenCategory();
      }
      if (submit_button_type.value == "category_children_edit") {
        // 编辑二级分类
        console.log("编辑二级分类");
      }
    };
    // 添加一级分类（按钮）
    const addFirst = value => {
      resetForm();
      submit_button_type.value = value.btn_type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_disabled.value = false;
    };
    // 添加一级分类（接口函数）
    const addFirstCategory = () => {
      let requsetData = {
        categoryName: formCategory.categoryName
      };
      if (!formCategory.categoryName) {
        root.$message({
          message: "分类名称不能为空",
          type: "error "
        });
        return false;
      }
      // 按钮加载状态
      submit_loading.value = true;
      AddFirstCategory(requsetData)
        .then(response => {
          let data = response.data;
          if (data.resCode == 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            // category_data.item.push(data.data); //追加进数组里
            getInfoCategoryAll();
          }
          submit_loading.value = false;
          //   refs.categoryForm.resetFields();
          resetForm();
        })
        .catch(error => {
          submit_loading.value = false;
        });
    };
    // 添加二级分类（按钮）
    const addChildren = value => {
      // 存储数据
      category_data.current = value.data;
      // 显示一级文本分类
      formCategory.categoryName = category_data.current.category_name;
      // 确认按钮的类型
      submit_button_type.value = value.btn_type;
      // 显示一级输入框
      category_first_input.value = true;
      // 禁用一级输入框
      category_first_disabled.value = true;
      // 显示子级输入框
      category_children_input.value = true;
      // 启用子级输入框
      category_children_disabled.value = false;
      // 启用确认按钮
      submit_disabled.value = false;
    };
    // 添加二级分类（接口函数）
    const addChildrenCategory = () => {
      let requsetData = {
        categoryName: formCategory.secCategoryName,
        parentId: category_data.current.id
      };
      if (!formCategory.secCategoryName) {
        root.$message({
          message: "分类名称不能为空",
          type: "error"
        });
        return false;
      }
      submit_loading.value = true;
      AddChildrenCategory(requsetData)
        .then(response => {
          let responseData = response.data;
          root.$message({
            message: responseData.message,
            type: "success"
          });
          getInfoCategoryAll();
          //  清空当前一级数据
          submit_loading.value = false;
          formCategory.secCategoryName = "";
        })
        .catch(error => {
          submit_loading.value = false;
        });
    };
    // 修改分类（按钮）
    const editCategoryBtn = value => {
      submit_button_type.value = value.btn_type; // 确认按钮类型为 修改
      category_data.current = value.data; // 储存当前的数据对象
      if (submit_button_type.value === "category_first_edit") {
        //  一级分类修改
        category_first_input.value = true;
        category_children_input.value = false;
        category_first_disabled.value = false;
        submit_disabled.value = false;
        formCategory.categoryName = value.data.category_name;
      } else if (submit_button_type.value === "category_children_edit") {
        // 二级分类修改  还未开发
        category_first_input.value = false;
        category_children_input.value = true;
        category_children_disabled.value = false;
        submit_disabled.value = false;
        formCategory.categoryName = value.data.category_name;
      }
    };
    // 修改分类（接口方法）
    const editCategory = () => {
      if (category_data.current.length == 0) {
        // 当前没有修改数据
        root.$message({
          message: "未选择分类",
          type: "warning"
        });
        return false;
      }
      if (formCategory.categoryName == "") {
        root.$message({
          message: "分类名称不能为空",
          type: "warning"
        });
        return false;
      }
      let requsetData = {
        id: category_data.current.id,
        categoryName: formCategory.categoryName
      };
      EditCategory(requsetData)
        .then(response => {
          let responseData = response.data;
          root.$message({
            message: responseData.message,
            type: "success"
          });
          //更新页面信息
          category_data.current.category_name =
            responseData.data.data.categoryName;
          // 清空
          // resetForm();
          category_data.current = [];
        })
        .catch(error => {});
    };
    // 删除警告
    const deleteCategoryConfirm = val => {
      deleteId.value = val;
      confirm({
        content: "确定删除此分类信息?",
        tip: "提示",
        method: deleteCategory,
        catch: () => {
          deleteId.value = "";
        }
      });
    };
    // 删除
    const deleteCategory = () => {
      let requsetData = {
        categoryId: deleteId.value
      };
      DeleteCategory(requsetData)
        .then(response => {
          if (response.data.resCode == 0) {
            root.$message({
              message: response.data.message,
              type: "success"
            });
            /**
             * 在页面上删除  两种方法
             * 对数组进行操作  splice()     splice(指定起始位置,删除数量,新数据)
             * 找到删除的索引  findIndex()
             *
             * filter() 过滤器方法生成新数组
             * let newData = category_data.item.filter(item => item.id != deleteId.value);
             * category_data.item = newData;
             *
             *  let index = category_data.item.findIndex(item => item.id == deleteId.value );
             *  category_data.item.splice(index, 1);
             */
            getInfoCategoryAll();
          }
        })
        .catch(error => {});
    };
    //清空输入框
    const resetForm = () => {
      formCategory.categoryName = "";
      formCategory.secCategoryName = "";
    };
    // 显示子级
    const showChild = item => {
      item.showAll = !item.showAll;
      if (item.showAll === true) {
        item.iconClass = "minus";
      }else{
        item.iconClass = "plus";
      }
    };
    /**
     * 生命周期
     */
    onMounted(() => {
      // getInfoCategory();
      getInfoCategoryAll();
    });
    /**
     * watch 监听
     */
    watch(
      () => category.item,
      value => {
        category_data.item = value;
      }
    );
    return {
      // ref
      category_first_input,
      category_children_input,
      category_first_disabled,
      category_children_disabled,
      submit_loading,
      submit_disabled,
      submit_button_type,
      deleteId,
      // reactive
      formCategory,
      category_data,
      // 方法
      submit,
      addFirst,
      addChildren,
      editCategoryBtn,
      editCategory,
      deleteCategoryConfirm,
      deleteCategory,
      resetForm,
      showChild
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.menu-title {
  padding-left: 22px;
  line-height: 44px;
  background-color: #f3f3f3;
}
.category {
  cursor: pointer;
  position: relative;
  line-height: 44px;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 14px;
    font-size: 16px;
    background-color: #fff;
  }
  li {
    position: relative;
    margin-left: 24px;
    padding-left: 36px;
    &:before {
      content: "";
      position: absolute;
      width: 32px;
      left: 0;
      top: 23px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.3s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 11px;
  top: -1px;
  button {
    font-size: 10px;
  }
}
.form-wrap {
  padding-top: 26px;
  width: 410px;
}
.hr-e9e9e9 {
  width: calc(100% + 60px); //? 计算属性
  margin-left: -30px;
  border: none;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9e9e9;
}
.CloseDetail {
  display: none;
}
.MoreDetail {
  display: block;
}
</style>