/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">接口访问统计</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="20">
        <SearchForm :searchData="searchData" @handleSubmit="handleSearch"></SearchForm>
      </el-col>

    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="90px" prop="id" label="ID" align="center"></el-table-column>
      <el-table-column width="140px" prop="userPhone" label="访问账号" align="center"></el-table-column>
      <el-table-column width="140px" prop="ip" label="IP" align="center"></el-table-column>
      <el-table-column width="280px" prop="interfaceName" label="接口名" align="center"></el-table-column>
      <el-table-column width="180px" prop="url" label="URL" align="center"></el-table-column>
      <el-table-column width="90px" prop="interfaceCount" label="访问次数" align="center"></el-table-column>
      <el-table-column width="90px" prop="averageTime" label="平均耗时" align="center"></el-table-column>
      <el-table-column width="90px" prop="consumeTime" label="访问耗时" align="center"></el-table-column>
      <el-table-column width="90px" prop="status" label="访问状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" prop="createTime" label="访问日期" align="center"></el-table-column>
      <el-table-column width="120px" prop="remark" label="备注" align="center"></el-table-column>
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
    ...mapState("interfaceAccess", {
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

      //发送查询接口耗时统计请求
      API.POST(URL.INTERFACE_ACCESS, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("interfaceAccess/list",res);
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
