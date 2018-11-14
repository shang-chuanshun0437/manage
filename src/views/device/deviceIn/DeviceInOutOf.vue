/*
 * Project: f:\2017Project\game-cms
 * Copyright (c) 2018 SN
 */

<template>
    <el-dialog title="设备出库" :modal=true :modal-append-to-body="false" :visible="show" top="15%" class="editDialog" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item  label="设备编号" prop="deviceNum">
          <el-col :span="12">
            <el-input v-model="deviceNum" :disabled="true"></el-input>
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
        <el-form-item label="备注信息" prop="remark">
          <el-col :span="12">
            <el-input v-model="ruleForm.remark" placeholder="请输入备注信息"></el-input>
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
        orderId: "",
        buyerPhone: "",
        buyerName: "",
        buyerAddress: "",
        expressName: "",
        expressId: "",
        remark: "",
      },
      rules: {
        orderId: [
          { required: true, message: "请输入订单编号", trigger: "blur" }
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
          { required: true, message: "请输入备注信息", trigger: "blur" }
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
      var param = Object.assign({}, {userPhone: user.userPhone ,token: user.token ,orderId: this.ruleForm.orderId ,
      deviceNum: this.deviceNum ,buyerPhone: this.ruleForm.buyerPhone, buyerName: this.ruleForm.buyerName ,buyerAddress: this.ruleForm.buyerAddress,
        expressName: this.ruleForm.expressName ,expressId: this.ruleForm.expressId,remark: this.ruleForm.remark});

      //绑定设备
      API.POST(URL.DEVICE_IN_OUT_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.confirm=false;
            this.$emit("update:show", false);
            parent.location.reload();
            this.$message({
            message: '出库成功',
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
    console.log('editDevice');
  }
};
</script>

<style scoped>
  .editDialog{
    margin:center;
  }
</style>
