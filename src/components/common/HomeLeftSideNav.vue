<template>
 <!-- 首页左侧导航栏 -->
 <el-row>

   <el-col :span="24" class="middle">

    <div>
      <el-menu :default-active="$route.path" router class="el-menu-demo"
               background-color="#eee" text-color="#000" active-text-color="#6495ED">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>仓库管理</span>
            </template>
            <el-menu-item index="/device/in">入库设备</el-menu-item>
            <el-menu-item index="/device/out">出库设备</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-ali-orderedlist"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/device/order/newOrder">发货订单</el-menu-item>
            <el-menu-item index="/device/order/historyOrder">签收订单</el-menu-item>
            <el-menu-item index="/device/order/otherOrder">其它订单</el-menu-item>
          </el-submenu>
          <el-menu-item index="/all/user/list">
            <i class="el-icon-ali-LC_icon_user_group_add"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/verify/code/list">
            <i class="el-icon-ali-navicon-dxgl"></i>
            <span slot="title">短信统计</span>
          </el-menu-item>
          <el-menu-item index="/open/door/history/list">
            <i class="el-icon-ali-doorhandle"></i>
            <span slot="title">开门记录</span>
          </el-menu-item>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/role/list">角色管理</el-menu-item>
            <el-menu-item index="/userRole/list">管理员管理</el-menu-item>
            <el-menu-item index="/interface/access/list">接口访问统计</el-menu-item>
          </el-submenu>
      </el-menu>
    </div>
    <!--右侧内容区-->
     <!--右侧内容区-->
      <section class="content-container">
        <div>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HomeLeftSideNav',
  data () {
    return {
      username: 'Weflcome'
    }
  }
}
</script>

<style scoped>
 /* 中间样式，包含左侧导航栏和右侧内容 flex布局 */
  .middle {
    display: flex;
    position: fixed;
    top: 50px;
    left:0px;
    bottom: 100px;
  }
  .el-menu-demo{
    width:200px;
    background-color: rgb(48, 65, 86);
    min-height: 100%;
    min-height: 700px;
  }
  /* 右侧内容区域 */
  .content-container {
    background-color: #f0f3f5;
    flex: 1;
    overflow-y: auto;
    min-height: 100%;
    min-height: 700px;
    padding: 10px;
    padding-bottom: 1px;
  }

  .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
  }
  .el-menu-item.is-active {
   background-color: rgb(240, 243, 245) !important;
  }

</style>
