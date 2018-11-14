/*
 * Email:519983770@qq.com
 */

//注册用的URL
export const LOGIN_URL = "/user/login"; //登录

//账户
export const ACCOUNT_INFO_URL = "/user/query/userInfo"; //查询账户详情
export const ACCOUNT_UPDATE_URL = "/user/updateUser"; //更新账户
export const MODIFY_PWD_URL = "/user/modifyPassword"; //修改账户的密码

//设备入库
export const DEVICE_IN_ADD_URL = "/device/deviceIn/addDevice"; //设备入库
export const DEVICE_IN_LIST_URL = "/device/deviceIn/queryList"; //查询入库设备列表
export const DEVICE_IN_DELETE_URL = "/device/deviceIn/deleteDevice"; //删除入库设备
export const DEVICE_IN_UPDATE_URL = "/device/deviceIn/updateDevice"; //更新入库设备
export const DEVICE_IN_OUT_URL = "/device/deviceIn/outOfDevice"; //设备出库

//出库设备
export const DEVICE_OUT_LIST_URL = "/device/queryDeviceList"; //查询出库设备列表
export const DEVICE_OUT_UPDATE_URL = "/device/updateDevice"; //修改出库设备

//订单
export const ORDER_SELL_LIST_URL = "/order/query/orderSell/list"; //查询订单列表
export const ORDER_SELL_UPDATE_URL = "/order/modify/orderSell"; //更新订单

//用户管理
export const QUERY_ALL_USER_URL = "/user/query/allUser"; //查询用户列表

//短信统计
export const VERIFY_CODE_URL = "/verifyCode/query/list"; //查询短信记录
