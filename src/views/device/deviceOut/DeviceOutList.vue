/*
 * Author: 阿甘
 * Email:519983770@qq.com
 */

<template>
  <div >
    <div class="panel-heading">
      <span  class="panel-text">出库列表</span>
    </div>
    <el-row style="top:5px">
      <el-col :span="24">
        <SearchForm :searchData="searchData" ref="searchBox" @handleSubmit="handleSearch" style="display:inline-block"></SearchForm>
        <el-button class="clearQuery" @click="clearQuery">置空</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" style="width: 100%" @row-click="clickRow" border stripe ref="moviesTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="deviceNum" label="设备编号" align="center"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
      <el-table-column prop="ownerPhone" label="所有者账号" align="center"></el-table-column>
      <el-table-column width="80" prop="userCount" label="用户数量" align="center"></el-table-column>
      <el-table-column prop="bluetoothMac" label="设备MAC" align="center"></el-table-column>
      <el-table-column prop="version" label="硬件版本" align="center"></el-table-column>
      <el-table-column width="90px" prop="status" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期" align="center"></el-table-column>
      <el-table-column prop="createTime" label="出厂日期" align="center"></el-table-column>
      <el-table-column width="150px" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.deviceNum,scope.row.status)">编辑</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.status===0" @click="enableDevice(scope.row.deviceNum,scope.row.status)">停用</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.status===1" @click="enableDevice(scope.row.deviceNum,scope.row.status)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="text-align:center;margin-top:15px;">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next,jumper" :total="total">
      </el-pagination>
    </el-row>
    <EditDeviceOut :show.sync="editShow" :deviceNum.sync="editDeviceNum"></EditDeviceOut>
  </div>

</template>

<script>
import SearchForm from "../../common/SearchForm";
import EditDeviceOut from "./EditDeviceOut";
import { mapState } from "vuex";
import * as API from "../../../axios/api";
import * as URL from "../../../axios/url";

const searchData = [
  {
    name: "编号",
    type: "input",
    placeholder: "请输入设备编号",
    key: "deviceNum"
  },
  {
    name: "名称",
    type: "input",
    placeholder: "请输入设备名称",
    key: "deviceName"
  },
  {
    name: "管理员",
    type: "input",
    placeholder: "请输入管理员账号",
    key: "ownerPhone",
  },
  {
    name: "设备状态",
    type: "select",
    key: "status",
    options: ["启用", "停用"]
  },
];
export default {
  components: {
    SearchForm,
    EditDeviceOut,
  },
  computed: {
    ...mapState("deviceOut", {
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
      bindShow:false,
      editShow:false,
      bindForUserShow:false,
      editDeviceNum:'',
      forUserDeviceNum:'',
      forUserDeviceName:'',
      filters: {
        deviceNum: "",
        deviceName: "",
        status:"",
        ownerPhone:"",
      }
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      console.log("deviceOut refresh");
      console.log(this.filters.status);
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,deviceName: this.filters.deviceName ,
      deviceNum: this.filters.deviceNum ,currentPage: this.currentPage,status: this.filters.status});

      //发送查询出库设备列表请求
      API.POST(URL.DEVICE_OUT_LIST_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.loading = false;
            this.$store.dispatch("deviceOut/list",res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clearQuery() {
      let params = {};
      this.filters = Object.assign({},params);
      this.refresh(params);
      this.$refs.searchBox.onClear();
    },
    handleSearch(params) {
      this.filters = Object.assign({},params);
      if (this.filters.status == "停用") {
        this.filters.status = 1;
      } else if (this.filters.status == "启用") {
        this.filters.status = 0;
      }
      this.refresh();
    },
    enableDevice(deviceNum,status) {
      let msg = "";
      let title = "";
      let text = "";
      if (status === 0)
      {
        status = 1;
        msg = "你确定要停用: " + deviceNum + "  设备吗？";
        title = "已停用";
        text = "停用成功";
      }else {
        msg = "你确定要启用: " + deviceNum + "  设备吗？"
        status = 0;
        title = "已启用";
        text = "启用成功";
      }
      let user = JSON.parse(window.localStorage.getItem('access-user'));
      var param = Object.assign({}, {userPhone: user.userPhone , token: user.token ,deviceNum: deviceNum,status: status});

      swal({
        title: "确定？",
        text: msg,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          //更新出库设备状态
          API.POST(URL.DEVICE_OUT_UPDATE_URL, param)
            .then(res => {
              if (res.result.retCode === 0) {
                swal({
                  title: title,
                  text: text,
                  icon: "success",
                  button: "确认"
                }).then(() => {
                  console.log('unbindDevice');
                  this.refresh();
                });
              } else {
                swal({
                  title: "操作失败!",
                  text: "请输入正确的设备编号",
                  icon: "error",
                  button: "确认"
                });
                }
            })
            .catch(err => {
              this.$message.error('系统正在升级中，请联系管理员！');
              console.log(err.response.status);
            });
        }
      })
    },
    clickRow(row){
      this.$refs.moviesTable.toggleRowSelection(row)
    },
    handleEdit(deviceNum,status) {
      if (status === 0) {
        this.$message.error('设备处于启用状态，无法编辑，请停用后再编辑！');
      }
      else {
        this.editDeviceNum = deviceNum;
        this.editShow = true;
      }
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
  .clearQuery{
    position:relative;
    top:8px;
  }
  .panel-text{
    position:relative;
    left:30px;
    top:1px;
    font-size:16px;
  }
</style>
