import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login";
import deviceIn from './modules/deviceIn'
import deviceOut from './modules/deviceOut'
import deviceUser from "./modules/deviceUser";
import orderSell from "./modules/orderSell";
import user from "./modules/user";
import top from "./modules/top";
import verifyCode from "./modules/verifyCode";

import getters from "./getters";
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
      login,
      deviceIn,
      deviceOut,
      deviceUser,
      orderSell,
      top,
      user,
      verifyCode,
    },
    getters
});
