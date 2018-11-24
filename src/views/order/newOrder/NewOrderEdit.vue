/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label="修改订单">
      <el-form-item  label="ID" prop="id">
        <el-col :span="12">
          <el-input v-model="ruleForm.id" :disabled="true"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item  label="设备编号" prop="deviceNum">
        <el-col :span="12">
          <el-input v-model="ruleForm.deviceNum" placeholder="请输入设备编号"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item  label="设备价格" prop="unitPrice">
        <el-col :span="12">
          <el-input v-model="ruleForm.unitPrice" placeholder="请输入设备价格"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderId">
        <el-col :span="12">
          <el-input v-model="ruleForm.orderId" placeholder="请输入订单编号"></el-input>
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
      ruleForm: {
        id:"",
        deviceNum:"",
        unitPrice:"",
        orderId: "",
        buyerPhone: "",
        buyerName: "",
        buyerAddress: "",
        expressName: "",
        expressId: "",
        postage:"",
        remark: "",
      },
      rules: {
        orderId: [
          { required: true, message: "请输入订单编号", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "请输入设备价格", trigger: "blur" }
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
      this.$router.push("/device/order/newOrder");
    },
    confirmOk() {
      this.confirm=true;
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone ,token: user.token ,
        id: this.ruleForm.id,orderId: this.ruleForm.orderId ,
        deviceNum: this.ruleForm.deviceNum ,unitPrice: this.ruleForm.unitPrice,
        buyerPhone: this.ruleForm.buyerPhone, buyerName: this.ruleForm.buyerName ,buyerAddress: this.ruleForm.buyerAddress,
        expressName: this.ruleForm.expressName ,expressId: this.ruleForm.expressId,postage: this.ruleForm.postage,remark: this.ruleForm.remark});

      //更新订单列表
      API.POST(URL.ORDER_SELL_UPDATE_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.confirm=false;
            this.$router.push("/device/order/newOrder");
            this.$message({
            message: '更新成功',
            type: 'success'
            });
          }
        })
        .catch(err => {
          this.confirm=false;
          console.log(err);
        });
    },
    refresh() {
      //根据ID去查询订单详情
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,
        id: this.ruleForm.id ,currentPage: 1, status: 2 });

      //发送查询订单列表请求
      API.POST(URL.ORDER_SELL_LIST_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            if(res.orderSells  && res.orderSells.length>0) {
              res.orderSells.forEach(e => {
                this.ruleForm.id = e.id;
                this.ruleForm.deviceNum = e.deviceNum;
                this.ruleForm.unitPrice = e.unitPrice;
                this.ruleForm.orderId = e.orderId;
                this.ruleForm.buyerPhone = e.buyerPhone;
                this.ruleForm.buyerName = e.buyerName;
                this.ruleForm.buyerAddress = e.buyerAddress;
                this.ruleForm.expressName = e.expressName;
                this.ruleForm.expressId = e.expressId;
                this.ruleForm.postage = e.postage;
                this.ruleForm.remark = e.remark;
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
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
    this.ruleForm.id = this.$route.query.id;
    this.refresh();
  }
};
</script>

<style scoped>
  .editDialog{
    margin:center;
  }
</style>
