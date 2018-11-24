import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/common/Login'
import Home from '@/components/Home'

import DeviceInList from '../views/device/deviceIn/DeviceInList'
import DeviceInOutOf from '../views/device/deviceIn/DeviceInOutOf'
import DeviceOutList from '../views/device/deviceOut/DeviceOutList'
import DeviceOutReplace from '../views/device/deviceOut/DeviceOutReplace'
import UserList from '../views/user/UserList'

import NewOrderEdit from '../views/order/newOrder/NewOrderEdit'
import NewOrderList from '../views/order/newOrder/NewOrderList'
import ReplaceOrderList from '../views/order/replaceOrder/ReplaceOrderList'
import RepairOrderList from '../views/order/repairOrder/RepairOrderList'
import RepairOrderOutOf from '../views/order/repairOrder/RepairOrderOutOf'
import RepairOrderAdd from '../views/order/repairOrder/RepairOrderAdd'

import Account from '../views/account/Account'

import VerifyCode from '../views/verifyCode/VerifyCode'
import InterfaceAccess from '../views/interface/InterfaceAccess'
import OpenHistory from '../views/openHistory/OpenHistory'
import Role from '../views/role/Role'
import UserRoleList from '../views/userRole/UserRoleList'

// 懒加载方式，当路由被访问的时候才加载对应组件
//const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: Login
        },

        {
            path: '/',
            redirect: '/device/in'
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            redirect: '/device/in',
            children: [
              { path: '/device/in', component: DeviceInList, name: 'deviceInList' },
              { path: '/device/in/deviceOut', component: DeviceInOutOf, name: 'deviceInOutOf' },
              { path: '/device/out', component: DeviceOutList, name: 'deviceOutList' },
              { path: '/device/out/replace', component: DeviceOutReplace, name: 'deviceOutReplace' },
            ]
        },
        {
          path: '/order',
          name: 'order',
          component: Home,
          redirect: '/device/order/newOrder',
          children: [
            { path: '/device/order/newOrder', component: NewOrderList, name: 'newOrderList' },
            { path: '/device/order/newOrder/edit', component: NewOrderEdit, name: 'newOrderEdit' },
            { path: '/device/order/replaceOrder', component: ReplaceOrderList, name: 'replaceOrderList' },
            { path: '/device/order/repairOrderList', component: RepairOrderList, name: 'repairOrderList' },
            { path: '/device/order/repairOrder/out', component: RepairOrderOutOf, name: 'repairOrderOutOf' },
            { path: '/device/order/repairOrder/add', component: RepairOrderAdd, name: 'repairOrderAdd' },
          ]
        },
      {
        path: '/all/user',
        name: 'user',
        component: Home,
        redirect: '/all/user/list',
        children: [
          { path: '/all/user/list', component: UserList, name: 'userList' },
        ]
      },
      {
        path: '/verify',
        name: 'verify',
        component: Home,
        redirect: '/verify/code/list',
        children: [
          { path: '/verify/code/list', component: VerifyCode, name: 'verifyCode' },
        ]
      },
      {
        path: '/interface',
        name: 'interface',
        component: Home,
        redirect: '/interface/access/list',
        children: [
          { path: '/interface/access/list', component: InterfaceAccess, name: 'interfaceAccess' },
          { path: '/role/list', component: Role, name: 'role' },
          { path: '/userRole/list', component: UserRoleList, name: 'userRoleList' },
        ]
      },
      {
        path: '/open/door',
        name: 'open',
        component: Home,
        redirect: '/open/door/history/list',
        children: [
          { path: '/open/door/history/list', component: OpenHistory, name: 'openHistory' },
        ]
      },
        {
          path: '/account/private',
          name: 'account',
          component: Account,
        },

    ]

})

router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/login')) {
        window.localStorage.removeItem('access-user')
        next()
    } else {
        let user = JSON.parse(window.localStorage.getItem('access-user'))
        if (!user) {
            next({ path: '/login' })
        } else {
            next()
        }
    }
})

export default router
