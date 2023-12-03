// pages/Output/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'123',
    password:'123',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 得到输入框中的用户名和密码
  getUsername: function (e) {
    var value=e.detail.value;
    this.setData({
      username:value,
    })
    wx.setStorageSync('username', value);
  },
  getPassword: function(e){
    var value=e.detail.value;
    this.setData({
      password:value,
    })
    wx.setStorageSync('password', value);
  },
  //需要在这个函数中与后端交互，验证数据库中是否有这个用户，
  //得到用户信息，设置一个全局变量，标记已经登录
  doLogin: function(e) {

    // console.log(this.data.username,this.data.password);
    wx.redirectTo({
      url: '/pages/InventoryInquiry/index',
    })
  }
})