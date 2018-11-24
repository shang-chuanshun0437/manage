/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item  label="设备编号" prop="deviceNum">
        <el-col :span="12">
          <el-input v-model="ruleForm.deviceNum" placeholder="请输入设备编号"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="买家手机号" prop="buyerPhone">
        <el-col :span="12">
          <el-input v-model="ruleForm.buyerPhone" placeholder="请输入买家手机号"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="买家名称" prop="buyerName">
        <el-col :span="12">
          <el-input v-model="ruleForm.buyerName" placeholder="请输入买家名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="发货地址" prop="buyerAddress">
        <el-col :span="12">
          <el-input v-model="ruleForm.buyerAddress" placeholder="请输入发货地址"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="快递公司" prop="expressName">
        <el-col :span="12">
          <el-input v-model="ruleForm.expressName" placeholder="请输入快递公司名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="快递单号" prop="expressId">
        <el-col :span="12">
          <el-input v-model="ruleForm.expressId" placeholder="请输入快递单号"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="报修原因" prop="remark">
        <el-col :span="12">
          <el-input v-model="ruleForm.remark" placeholder="请输入报修原因"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item style="width:60%;">
        <el-button type="primary" style="width:40%;" @click.native.prevent="cancel" >取消</el-button>
        <el-button type="primary" style="width:40%;" @click.native.prevent="handleEdit" :disabled="confirm">新增</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
import * as API from "../../../axios/api";
import * as URL from "../../../axios/url";

export default {
  data: function() {
    return {
      confirm:true,
      ruleForm: {
        deviceNum:"",
        buyerPhone: "",
        buyerName: "",
        buyerAddress: "",
        expressName: "",
        expressId: "",
        remark: "",
      },
      rules: {
        deviceNum: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        buyerPhone: [
          { required: true, message: "请输入买家手机号", trigger: "blur" }
        ],
        buyerName: [
          { required: true, message: "请输入买家名称", trigger: "blur" }
        ],
        buyerAddress: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ],
        expressName: [
          { required: true, message: "请输入快递公司名称", trigger: "blur" }
        ],
        expressId: [
          { required: true, message: "请输入快递单号", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入报修原因", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    cancel() {
      this.$router.go(-1);
    },
    handleEdit() {
      this.confirm=false;
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone ,token: user.token , deviceNum: this.ruleForm.deviceNum ,
        buyerPhone: this.ruleForm.buyerPhone, buyerName: this.ruleForm.buyerName ,buyerAddress: this.ruleForm.buyerAddress,
        expressName: this.ruleForm.expressName ,expressId: this.ruleForm.expressId,remark: this.ruleForm.remark,status: 6});

      //添加报修订单
      API.POST(URL.ORDER_ADD_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.$router.go(-1);
            this.$message({
            message: '添加成功',
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
  },
  beforeUpdate() {
      if( this.ruleForm.orderId != ''& this.ruleForm.buyerPhone != '' & this.ruleForm.buyerName != ''& this.ruleForm.buyerAddress != '' &
        this.ruleForm.expressName != ''& this.ruleForm.expressId != '' & this.ruleForm.remark != '')
      {
        this.confirm = false;
      }
      else{
        this.confirm = true;
      }
  },
  created() {
  }
};
</script>

<style scoped>
  .editDialog{
    margin:center;
  }
</style>
