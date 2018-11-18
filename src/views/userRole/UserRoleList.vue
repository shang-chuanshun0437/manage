/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">管理员列表</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="20">
        <SearchForm :searchData="searchData" @handleSubmit="handleSearch"></SearchForm>
      </el-col>
      <el-col :span="3" :offset="1" align="center">
        <el-button type="primary" icon="el-icon-plus" @click="addRole()">添加管理员</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="管理员ID" align="center"></el-table-column>
      <el-table-column prop="userPhone" label="用户" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
      <el-table-column width="180" prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column width="180" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id,scope.row.roleName)">删除</el-button>
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
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
      name: "角色名称",
      type: "input",
      placeholder: "请输入角色名称",
      key: "roleName"
    },
];
export default {
  components: {
    SearchForm,
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
      editShow:false,
      id:"",
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
        roleName:this.filters.roleName,currentPage: this.currentPage });

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
    handleDelete(id,name) {
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,id: id});

      swal({
        title: "确定？",
        text: "你确定要删除: " + name + "  角色吗？",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          //删除角色
          API.POST(URL.ROLE_DELETE, param)
            .then(res => {
              if (res.result.retCode === 0) {
                swal({
                  title: "已删除",
                  text: "删除角色成功",
                  icon: "success",
                  button: "确认"
                }).then(() => {
                  console.log('unbindDevice');
                  this.refresh();
                });
              }
            })
            .catch(err => {
              //this.confirm=false;
              if(err.response.status === 400)
              {
                this.$message.error('输入错误，设备编号只包含数字！');
              }else{
                this.$message.error('系统正在升级中，请联系管理员！');
              }
            });
        }
      })
    },
    enableDevice(id,status){
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,
        id:id, status: status });
      API.POST(URL.ROLE_UPDATE, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
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
    handleEdit(id){
      this.id = id;
      this.editShow = true;
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
