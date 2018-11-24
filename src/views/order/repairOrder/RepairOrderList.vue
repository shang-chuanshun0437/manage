/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">报修订单</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="20">
        <SearchForm :searchData="searchData" @handleSubmit="handleSearch"></SearchForm>
      </el-col>
      <el-col :span="3" :offset="1" align="center">
        <el-button type="primary" icon="el-icon-plus" :disabled="bindDisabled" @click="add()">新增报修订单</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="100px" prop="id" label="ID" align="center"></el-table-column>
      <el-table-column width="150px" prop="deviceNum" label="设备编号" align="center"></el-table-column>
      <el-table-column width="150px" prop="remark" label="报修原因" align="center"></el-table-column>
      <el-table-column width="150px" prop="buyerPhone" label="买家手机号" align="center"></el-table-column>
      <el-table-column width="150px" prop="buyerName" label="买家名称" align="center"></el-table-column>
      <el-table-column width="150px" prop="buyerAddress" label="发货地址" align="center"></el-table-column>
      <el-table-column width="150px" prop="expressName" label="快递公司" align="center"></el-table-column>
      <el-table-column width="150px" prop="expressId" label="快递单号" align="center"></el-table-column>
      <el-table-column width="180px" prop="createTime" label="创建日期" align="center"></el-table-column>
      <el-table-column width="100" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="sendOut(scope.row)">发货</el-button>
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
import SearchForm from "../../common/SearchForm";
import { mapState } from "vuex";
import * as API from "../../../axios/api";
import * as URL from "../../../axios/url";

const searchData = [
  {
    name: "设备编号",
    type: "input",
    placeholder: "请输入设备编号",
    key: "deviceNum"
  },
  {
    name: "订单编号",
    type: "input",
    placeholder: "请输入订单编号",
    key: "orderId"
  },
  {
    name: "快递公司",
    type: "input",
    placeholder: "请输入快递公司",
    key: "expressName"
  },
  {
    name: "快递单号",
    type: "input",
    placeholder: "请输入快递单号",
    key: "expressId"
  },
  {
    name: "买家手机号",
    type: "input",
    placeholder: "买家手机号",
    key: "buyerPhone"
  },
];
export default {
  components: {
    SearchForm,
  },
  computed: {
    ...mapState("orderSell", {
      total: state => state.total,
      list: state => state.list
    })
  },
  data() {
    return {
      loading: true,
      bindDisabled:false,
      currentPage: 1,
      searchData: searchData,
      addShow:false,
      editShow:false,
      editDeviceNum:'',
      outOfShow:false,
      outOfDeviceNum:'',
      filters: {
        deviceNum: "",
        orderId: "",
        expressName: "",
        buyerPhone: "",
      }
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      console.log('refresh');
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,
      deviceNum: this.filters.deviceNum ,currentPage: this.currentPage, status: 6 });

      //发送查询报修订单列表请求
      API.POST(URL.ORDER_SELL_LIST_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("orderSell/list",res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSearch(params) {
      this.filters=Object.assign({},params);
      this.refresh();
    },
    sendOut(row) {
      //发货
      this.$router.push({path:"/device/order/repairOrder/out",query:{id:row.id,deviceNum:row.deviceNum,remark: row.remark,
          buyerPhone:row.buyerPhone,buyerName: row.buyerName,buyerAddress :row.buyerAddress}});
    },
    add() {
      this.$router.push("/device/order/repairOrder/add");
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
