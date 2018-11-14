/*
 * Author: 17030360
 * Email:wdnybbz@163.com
 */
import * as types from "../mutation-types";

const getters = {
  total: state => state.total,
  list: state => state.list,
};

const state = {
  total: 0,
  list: [],
};
const actions = {
    list({ commit }, param) {
        return new Promise((resolve, reject) => {
            commit(types.DEVICE_IN_LIST, param);
        });
    },
};
const mutations = {
    [types.DEVICE_IN_LIST](state, param) {
        console.log(param);
        state.total = param.count;
        if (param.count === 0) {
            state.list = null;
        } else {
            state.list = [].concat(param.getDeviceInListResponses);
        }

        console.log(state.total);
    },
};

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
};