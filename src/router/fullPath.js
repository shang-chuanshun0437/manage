import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/common/Login'
import Home from '@/components/Home'

import DeviceInList from '../views/device/deviceIn/DeviceInList'
import DeviceOutList from '../views/device/deviceOut/DeviceOutList'
import UserList from '../views/user/UserList'

import NewOrderList from '../views/order/newOrder/NewOrderList'
import HistoryOrderList from '../views/order/historyOrder/HistoryOrderList'
import OtherOrderList from '../views/order/otherOrder/OtherOrderList'

import Account from '../views/account/Account'

import VerifyCode from '../views/verifyCode/VerifyCode'
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
                { path: '/device/out', component: DeviceOutList, name: 'deviceOutList' }
            ]
        },
        {
          path: '/order',
          name: 'order',
          component: Home,
          redirect: '/device/order/newOrder',
          children: [
            { path: '/device/order/newOrder', component: NewOrderList, name: 'newOrderList' },
            { path: '/device/order/historyOrder', component: HistoryOrderList, name: 'historyOrderList' },
            { path: '/device/order/otherOrder', component: OtherOrderList, name: 'otherOrderList' },
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
