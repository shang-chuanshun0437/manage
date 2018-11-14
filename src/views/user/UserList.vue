/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">用户列表</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="20">
        <SearchForm :searchData="searchData" @handleSubmit="handleSearch"></SearchForm>
      </el-col>

    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userPhone" label="用户账号" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="userEmail" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="userAddress" label="地址" align="center"></el-table-column>
      <el-table-column prop="createTime" label="注册日期" align="center"></el-table-column>
    </el-table>
    <el-row style="text-align:center;margin-top:15px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next,jumper" :total="total">
      </el-pagination>
    </el-row>
  </div>

</template>

<script>
import SearchForm from "../common/SearchForm";
import { mapState } from "vuex";
import * as API from "../../axios/api";
import * as URL from "../../axios/url";
const searchData = [

  {
      name: "用户手机号",
      type: "input",
      placeholder: "请输入用户手机号",
      key: "userPhone"
    },
];
export default {
  components: {
    SearchForm,
  },
  computed: {
    ...mapState("user", {
      total: state => state.total,
      list: state => state.list
    })
  },
  data() {
    return {
      loading: true,
      currentPage: 1,
      searchData: searchData,
      filters: {
        userPhone: "",
      }
    };
  },
  created() {

    this.refresh();
  },
  methods: {
    refresh() {
      //debugger
      console.log('refresh');
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,
        needPhone:this.filters.userPhone,currentPage: this.currentPage });

      //发送查询设备下的用户列表请求
      API.POST(URL.QUERY_ALL_USER_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("user/list",res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleSearch(params) {
      console.log(params);
      this.filters=Object.assign({},params);
      this.refresh();
    },
    clickRow(row){
      this.$refs.moviesTable.toggleRowSelection(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.refresh();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style>
  .panel-heading{
    background: #eee;
    height: 20px;
    margin: 0px;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid #DEE5E7;
  }
  .panel-text{
    position:relative;
    left:30px;
    top:1px;
    font-size:16px;
  }
</style>
