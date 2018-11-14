<template>
 <!-- 头部区域 -->
 <div class="header">
   <el-row>
      <el-col :span="24" class="weiyi-header">
        <div>
          <img class = "weiyi-logo" src="@/assets/logo.png">
        </div>
        <div class = "title">
            <span style = "color:#ffffff;font-size: 16px;">
              智能锁 · 管理平台
            </span>
        </div>
        <div class = "weiyi-top-dropdown">
            <span style = "color:#ffffff;font-size: 15px;">
              hi &nbsp;&nbsp;{{userPhone}} &nbsp; | &nbsp;
              <el-button type="text" style = "color:#ffffff;font-size: 15px;" >退出</el-button>
            </span>
        </div>
        </el-col>
    </el-row>
 </div>
</template>

<script>
  import { mapState } from "vuex";
  import ChangePwd from "../../views/account/ChangPwd";
  export default {
    name: 'Top',
    components: {
      ChangePwd,
    },
    data () {
      return {
        pwdShow: false,
        //userPhone: 'Welcome',
      }
    },
    created() {

    },
    methods:{
      logout(){
        this.$router.push('/login');
      },
    },
    computed: {
      ...mapState("top", {
        show: state => state.show,
      }),
      ...mapState("login", {
        userPhone: state => state.userPhone,
      }),
    },
}
</script>

<style scoped>
  .header{
    position: fixed;
    left:0;
    top:0;
    width: 100%;
    margin: 0;
    height: 50px;
    background: #304156;
    text-align: center;
    z-index: 1000;
    color: rgb(255, 255, 255);
  }
  .title{
    position: absolute;
    left: 150px;
    top: 35%;
  }
</style>
