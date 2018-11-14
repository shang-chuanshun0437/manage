<template>
<div id = "app">
<el-row>
    <div >
     <Top></Top>
    </div>
</el-row>
  <router-view></router-view>
</div>

</template>

<script>

import Top from './components/common/Top'

export default {
  name: 'App',
  components: {
    Top,
  },
  created() {
    let user = JSON.parse(window.localStorage.getItem('access-user'));
    let result = {
      userPhone:user.userPhone,
      token:user.token
    };
    this.$store.dispatch("login/login",result);
  },
}
</script>

<style>

</style>
