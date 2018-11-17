/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">角色列表</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="20">
        <SearchForm :searchData="searchData" @handleSubmit="handleSearch"></SearchForm>
      </el-col>
      <el-col :span="3" :offset="1" align="center">
        <el-button type="primary" icon="el-icon-plus" @click="addRole()">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="角色ID" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
      <el-table-column width="90px" prop="status" label="角色状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column width="270" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.deviceNum)">删除</el-button>
          <el-button size="mini" @click="handleEdit(scope.row.deviceNum)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.status===1" @click="enableDevice(scope.row.id,scope.row.status)">停用</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.status===2" @click="enableDevice(scope.row.id,scope.row.status)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="text-align:center;margin-top:15px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next,jumper" :total="total">
      </el-pagination>
    </el-row>

    <AddRole :show.sync="addShow" ></AddRole>
  </div>

</template>

<script>
import SearchForm from "../common/SearchForm";
import AddRole from "./AddRole";

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
    AddRole,
  },
  computed: {
    ...mapState("role", {
      total: state => state.total,
      list: state => state.list
    })
  },
  data() {
    return {
      loading: true,
      currentPage: 1,
      addShow:false,
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

      //发送查询短信统计请求
      API.POST(URL.ROLE_LIST, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("role/list",res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addRole() {
      this.addShow = true;
    },
    enableDevice(id,status){
      if(status ===1) {
        status = 2;
      }
      else{
        status = 1;
      }
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,
        id:id,status: status });
      API.POST(URL.ROLE_UPDATE, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("role/list",res);
            this.refresh();
            this.$message({
              message: '修改成功',
              type: 'success'
            });
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
