/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-dialog title="添加角色" :modal=true :modal-append-to-body="false" :visible="show" top="15%" class="bindDialog" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
        <el-form-item  label="角色名称" prop="roleName">
          <el-col :span="12">
            <el-input v-model="ruleForm.roleName" placeholder="角色名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-col :span="12">
            <el-input v-model="ruleForm.roleDesc" placeholder="请输入角色描述"></el-input>
          </el-col>
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
      ruleForm: {
        roleName: "",
        roleDesc: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请填写角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    cancel() {
      this.$emit("update:show", false);
    },
    handleAdd() {
      this.confirm=true;
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,roleName: this.ruleForm.roleName ,
      roleDesc: this.ruleForm.roleDesc});

      //设备入库
      API.POST(URL.ROLE_ADD, param)
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
      if( this.ruleForm.roleName != '' & this.ruleForm.roleDesc != '')
      {
        this.confirm = false;
      }
      else{
        this.confirm = true;
      }
    },
  created() {
    console.log('AddDeviceIn');
  }
};
</script>

<style scoped>
  .bindDialog{
    margin:center;
  }
</style>
