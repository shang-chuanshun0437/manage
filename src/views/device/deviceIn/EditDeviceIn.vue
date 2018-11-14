/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-dialog title="编辑设备" :modal=true :modal-append-to-body="false" :visible="show" top="15%" class="editDialog" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
        <el-form-item  label="设备编号" prop="deviceNum">
          <el-col :span="12">
            <el-input v-model="deviceNum" :disabled="true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="设备MAC" prop="deviceMac">
          <el-col :span="12">
            <el-input v-model="ruleForm.deviceMac" placeholder="请输入设备MAC"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="设备版本" prop="version">
          <el-col :span="12">
            <el-input v-model="ruleForm.version" placeholder="请输入设备版本"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click.native="cancel()">取消</el-button>
          <el-button type="primary" :disabled="confirm" @click.native="handleEdit()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import * as API from "../../../axios/api";
import * as URL from "../../../axios/url";

export default {
  props: ["show","deviceNum"],
  data: function() {
    return {
      confirm:false,
      ruleForm: {
        deviceMac: "",
        version: "",
      },
      rules: {
        deviceMac: [
          { required: true, message: "请填写设备MAC", trigger: "blur" }
        ],
        version: [
          { required: true, message: "请填写设备版本", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    cancel() {
      this.$emit("update:show", false);
    },
    handleEdit() {
      this.confirm=true;
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone ,token: user.token ,bluetoothMac: this.ruleForm.deviceMac ,
      deviceNum: this.deviceNum ,version: this.ruleForm.version });

      //绑定设备
      API.POST(URL.DEVICE_IN_UPDATE_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.confirm=false;
            this.$emit("update:show", false);
            parent.location.reload();
            this.$message({
            message: '修改成功',
            type: 'success'
            });
          }else
          {
            this.confirm=false;
            this.$message.error('请输入正确的11位设备编号！');
            console.log(res.result.retCode);
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
      if( this.ruleForm.deviceMac != ''& this.ruleForm.version != '')
      {
        this.confirm = false;
      }
      else{
        this.confirm = true;
      }
  },
  created() {
    console.log('editDevice');
  }
};
</script>

<style scoped>
  .editDialog{
    margin:center;
  }
</style>
