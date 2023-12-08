// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    eno: '',  //当前登录的员工编号
    ename: '',  //员工名字
    elevel: '', //员工权限（1普通员工2仓库管理员3高级管理员）
  }
})
