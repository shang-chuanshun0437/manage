/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">入库列表</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="20">
        <SearchForm :searchData="searchData" @handleSubmit="handleSearch"></SearchForm>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="150px" prop="orderId" label="订单编号" align="center"></el-table-column>
      <el-table-column width="150px" prop="deviceNum" label="设备编号" align="center"></el-table-column>
      <el-table-column width="150px" prop="buyerPhone" label="买家手机号" align="center"></el-table-column>
      <el-table-column width="150px" prop="buyerName" label="买家名称" align="center"></el-table-column>
      <el-table-column width="150px" prop="buyerAddress" label="收货地址" align="center"></el-table-column>
      <el-table-column width="150px" prop="expressName" label="快递公司" align="center"></el-table-column>
      <el-table-column width="150px" prop="expressId" label="快递单号" align="center"></el-table-column>
      <el-table-column width="150px" prop="createTime" label="创建日期" align="center"></el-table-column>
      <el-table-column width="150px" prop="updateTime" label="签收日期" align="center"></el-table-column>
      <el-table-column width="150px" prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column width="100" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="sign(scope.row.expressId)">退换货</el-button>
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
      deviceNum: this.filters.deviceNum ,currentPage: this.currentPage, status: 3 });

      //发送查询订单列表请求
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
      console.log(params);
      this.filters=Object.assign({},params);
      this.refresh();
    },
    sign(expressId) {
      //根据订单编号更新订单
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,
        expressId: expressId, status: 3 });
      API.POST(URL.ORDER_SELL_UPDATE_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.$message({
              message: '签收成功',
              type: 'success'
            });
            this.refresh();
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    handleEdit(deviceNum) {
      this.editDeviceNum = deviceNum;
      this.editShow = true;
    },
    update(param) {

      this.refresh();
    },
    clickRow(row){
      this.$refs.moviesTable.toggleRowSelection(row)
    },
    handleDelete(deviceNum) {
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,deviceNum: deviceNum});

      swal({
        title: "确定？",
        text: "你确定要删除编号为:" + deviceNum + "  设备吗？",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          //绑定设备
          API.POST(URL.DEVICE_IN_DELETE_URL, param)
            .then(res => {
              if (res.result.retCode === 0) {
                swal({
                    title: "已删除",
                    text: "删除用户成功",
                    icon: "success",
                    button: "确认"
                  }).then(() => {
                    console.log('unbindDevice');
                    this.refresh();
                  });
                } else if (res.result.retCode === 1008) {
                  swal({
                    title: "删除失败!",
                    text: "请输入正确的设备编号",
                    icon: "error",
                    button: "确认"
                  });
                }else if(res.result.retCode === 1009){
                  swal({
                    title: "删除失败!",
                    text: "该设备下还存在其他用户，请删除其他用户后，再删除该设备！",
                    icon: "error",
                    button: "确认"
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
              console.log(err.response.status);
            });
          }
        })
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
