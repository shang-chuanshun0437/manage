/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-dialog title="添加管理员" :modal=true :modal-append-to-body="false" :visible="show" top="15%" class="bindDialog" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item  label="管理员账号" prop="userPhone">
          <el-col :span="12">
            <el-input v-model="ruleForm.userPhone" placeholder="角色名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="管理员名称" prop="userName">
          <el-col :span="12">
            <el-input v-model="ruleForm.userName" placeholder="请输入管理员名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-checkbox-group  v-model="ruleForm.roleName">
            <el-checkbox v-for="(item,index) in roleList" :key="index" :label="item.roleName">{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click.native="cancel()">取消</el-button>
          <el-button type="primary" :disabled="confirm" @click.native="handleAdd()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import * as API from "../../axios/api";
import * as URL from "../../axios/url";

export default {
  props: ["show"],
  data: function() {
    return {
      confirm:false,
      roleList: [],
      ruleForm: {
        userPhone: "",
        userName: "",
        roleName: [],
      },
      rules: {
        userPhone: [
          { required: true, message: "请输入管理员账号", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入管理员名称", trigger: "blur" }
        ],
        roleName: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    refresh(){
      console.log('++===============================================');
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token , currentPage: 1 });
      //发送查询角色列表的请求
      API.POST(URL.ROLE_LIST, param)
        .then(res => {
          if (res.result.retCode === 0) {
            console.log(res);
            let self = this;
            self.roleList=[];
            this.loading = false;
            if(res.roles  && res.roles.length>0) {
              res.roles.forEach(e => {
                self.roleList.push(e);
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.$emit("update:show", false);
    },
    handleAdd() {
      this.confirm=true;
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,addPhone: this.ruleForm.userPhone ,
        addName: this.ruleForm.userName,userRole:this.ruleForm.roleName});

      //设备入库
      API.POST(URL.ROLE_USER_ADD_LIST, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.confirm=false;
            this.$emit("update:show", false);
            parent.location.reload();
          }
        })
        .catch(err => {
          this.confirm=false;
          console.log(err);
        });
    },
    handleClose() {
      this.$emit("update:show", false);
    }
  },
   beforeUpdate() {
      if( this.ruleForm.userPhone != '' & this.ruleForm.userName != '' & this.ruleForm.roleName != '')
      {
        this.confirm = false;
      }
      else{
        this.confirm = true;
      }
    },
  created() {
    this.refresh();
  },
};
</script>

<style scoped>
  .bindDialog{
    margin:center;
  }
  .user-add__item {
    padding: 20px 0px;
    border-bottom: 1px solid #e6e9ed;
    margin-bottom: 0px;
  }
</style>
