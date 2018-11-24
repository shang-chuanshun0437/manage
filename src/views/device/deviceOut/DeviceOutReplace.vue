/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label="修改订单">
      <el-form-item  label="设备编号" prop="deviceNum">
        <el-col :span="12">
          <el-input v-model="ruleForm.deviceNum" :disabled="true"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item  label="退/换货" prop="status">
        <el-col :span="12">
          <el-select v-model="ruleForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
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
      <el-form-item label="退/换货原因" prop="remark">
        <el-col :span="12">
          <el-input v-model="ruleForm.remark" placeholder="请输入退/换货原因"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item style="width:60%;">
        <el-button type="primary" style="width:40%;" @click.native.prevent="cancel" >取消</el-button>
        <el-button type="primary" style="width:40%;" @click.native.prevent="confirmOk" :disabled="confirm">确认</el-button>
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
      options: [{
        value: '5',
        label: '换货'
        }, {
          value: '4',
          label: '退货'
        }
      ],
      ruleForm: {
        deviceNum:"",
        status:"",
        buyerPhone: "",
        buyerName: "",
        buyerAddress: "",
        expressName: "",
        expressId: "",
        remark: "",
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
        status: [
          { required: true, message: "请选择退换货", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入退/换货原因", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    cancel() {
      this.$router.push("/device/out");
    },
    confirmOk() {
      this.confirm=false;
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone ,token: user.token , deviceNum: this.ruleForm.deviceNum ,status: this.ruleForm.status,
        buyerPhone: this.ruleForm.buyerPhone, buyerName: this.ruleForm.buyerName ,buyerAddress: this.ruleForm.buyerAddress,
        expressName: this.ruleForm.expressName ,expressId: this.ruleForm.expressId,remark: this.ruleForm.remark});

      //更新订单列表
      API.POST(URL.DEVICE_OUT_REPLACE_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.$router.push("/device/out");
            this.$message({
            message: '退/换货成功',
            type: 'success'
            });
          }
        })
        .catch(err => {
          this.confirm=false;
          console.log(err);
        });
    },

  },
  beforeUpdate() {
      if( this.ruleForm.buyerPhone != '' & this.ruleForm.buyerName != ''& this.ruleForm.buyerAddress != '' &
        this.ruleForm.expressName != ''& this.ruleForm.expressId != '' & this.ruleForm.remark != '' & this.ruleForm.status != '')
      {
        this.confirm = false;
      }
      else{
        this.confirm = true;
      }
  },
  created() {
    this.ruleForm.deviceNum = this.$route.query.deviceNum;
  }
};
</script>

<style scoped>
  .editDialog{
    margin:center;
  }
</style>
