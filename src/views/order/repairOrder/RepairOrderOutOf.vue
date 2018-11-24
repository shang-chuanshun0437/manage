/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item  label="ID" prop="id">
        <el-col :span="12">
          <el-input v-model="ruleForm.id" :disabled="true"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item  label="设备编号" prop="deviceNum">
        <el-col :span="12">
          <el-input v-model="ruleForm.deviceNum" :disabled="true"></el-input>
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
      <el-form-item label="收货地址" prop="buyerAddress">
        <el-col :span="12">
          <el-input v-model="ruleForm.buyerAddress" placeholder="请输入收货地址"></el-input>
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
      <el-form-item label="快递费用" prop="expressId">
        <el-col :span="12">
          <el-input v-model="ruleForm.postage" placeholder="请输入快递费用"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-col :span="12">
          <el-input v-model="ruleForm.remark" placeholder="请输入备注信息"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item style="width:60%;">
        <el-button type="primary" style="width:40%;" @click.native.prevent="cancel" >取消</el-button>
        <el-button type="primary" style="width:40%;" @click.native.prevent="handleEdit" :disabled="confirm">发货</el-button>
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
        id:"",
        deviceNum:"",
        buyerPhone: "",
        buyerName: "",
        buyerAddress: "",
        expressName: "",
        expressId: "",
        remark: "",
        postage:"",
      },
      rules: {
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
        postage: [
          { required: true, message: "请输入快递费用", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入备注信息", trigger: "blur" }
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
      var param = Object.assign({}, {userPhone: user.userPhone ,token: user.token , id: this.ruleForm.id,deviceNum: this.ruleForm.deviceNum ,
        unitPrice: 0,buyerPhone: this.ruleForm.buyerPhone, buyerName: this.ruleForm.buyerName ,buyerAddress: this.ruleForm.buyerAddress,
        expressName: this.ruleForm.expressName ,expressId: this.ruleForm.expressId,postage: this.ruleForm.postage,remark: this.ruleForm.remark,status: 2});

      //绑定设备
      API.POST(URL.ORDER_SELL_UPDATE_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.$router.go(-1);
            this.$message({
            message: '发货成功',
            type: 'success'
            });
          }
        })
        .catch(err => {
          this.confirm=false;
        });
    },
    handleClose() {
      this.$emit("update:show", false);
    }
  },
  beforeUpdate() {
      if( this.ruleForm.buyerPhone != '' & this.ruleForm.buyerName != ''& this.ruleForm.buyerAddress != '' &
        this.ruleForm.expressName != ''& this.ruleForm.expressId != '' & this.ruleForm.remark != '' & this.ruleForm.postage != '')
      {
        this.confirm = false;
      }
      else{
        this.confirm = true;
      }
  },
  created() {
    this.ruleForm.id = this.$route.query.id;
    this.ruleForm.deviceNum = this.$route.query.deviceNum;
    this.ruleForm.buyerPhone = this.$route.query.buyerPhone;
    this.ruleForm.buyerName = this.$route.query.buyerName;
    this.ruleForm.buyerAddress = this.$route.query.buyerAddress;
    this.ruleForm.remark = this.$route.query.remark;
  }
};
</script>

<style scoped>
  .editDialog{
    margin:center;
  }
</style>
