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
      <el-col :span="3" :offset="1" align="center">
        <el-button type="primary" icon="el-icon-plus" :disabled="bindDisabled" @click="addDevice()">设备入库</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="deviceNum" label="设备编号" align="center"></el-table-column>
      <el-table-column prop="bluetoothMac" label="设备MAC" align="center"></el-table-column>
      <el-table-column prop="version" label="硬件版本" align="center"></el-table-column>
      <el-table-column prop="userPhone" label="入库者手机号" align="center"></el-table-column>
      <el-table-column prop="userName" label="入库者名称" align="center"></el-table-column>
      <el-table-column width="180" prop="createTime" label="入库时间" align="center"></el-table-column>
      <el-table-column width="270" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.deviceNum)">编辑</el-button>
          <el-button size="mini" @click="handleOut(scope.row.deviceNum,scope.row.deviceName)">发货</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.deviceNum)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="text-align:center;margin-top:15px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next,jumper" :total="total">
      </el-pagination>
    </el-row>

    <AddDeviceIn :show.sync="addShow" ></AddDeviceIn>
    <EditDeviceIn :show.sync="editShow" :deviceNum.sync="editDeviceNum"></EditDeviceIn>
    <DeviceInOutOf :show.sync="outOfShow" :deviceNum.sync="outOfDeviceNum"></DeviceInOutOf>
  </div>

</template>

<script>
import SearchForm from "../../common/SearchForm";
import { mapState } from "vuex";
import * as API from "../../../axios/api";
import * as URL from "../../../axios/url";
import AddDeviceIn from './AddDeviceIn'
import EditDeviceIn from './EditDeviceIn'
import DeviceInOutOf from './DeviceInOutOf'
const searchData = [
  {
    name: "设备编号",
    type: "input",
    placeholder: "请输入设备编号",
    key: "deviceNum"
  },
  {
    name: "设备名称",
    type: "input",
    placeholder: "请输入设备名称",
    key: "deviceName"
  },
];
export default {
  components: {
    SearchForm,
    AddDeviceIn,
    EditDeviceIn,
    DeviceInOutOf
  },
  computed: {
    ...mapState("deviceIn", {
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
        deviceName: ""
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
      deviceNum: this.filters.deviceNum ,currentPage: this.currentPage });

      //发送查询入库设备列表请求
      API.POST(URL.DEVICE_IN_LIST_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("deviceIn/list",res);
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
    addDevice() {
      this.addShow = true;
      console.log('binddevice');
    },
    clickRow(row){
      this.$refs.moviesTable.toggleRowSelection(row)
    },
    handleEdit(deviceNum) {
      this.editDeviceNum = deviceNum;
      this.editShow = true;
    },
    handleOut(deviceNum,deviceName) {
      this.outOfDeviceNum = deviceNum;
      this.outOfShow = true;
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
